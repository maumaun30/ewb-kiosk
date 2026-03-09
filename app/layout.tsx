import { Suspense } from "react";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Image from "next/image";
import "./globals.css";

import { NavigationProvider } from "@/context/NavigationContext";

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import LoadingOverlay from "@/components/LoadingOverlay";
import IdleOverlay from "@/components/IdleOverlay";
import { getSettings } from "@/lib/settings";

const allSettings = await getSettings();

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
          <IdleOverlay settings={allSettings} />
          <NavBar settings={allSettings} />
          <BackButton />
          <main>{children}</main>
        </NavigationProvider>
        <Footer settings={allSettings} />
      </body>
    </html>
  );
}
