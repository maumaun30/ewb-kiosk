import Link from "next/link";
import Image from "next/image";
import type { Data } from "@/lib/settings";

interface SettingsProps {
  settings: Data;
}

const NavBar: React.FC<SettingsProps> = ({ settings }) => {
  const logoUrl =
    settings?.navigation?.fields?.logo_url?.value ?? "/ew-logo_0.png";

  return (
    <nav className="ew-bg-green">
      <div className="max-w-6xl mx-auto p-5">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/">
              <Image
                src={logoUrl}
                height={0}
                width={0}
                alt="EastWest official logo"
                className="w-50 h-auto"
                loading="eager"
              />
            </Link>
          </div>
          <div>
            <Link href="/">
              <Image src="/home-icon.svg" alt="" height={40} width={40} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
