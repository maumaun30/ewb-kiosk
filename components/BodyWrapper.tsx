"use client";

import { usePathname } from "next/navigation";

export default function BodyWrapper({ children, fontVariable }: { children: React.ReactNode; fontVariable: string }) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  return (
    <body className={isHomepage ? `${fontVariable} antialiased h-screen w-screen overflow-hidden flex flex-col` : `${fontVariable} antialiased`}>
      {children}
    </body>
  );
}