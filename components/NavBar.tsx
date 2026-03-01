import Link from "next/link";
import Image from "next/image";
import { House } from "lucide-react";

export default function NavBar() {
  return (
    <nav className="ew-bg-green">
      <div className="max-w-6xl mx-auto p-5">
        <div className="flex items-center justify-between">
          <div>
            <Image
              src="/ew-logo_0.png"
              height={80}
              width={200}
              alt="EastWest official logo"
            />
          </div>
          <div>
            <Link href="/">
              <House />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
