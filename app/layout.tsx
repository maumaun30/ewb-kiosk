import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Image from "next/image";
import "./globals.css";

import NavBar from "@/components/NavBar";
import BackButton from "@/components/BackButton";

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
        <NavBar />
        <BackButton />
        <main>{children}</main>
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
