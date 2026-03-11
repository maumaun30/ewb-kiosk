type ApiEnvironment = "LOCAL" | "STAGING" | "DEV" | "UAT" | "PRODUCTION";

const BASIC_AUTH_ENVS: ApiEnvironment[] = ["LOCAL", "STAGING"];

function getEnvironment(): ApiEnvironment {
  const env = process.env.API_ENVIRONMENT?.toUpperCase() as ApiEnvironment;
  const valid: ApiEnvironment[] = ["LOCAL", "STAGING", "DEV", "UAT", "PRODUCTION"];
  return valid.includes(env) ? env : "LOCAL";
}

function buildBasicAuth(): string {
  const user = process.env.API_BASIC_USER;
  const pass = process.env.API_BASIC_PASS;

  if (!user || !pass) {
    throw new Error("API_BASIC_USER and API_BASIC_PASS must be set for this environment");
  }

  return `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
}

export function getApiHeaders(): HeadersInit {
  const env = getEnvironment();
  const apiKey = process.env.DRUPAL_API_KEY;

  if (!apiKey) {
    throw new Error("DRUPAL_API_KEY must be set");
  }

  const headers: Record<string, string> = {
    "X-API-Key": apiKey,
  };

  if (BASIC_AUTH_ENVS.includes(env)) {
    headers["Authorization"] = buildBasicAuth();
  }

  return headers;
}