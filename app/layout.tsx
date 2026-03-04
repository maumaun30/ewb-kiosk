import { Suspense } from "react";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Image from "next/image";
import "./globals.css";

import { NavigationProvider } from "@/context/NavigationContext";

import NavBar from "@/components/NavBar";
import BackButton from "@/components/BackButton";
import LoadingOverlay from "@/components/LoadingOverlay";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EastWest Bank Kiosk App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <NavigationProvider>
          <Suspense>
            <LoadingOverlay />
          </Suspense>
          <NavBar />
          <BackButton />
          <main>{children}</main>
        </NavigationProvider>
        <footer>
          <div className="max-w-6xl mx-auto">
            <Image
              src="/footer.png"
              className="w-full"
              alt="EastWest footer"
              width={0}
              height={0}
              sizes="100vw"
            />
          </div>
        </footer>
      </body>
    </html>
  );
}
