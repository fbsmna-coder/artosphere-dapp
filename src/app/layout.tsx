import type { Metadata } from "next";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Artosphere | Golden Ratio DeFi Protocol",
  description:
    "Artosphere (ARTS) - DeFi protocol built on the mathematics of the golden ratio. Stake, govern, and explore quests on Base Sepolia.",
  keywords: [
    "Artosphere",
    "ARTS",
    "DeFi",
    "golden ratio",
    "phi",
    "Base",
    "staking",
    "governance",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0f] text-white min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
