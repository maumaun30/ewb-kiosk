import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { NavigationProvider } from "@/context/NavigationContext";
import { SkeletonLoadingProvider } from "@/context/SkeletonLoadingContext";

import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/layout/BackButton";
import IdleOverlay from "@/components/layout/IdleOverlay";
import BodyWrapper from "@/components/layout/BodyWrapper";
import MainWrapper from "@/components/layout/MainWrapper";
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
      <BodyWrapper fontVariable={poppins.variable}>
        <SkeletonLoadingProvider>
        <NavigationProvider>
          <IdleOverlay settings={allSettings} />
          <NavBar settings={allSettings} />
          <BackButton />
          <MainWrapper>{children}</MainWrapper>
        </NavigationProvider>
        </SkeletonLoadingProvider>
        <Footer settings={allSettings} />
      </BodyWrapper>
    </html>
  );
}