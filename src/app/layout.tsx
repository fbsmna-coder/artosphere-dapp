import type { Metadata } from "next";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Artosphere | Golden Ratio DeFi Protocol",
  description:
    "Artosphere (ARTS) — World's first physics-backed DeFi protocol. 36 Standard Model parameters from φ and M_Pl. Stake, govern, and discover on Base Mainnet.",
  openGraph: {
    title: "Artosphere | The Golden Ratio Protocol",
    description: "World's first DeFi protocol where every parameter derives from φ=(1+√5)/2. 27 contracts, 400 tests, 15 Spectral NFTs on Base Mainnet.",
    url: "https://artosphere.xyz",
    siteName: "Artosphere",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@FSspronov",
    title: "Artosphere | Physics-Backed DeFi",
    description: "36 Standard Model constants from one number. The protocol that KillSwitches itself if wrong.",
  },
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
