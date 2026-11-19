# Azure Deployment Guide — EWB Kiosk (Next.js 16)

This guide covers deploying the `ewb-kiosk` Next.js application to Microsoft Azure using Azure App Service (Node 20 LTS) with CI/CD via Azure DevOps Pipelines, across three environments: **Staging → UAT → Production**.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Azure Resources Required](#2-azure-resources-required)
3. [Initial Azure CLI Provisioning](#3-initial-azure-cli-provisioning)
4. [App Service Configuration](#4-app-service-configuration)
5. [Secrets Management](#5-secrets-management)
6. [CI/CD — Azure DevOps Pipeline](#6-cicd--azure-devops-pipeline)
7. [Network Considerations](#7-network-considerations)
8. [Custom Domain and SSL](#8-custom-domain-and-ssl)
9. [Deployment Slots (Alternative Architecture)](#9-deployment-slots-alternative-architecture)
10. [Post-Deployment Checklist](#10-post-deployment-checklist)

---

## 1. Architecture Overview

```
[ Branch LAN ]
  Kiosk Device (touch screen)
        |
        | HTTPS — bank WAN / Azure Private Link
        v
[ Azure App Service (Linux, Node 20 LTS) ]
  app-ewb-kiosk-stg  /  app-ewb-kiosk-uat  /  app-ewb-kiosk-prod
        |
        | VNet Integration (outbound — private, no public internet)
        v
[ Azure VNet: vnet-ewb-kiosk ]
        |
        | Private Endpoint / VNet Peering
        v
[ Drupal CMS ] — EWB's existing Azure infrastructure
  stg-ewb.quailshack.com / uat2.eastwestbanker.com / eastwestbanker.com
        ^
        | Key Vault reference (secret resolution at startup)
[ Azure Key Vault: kv-ewb-kiosk ]
```

**Key architectural decisions:**

- App Service VNet Integration routes Next.js → Drupal traffic privately — no public internet hop between the two.
- Kiosk devices reach the App Service via the bank's internal WAN or Azure Private Link.
- A NAT Gateway on the App Service subnet provides a static outbound IP for Drupal IP allowlisting.
- Three separate App Service instances (one per environment) give full isolation. See [Section 9](#9-deployment-slots-alternative-architecture) for the cheaper Deployment Slots alternative.

---

## 2. Azure Resources Required

| Resource | SKU / Notes |
|---|---|
| App Service Plan | P1v3 Linux — required for VNet Integration (B-series does not support it) |
| App Service × 3 | One per environment: staging, UAT, production |
| Azure Key Vault | Standard tier, 1 shared vault namespaced by environment prefix |
| Azure VNet | With delegated subnet for App Service VNet Integration |
| NAT Gateway + Public IP | Static outbound IP for Drupal allowlisting (optional but recommended) |
| Azure DevOps Project | Pipelines, Repos, Environments (approval gates) |
| Application Insights | Runtime monitoring and alerting (recommended) |

---

## 3. Initial Azure CLI Provisioning

Run these commands once. Set the variables at the top and paste the entire block.

```bash
# ── Variables ────────────────────────────────────────────────────────────────
SUBSCRIPTION="<your-subscription-id>"
RG="rg-ewb-kiosk"
LOCATION="southeastasia"          # closest Azure region to the Philippines
PLAN="asp-ewb-kiosk"
APP_PROD="app-ewb-kiosk-prod"
APP_UAT="app-ewb-kiosk-uat"
APP_STG="app-ewb-kiosk-stg"
KV="kv-ewb-kiosk"                 # must be globally unique, max 24 chars
VNET="vnet-ewb-kiosk"
SUBNET_APP="snet-appservice"      # delegated — no other resources in this subnet
SUBNET_PE="snet-private-endpoints"

# ── Login ────────────────────────────────────────────────────────────────────
az login
az account set --subscription "$SUBSCRIPTION"

# ── Resource group ───────────────────────────────────────────────────────────
az group create --name "$RG" --location "$LOCATION"

# ── App Service Plan (Linux, P1v3) ───────────────────────────────────────────
az appservice plan create \
  --name "$PLAN" \
  --resource-group "$RG" \
  --location "$LOCATION" \
  --is-linux \
  --sku P1V3

# ── App Services ─────────────────────────────────────────────────────────────
for APP in "$APP_PROD" "$APP_UAT" "$APP_STG"; do
  az webapp create \
    --name "$APP" \
    --resource-group "$RG" \
    --plan "$PLAN" \
    --runtime "NODE:20-lts" \
    --https-only true
done

# ── Key Vault ────────────────────────────────────────────────────────────────
az keyvault create \
  --name "$KV" \
  --resource-group "$RG" \
  --location "$LOCATION" \
  --sku standard

# ── VNet + subnets ───────────────────────────────────────────────────────────
az network vnet create \
  --name "$VNET" \
  --resource-group "$RG" \
  --location "$LOCATION" \
  --address-prefix "10.0.0.0/16"

# Delegated subnet for App Service VNet Integration
az network vnet subnet create \
  --name "$SUBNET_APP" \
  --resource-group "$RG" \
  --vnet-name "$VNET" \
  --address-prefix "10.0.1.0/24" \
  --delegations "Microsoft.Web/serverFarms"

# Subnet for Private Endpoints (Key Vault, Drupal)
az network vnet subnet create \
  --name "$SUBNET_PE" \
  --resource-group "$RG" \
  --vnet-name "$VNET" \
  --address-prefix "10.0.2.0/24"

# ── VNet Integration for each App Service ────────────────────────────────────
for APP in "$APP_PROD" "$APP_UAT" "$APP_STG"; do
  az webapp vnet-integration add \
    --name "$APP" \
    --resource-group "$RG" \
    --vnet "$VNET" \
    --subnet "$SUBNET_APP"
done

# Force all outbound traffic (including internet) through the VNet
for APP in "$APP_PROD" "$APP_UAT" "$APP_STG"; do
  az webapp config appsettings set \
    --name "$APP" \
    --resource-group "$RG" \
    --settings WEBSITE_VNET_ROUTE_ALL=1
done
```

---

## 4. App Service Configuration

### 4.1 Runtime Settings

Apply to each App Service (substitute `$APP` for the target):

```bash
az webapp config set \
  --name "$APP_PROD" \
  --resource-group "$RG" \
  --always-on true \
  --http20-enabled true

# Health check — App Service uses this to detect unhealthy instances
az webapp config set \
  --name "$APP_PROD" \
  --resource-group "$RG" \
  --generic-configurations '{"healthCheckPath": "/"}'
```

> **Always On is critical for a kiosk.** Without it, App Service idles the Node process after 20 minutes of inactivity, causing a cold-start delay when a customer next touches the screen.

### 4.2 Application Settings per Environment

`NEXT_PUBLIC_*` variables are **embedded at build time** by Next.js — they are baked into the compiled JavaScript bundle. They must also be set here so App Service restarts work correctly and for documentation purposes, but the value that ends up in the bundle is determined by what is set when `npm run build` runs in the pipeline (see Section 6).

**Production:**
```bash
az webapp config appsettings set \
  --name "$APP_PROD" \
  --resource-group "$RG" \
  --settings \
    NEXT_PUBLIC_API_BASE_URL="https://eastwestbanker.com" \
    API_ENVIRONMENT="PRODUCTION" \
    WEBSITE_NODE_DEFAULT_VERSION="~20" \
    SCM_DO_BUILD_DURING_DEPLOYMENT="false"
```

**UAT:**
```bash
az webapp config appsettings set \
  --name "$APP_UAT" \
  --resource-group "$RG" \
  --settings \
    NEXT_PUBLIC_API_BASE_URL="https://uat2.eastwestbanker.com" \
    API_ENVIRONMENT="UAT" \
    WEBSITE_NODE_DEFAULT_VERSION="~20" \
    SCM_DO_BUILD_DURING_DEPLOYMENT="false"
```

**Staging:**
```bash
az webapp config appsettings set \
  --name "$APP_STG" \
  --resource-group "$RG" \
  --settings \
    NEXT_PUBLIC_API_BASE_URL="https://stg-ewb.quailshack.com" \
    API_ENVIRONMENT="STAGING" \
    WEBSITE_NODE_DEFAULT_VERSION="~20" \
    SCM_DO_BUILD_DURING_DEPLOYMENT="false"
```

`SCM_DO_BUILD_DURING_DEPLOYMENT=false` prevents App Service from running its own `npm install` on the already-built artifact from the pipeline.

### 4.3 Full Environment Variable Reference

| Variable | STAGING | UAT | PRODUCTION | Build-time? |
|---|---|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `https://stg-ewb.quailshack.com` | `https://uat2.eastwestbanker.com` | `https://eastwestbanker.com` | **Yes** — baked into bundle |
| `API_ENVIRONMENT` | `STAGING` | `UAT` | `PRODUCTION` | No — runtime only |
| `DRUPAL_API_KEY` | required | required | required | No — runtime only |
| `API_BASIC_USER` | required | **not set** | **not set** | No — runtime only |
| `API_BASIC_PASS` | required | **not set** | **not set** | No — runtime only |

`API_BASIC_USER` and `API_BASIC_PASS` are only injected by `lib/api-headers.ts` when `API_ENVIRONMENT` is `LOCAL` or `STAGING`. Do not set them on UAT or Production.

---

## 5. Secrets Management

The app has three runtime secrets: `DRUPAL_API_KEY` (all environments), `API_BASIC_USER` and `API_BASIC_PASS` (Staging only).

### Option A — Azure Key Vault with Managed Identity (Recommended)

Secrets are stored in Key Vault and referenced in App Settings using the `@Microsoft.KeyVault(...)` syntax. The actual secret value is never stored in App Service configuration — Azure resolves it at startup.

**Step 1 — Enable Managed Identity and grant access:**

```bash
# Enable system-assigned managed identity
for APP in "$APP_PROD" "$APP_UAT" "$APP_STG"; do
  az webapp identity assign --name "$APP" --resource-group "$RG"
done

# Grant each identity GET access to Key Vault secrets
for APP in "$APP_PROD" "$APP_UAT" "$APP_STG"; do
  PRINCIPAL=$(az webapp identity show \
    --name "$APP" \
    --resource-group "$RG" \
    --query principalId -o tsv)

  az keyvault set-policy \
    --name "$KV" \
    --object-id "$PRINCIPAL" \
    --secret-permissions get
done
```

**Step 2 — Store secrets in Key Vault (namespaced by environment):**

```bash
# Production
az keyvault secret set --vault-name "$KV" --name "prod-drupal-api-key" --value "<prod-api-key>"

# UAT
az keyvault secret set --vault-name "$KV" --name "uat-drupal-api-key" --value "<uat-api-key>"

# Staging
az keyvault secret set --vault-name "$KV" --name "stg-drupal-api-key"  --value "<stg-api-key>"
az keyvault secret set --vault-name "$KV" --name "stg-api-basic-user"  --value "<stg-basic-user>"
az keyvault secret set --vault-name "$KV" --name "stg-api-basic-pass"  --value "<stg-basic-pass>"
```

**Step 3 — Add Key Vault references as App Settings:**

```bash
KV_URI="https://${KV}.vault.azure.net/secrets"

# Production
az webapp config appsettings set \
  --name "$APP_PROD" --resource-group "$RG" \
  --settings "DRUPAL_API_KEY=@Microsoft.KeyVault(SecretUri=${KV_URI}/prod-drupal-api-key/)"

# UAT
az webapp config appsettings set \
  --name "$APP_UAT" --resource-group "$RG" \
  --settings "DRUPAL_API_KEY=@Microsoft.KeyVault(SecretUri=${KV_URI}/uat-drupal-api-key/)"

# Staging
az webapp config appsettings set \
  --name "$APP_STG" --resource-group "$RG" \
  --settings \
    "DRUPAL_API_KEY=@Microsoft.KeyVault(SecretUri=${KV_URI}/stg-drupal-api-key/)" \
    "API_BASIC_USER=@Microsoft.KeyVault(SecretUri=${KV_URI}/stg-api-basic-user/)" \
    "API_BASIC_PASS=@Microsoft.KeyVault(SecretUri=${KV_URI}/stg-api-basic-pass/)"
```

**Step 4 — Key Vault Private Endpoint (required when VNet Integration is active):**

When `WEBSITE_VNET_ROUTE_ALL=1` is set, all outbound traffic routes through the VNet, so Key Vault must be reachable over a private IP.

```bash
KV_ID=$(az keyvault show --name "$KV" --resource-group "$RG" --query id -o tsv)

az network private-endpoint create \
  --name "pe-kv-ewb-kiosk" \
  --resource-group "$RG" \
  --location "$LOCATION" \
  --vnet-name "$VNET" \
  --subnet "$SUBNET_PE" \
  --private-connection-resource-id "$KV_ID" \
  --group-id vault \
  --connection-name "pec-kv-ewb-kiosk"

# Private DNS Zone so the vault hostname resolves to its private IP inside the VNet
az network private-dns zone create \
  --resource-group "$RG" \
  --name "privatelink.vaultcore.azure.net"

az network private-dns link vnet create \
  --resource-group "$RG" \
  --zone-name "privatelink.vaultcore.azure.net" \
  --name "dnslink-kv-vnet" \
  --virtual-network "$VNET" \
  --registration-enabled false

PE_NIC_ID=$(az network private-endpoint show \
  --name "pe-kv-ewb-kiosk" --resource-group "$RG" \
  --query "networkInterfaces[0].id" -o tsv)

PE_IP=$(az network nic show --ids "$PE_NIC_ID" \
  --query "ipConfigurations[0].privateIPAddress" -o tsv)

az network private-dns record-set a add-record \
  --resource-group "$RG" \
  --zone-name "privatelink.vaultcore.azure.net" \
  --record-set-name "$KV" \
  --ipv4-address "$PE_IP"

# Disable public access to Key Vault once private endpoint is active
az keyvault update \
  --name "$KV" --resource-group "$RG" \
  --public-network-access Disabled
```

**Verification:** In the Azure Portal → App Service → Configuration → Application Settings, a green checkmark next to a Key Vault reference means it resolved successfully. Red means the Managed Identity lacks access or Private DNS is misconfigured.

---

### Option B — App Service Application Settings (Simpler)

Set secrets directly as app settings. They are encrypted at rest by Azure, but visible in the portal to anyone with Contributor access and have no centralized rotation or audit trail.

```bash
# Example for Staging
az webapp config appsettings set \
  --name "$APP_STG" --resource-group "$RG" \
  --settings \
    DRUPAL_API_KEY="<stg-api-key>" \
    API_BASIC_USER="<stg-basic-user>" \
    API_BASIC_PASS="<stg-basic-pass>"
```

Use Option B only for early staging validation. Migrate to Option A before UAT.

---

## 6. CI/CD — Azure DevOps Pipeline

### 6.1 Azure DevOps Prerequisites

1. **Service Connection** — In Azure DevOps → Project Settings → Service Connections, create an Azure Resource Manager connection named `sc-ewb-kiosk-azure` using a Service Principal with Contributor access to the resource group.

2. **Environments** — In Pipelines → Environments, create three environments:
   - `ewb-kiosk-staging` (no approval gate — deploys automatically)
   - `ewb-kiosk-uat` — add an **Approvals and checks → Approval** gate with named approvers
   - `ewb-kiosk-production` — add an Approval gate requiring at least 2 approvers

3. **Variable Group** — In Pipelines → Library, create a variable group named `ewb-kiosk-pipeline-vars` with these variables (mark secrets as secret):
   - `DRUPAL_API_KEY_STG` (secret)
   - `API_BASIC_USER_STG` (secret)
   - `API_BASIC_PASS_STG` (secret)
   - `DRUPAL_API_KEY_UAT` (secret)
   - `DRUPAL_API_KEY_PROD` (secret)

   > These are needed at build time only for Staging, where the Next.js server also runs server-side fetches during build (`getStaticProps` / route handlers). For UAT and Production, secrets are injected at runtime via Key Vault references — they are not needed in the pipeline.

### 6.2 `azure-pipelines.yml`

Place this file at the repository root.

> **Important:** Because `NEXT_PUBLIC_API_BASE_URL` is baked into the compiled JavaScript bundle at build time, each environment requires a **separate build** with the correct URL. The pipeline below runs separate builds per deployment stage.

```yaml
# azure-pipelines.yml
trigger:
  branches:
    include:
      - main

pr: none

variables:
  - group: ewb-kiosk-pipeline-vars
  - name: nodeVersion
    value: '20.x'
  - name: artifactName
    value: 'ewb-kiosk-drop'

stages:

# ─────────────────────────────────────────────────────────────────────────────
# STAGING — build + deploy automatically on push to main
# ─────────────────────────────────────────────────────────────────────────────
- stage: DeployStaging
  displayName: 'Build + Deploy — Staging'
  jobs:
  - deployment: DeployStaging
    displayName: 'Deploy to app-ewb-kiosk-stg'
    environment: 'ewb-kiosk-staging'
    pool:
      vmImage: 'ubuntu-latest'
    strategy:
      runOnce:
        deploy:
          steps:
          - checkout: self

          - task: NodeTool@0
            displayName: 'Use Node $(nodeVersion)'
            inputs:
              versionSpec: $(nodeVersion)

          - script: npm ci
            displayName: 'npm ci'

          - script: npm run lint
            displayName: 'ESLint — fail fast on violations'

          - script: npm run build
            displayName: 'next build (Staging)'
            env:
              NEXT_PUBLIC_API_BASE_URL: 'https://stg-ewb.quailshack.com'
              DRUPAL_API_KEY: $(DRUPAL_API_KEY_STG)
              API_ENVIRONMENT: 'STAGING'
              API_BASIC_USER: $(API_BASIC_USER_STG)
              API_BASIC_PASS: $(API_BASIC_PASS_STG)
              NODE_ENV: production

          - task: ArchiveFiles@2
            displayName: 'Archive build artifact'
            inputs:
              rootFolderOrFile: '$(System.DefaultWorkingDirectory)'
              includeRootFolder: false
              archiveType: zip
              archiveFile: '$(Build.ArtifactStagingDirectory)/$(artifactName).zip'
              replaceExistingArchive: true
              excludePatterns: |
                .git/**
                .next/cache/**
                **/.DS_Store

          - task: AzureWebApp@1
            displayName: 'Deploy to Staging'
            inputs:
              azureSubscription: 'sc-ewb-kiosk-azure'
              appType: 'webAppLinux'
              appName: 'app-ewb-kiosk-stg'
              package: '$(Build.ArtifactStagingDirectory)/$(artifactName).zip'
              runtimeStack: 'NODE|20-lts'
              startUpCommand: 'npm run start'
              deploymentMethod: 'zipDeploy'

# ─────────────────────────────────────────────────────────────────────────────
# UAT — manual approval gate before deployment
# ─────────────────────────────────────────────────────────────────────────────
- stage: DeployUAT
  displayName: 'Build + Deploy — UAT'
  dependsOn: DeployStaging
  condition: succeeded()
  jobs:
  - deployment: DeployUAT
    displayName: 'Deploy to app-ewb-kiosk-uat'
    environment: 'ewb-kiosk-uat'
    pool:
      vmImage: 'ubuntu-latest'
    strategy:
      runOnce:
        deploy:
          steps:
          - checkout: self

          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)

          - script: npm ci
            displayName: 'npm ci'

          - script: npm run build
            displayName: 'next build (UAT)'
            env:
              NEXT_PUBLIC_API_BASE_URL: 'https://uat2.eastwestbanker.com'
              API_ENVIRONMENT: 'UAT'
              NODE_ENV: production

          - task: ArchiveFiles@2
            displayName: 'Archive build artifact'
            inputs:
              rootFolderOrFile: '$(System.DefaultWorkingDirectory)'
              includeRootFolder: false
              archiveType: zip
              archiveFile: '$(Build.ArtifactStagingDirectory)/$(artifactName).zip'
              replaceExistingArchive: true
              excludePatterns: |
                .git/**
                .next/cache/**

          - task: AzureWebApp@1
            displayName: 'Deploy to UAT'
            inputs:
              azureSubscription: 'sc-ewb-kiosk-azure'
              appType: 'webAppLinux'
              appName: 'app-ewb-kiosk-uat'
              package: '$(Build.ArtifactStagingDirectory)/$(artifactName).zip'
              runtimeStack: 'NODE|20-lts'
              startUpCommand: 'npm run start'
              deploymentMethod: 'zipDeploy'

# ─────────────────────────────────────────────────────────────────────────────
# PRODUCTION — manual approval gate before deployment
# ─────────────────────────────────────────────────────────────────────────────
- stage: DeployProduction
  displayName: 'Build + Deploy — Production'
  dependsOn: DeployUAT
  condition: succeeded()
  jobs:
  - deployment: DeployProduction
    displayName: 'Deploy to app-ewb-kiosk-prod'
    environment: 'ewb-kiosk-production'
    pool:
      vmImage: 'ubuntu-latest'
    strategy:
      runOnce:
        deploy:
          steps:
          - checkout: self

          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)

          - script: npm ci
            displayName: 'npm ci'

          - script: npm run build
            displayName: 'next build (Production)'
            env:
              NEXT_PUBLIC_API_BASE_URL: 'https://eastwestbanker.com'
              API_ENVIRONMENT: 'PRODUCTION'
              NODE_ENV: production

          - task: ArchiveFiles@2
            displayName: 'Archive build artifact'
            inputs:
              rootFolderOrFile: '$(System.DefaultWorkingDirectory)'
              includeRootFolder: false
              archiveType: zip
              archiveFile: '$(Build.ArtifactStagingDirectory)/$(artifactName).zip'
              replaceExistingArchive: true
              excludePatterns: |
                .git/**
                .next/cache/**

          - task: AzureWebApp@1
            displayName: 'Deploy to Production'
            inputs:
              azureSubscription: 'sc-ewb-kiosk-azure'
              appType: 'webAppLinux'
              appName: 'app-ewb-kiosk-prod'
              package: '$(Build.ArtifactStagingDirectory)/$(artifactName).zip'
              runtimeStack: 'NODE|20-lts'
              startUpCommand: 'npm run start'
              deploymentMethod: 'zipDeploy'
```

### 6.3 Configuring Approval Gates

In Azure DevOps → Pipelines → Environments:

- Open `ewb-kiosk-uat` → three-dot menu → **Approvals and checks** → **Approvals**. Add the QA lead or project manager. Set timeout to 48 hours.
- Open `ewb-kiosk-production` → same flow. Require **2 approvers** (e.g., IT Manager + Department Head) to satisfy dual-control requirements common in banking environments.
- Optionally add a **Business Hours** check on `ewb-kiosk-production` to prevent off-hours production deployments.

---

## 7. Network Considerations

### 7.1 Kiosk → App Service Access

Kiosk devices are on the bank's branch LAN. Three options for reaching the App Service:

| Scenario | Approach |
|---|---|
| Branch connects over public internet | HTTPS with IP restriction (restrict to branch WAN egress IPs) |
| Branch connects over bank MPLS / SD-WAN | IP-restrict App Service to the predictable branch egress IP range provided by EWB's network team |
| Branch connects over Azure ExpressRoute | App Service Private Endpoint — kiosks reach the app over a private IP, no public exposure at all |

**IP restriction example (public internet with fixed branch IPs):**

```bash
# Allow branch WAN IP range — obtain actual ranges from EWB network team
az webapp config access-restriction add \
  --name "$APP_PROD" \
  --resource-group "$RG" \
  --rule-name "AllowBranchWAN" \
  --action Allow \
  --ip-address "203.0.113.0/24" \
  --priority 100

# Allow Azure DevOps agents (for pipeline health checks and zip deploy)
az webapp config access-restriction add \
  --name "$APP_PROD" \
  --resource-group "$RG" \
  --rule-name "AllowAzureDevOps" \
  --action Allow \
  --service-tag AzureDevOps \
  --priority 200

# Deny everything else
az webapp config access-restriction add \
  --name "$APP_PROD" \
  --resource-group "$RG" \
  --rule-name "DenyAll" \
  --action Deny \
  --ip-address "0.0.0.0/0" \
  --priority 65000
```

### 7.2 App Service → Drupal (Private)

VNet Integration (enabled in Section 3) routes Next.js outbound traffic privately to Drupal. If the Drupal CMS is on a different Azure subscription or VNet:

- **Same subscription, different VNet:** Use VNet Peering between `vnet-ewb-kiosk` and the Drupal VNet.
- **Separate subscription:** Use Azure Private Link service on the Drupal side, then create a Private Endpoint in `snet-private-endpoints`.

Coordinate with EWB's network team to confirm the correct topology.

### 7.3 Static Outbound IP for Drupal Allowlisting

```bash
# Static public IP for the NAT Gateway
az network public-ip create \
  --name "pip-ewb-kiosk-nat" \
  --resource-group "$RG" \
  --location "$LOCATION" \
  --sku Standard \
  --allocation-method Static

# NAT Gateway
az network nat gateway create \
  --name "nat-ewb-kiosk" \
  --resource-group "$RG" \
  --location "$LOCATION" \
  --public-ip-addresses "pip-ewb-kiosk-nat" \
  --idle-timeout 10

# Attach to the App Service subnet
az network vnet subnet update \
  --name "$SUBNET_APP" \
  --resource-group "$RG" \
  --vnet-name "$VNET" \
  --nat-gateway "nat-ewb-kiosk"
```

After this, all outbound traffic from the App Services exits through a single static IP. Provide this IP to EWB's Drupal team to allowlist in their firewall.

Get the static IP:

```bash
az network public-ip show \
  --name "pip-ewb-kiosk-nat" \
  --resource-group "$RG" \
  --query ipAddress -o tsv
```

---

## 8. Custom Domain and SSL

```bash
# 1. Create DNS records at EWB's DNS provider:
#    CNAME  kiosk  →  app-ewb-kiosk-prod.azurewebsites.net
#    TXT    asuid.kiosk  →  <verification ID from the command below>
az webapp show \
  --name "$APP_PROD" --resource-group "$RG" \
  --query customDomainVerificationId -o tsv

# 2. After DNS propagates (allow up to 30 minutes), add the custom domain
az webapp config hostname add \
  --webapp-name "$APP_PROD" \
  --resource-group "$RG" \
  --hostname "kiosk.eastwestbanker.com"

# 3a. Free App Service Managed Certificate (auto-renews)
az webapp config ssl create \
  --name "$APP_PROD" \
  --resource-group "$RG" \
  --hostname "kiosk.eastwestbanker.com"

THUMBPRINT=$(az webapp config ssl list \
  --resource-group "$RG" \
  --query "[?subjectName=='kiosk.eastwestbanker.com'].thumbprint" -o tsv)

az webapp config ssl bind \
  --name "$APP_PROD" --resource-group "$RG" \
  --certificate-thumbprint "$THUMBPRINT" \
  --ssl-type SNI

# 3b. Alternatively — upload a bank-supplied PFX certificate
az webapp config ssl upload \
  --name "$APP_PROD" --resource-group "$RG" \
  --certificate-file "/path/to/certificate.pfx" \
  --certificate-password "<pfx-password>"
```

HTTPS enforcement was already set with `--https-only true` during App Service creation. Verify:

```bash
az webapp show --name "$APP_PROD" --resource-group "$RG" --query httpsOnly
# Expected: true
```

---

## 9. Deployment Slots (Alternative Architecture)

Deployment Slots run on the same App Service Plan, reducing cost. The production App Service gets a `staging` slot and a `uat` slot. After validation, a **slot swap** promotes content to production with zero downtime.

```bash
az webapp deployment slot create \
  --name "$APP_PROD" --resource-group "$RG" --slot "staging"

az webapp deployment slot create \
  --name "$APP_PROD" --resource-group "$RG" --slot "uat"
```

**Sticky settings** (stay with the slot, do not swap with the code):

```bash
az webapp config appsettings set \
  --name "$APP_PROD" --resource-group "$RG" --slot "staging" \
  --settings NEXT_PUBLIC_API_BASE_URL="https://stg-ewb.quailshack.com" API_ENVIRONMENT="STAGING"

az webapp config appsettings set \
  --name "$APP_PROD" --resource-group "$RG" --slot "uat" \
  --settings NEXT_PUBLIC_API_BASE_URL="https://uat2.eastwestbanker.com" API_ENVIRONMENT="UAT"

# Register them as slot-sticky
az webapp config appsettings set \
  --name "$APP_PROD" --resource-group "$RG" \
  --slot-settings NEXT_PUBLIC_API_BASE_URL API_ENVIRONMENT
```

**Slot swap to production:**

```bash
az webapp deployment slot swap \
  --name "$APP_PROD" --resource-group "$RG" \
  --slot "uat" --target-slot "production"
```

> **Caution:** `NEXT_PUBLIC_API_BASE_URL` is compiled into the JavaScript bundle at build time. Even though the setting is slot-sticky (its value won't swap), the compiled bundle that contains the baked-in URL **will** swap with the code. A build targeting the UAT URL will have that URL in its bundle even after swapping to production. A separate build per environment is required regardless of whether you use slots or separate App Services — the pipeline in Section 6 handles this.

---

## 10. Post-Deployment Checklist

### Infrastructure

- [ ] Always On enabled on all three App Services
- [ ] Health check path `/` configured on all three App Services
- [ ] `WEBSITE_NODE_DEFAULT_VERSION=~20` set on all three App Services
- [ ] VNet Integration active on all three App Services (check Networking blade)
- [ ] `WEBSITE_VNET_ROUTE_ALL=1` set on all three App Services
- [ ] NAT Gateway attached to `snet-appservice` subnet (if static outbound IP is required)
- [ ] NAT Gateway static IP confirmed and provided to EWB's Drupal team for allowlisting

### Secrets

- [ ] Managed Identity enabled on each App Service
- [ ] Key Vault access policies grant `get` permission to each Managed Identity
- [ ] Key Vault Private Endpoint created and Private DNS zone linked to VNet
- [ ] All Key Vault references in App Settings show a green checkmark in the Azure Portal
- [ ] `API_BASIC_USER` and `API_BASIC_PASS` are set **only** on Staging — not on UAT or Production

### Pipeline

- [ ] Azure DevOps Service Connection has Contributor access to the resource group
- [ ] Three environments created in Azure DevOps (`ewb-kiosk-staging`, `ewb-kiosk-uat`, `ewb-kiosk-production`)
- [ ] Approval gates configured on `ewb-kiosk-uat` and `ewb-kiosk-production`
- [ ] Pipeline runs successfully end-to-end: Staging auto-deploys, UAT approval gate blocks until approved, Production approval gate blocks until approved
- [ ] `npm run lint` passes with zero errors before any merge to `main`

### Functional (run on each environment after deployment)

- [ ] `/` — Home page loads; slider and category grid render
- [ ] `/category` — All categories listing loads
- [ ] `/category/<valid-tid>` — Category detail with promos and filters renders
- [ ] `/promo/<valid-nid>` — Promo detail and related promos render
- [ ] Images from the Drupal hostname for that environment load without broken-image icons
- [ ] Idle overlay appears after ~30 seconds of inactivity on a touch-screen device
- [ ] Idle overlay resets to `/` after the configured reset timeout
- [ ] No browser console errors related to API failures or environment variable values

### Network and TLS

- [ ] HTTPS redirect active: `http://` URL redirects to `https://`
- [ ] TLS certificate is valid and trusted on the custom domain
- [ ] IP restriction verified: accessing from a non-allowlisted IP returns `403 Forbidden`
- [ ] Branch LAN kiosk devices can reach the App Service URL

---

## Useful CLI Reference

```bash
# Restart an App Service (picks up new app settings immediately)
az webapp restart --name "$APP_PROD" --resource-group "$RG"

# Tail live log stream (useful immediately after deployment to catch startup errors)
az webapp log tail --name "$APP_PROD" --resource-group "$RG"

# List all app settings
az webapp config appsettings list --name "$APP_PROD" --resource-group "$RG" --output table

# List all Key Vault secrets
az keyvault secret list --vault-name "$KV" --output table

# Get the NAT Gateway static outbound IP
az network public-ip show --name "pip-ewb-kiosk-nat" --resource-group "$RG" --query ipAddress -o tsv

# Scale up App Service Plan if response times degrade
az appservice plan update --name "$PLAN" --resource-group "$RG" --sku P2V3

# View deployment history
az webapp deployment list --name "$APP_PROD" --resource-group "$RG" --output table
```
