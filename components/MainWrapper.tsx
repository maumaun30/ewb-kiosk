"use client";

import { usePathname } from "next/navigation";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  return (
    <main className={isHomepage ? "flex-1 min-h-0 overflow-hidden flex flex-col" : ""}>
      {children}
    </main>
  );
}