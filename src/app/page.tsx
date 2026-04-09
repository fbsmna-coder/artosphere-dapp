"use client";

import Link from "next/link";
import Image from "next/image";
import { CONTRACTS, CHAIN_ID, BLOCK_EXPLORER } from "@/lib/contracts";

const STATS = [
  { label: "Total Supply", value: "1,618,033,988", suffix: "ARTS" },
  { label: "Circulating", value: "618,033,988", suffix: "ARTS" },
  { label: "Total Burned", value: "0", suffix: "ARTS" },
  { label: "Total Staked", value: "0", suffix: "ARTS" },
];

const TOKEN_INFO = [
  { label: "Name", value: "Artosphere" },
  { label: "Symbol", value: "ARTS" },
  { label: "Chain", value: "Base Sepolia" },
  { label: "Chain ID", value: String(CHAIN_ID) },
  { label: "Decimals", value: "18" },
  {
    label: "Contract",
    value: `${CONTRACTS.ARTS.slice(0, 6)}...${CONTRACTS.ARTS.slice(-4)}`,
    href: `${BLOCK_EXPLORER}/address/${CONTRACTS.ARTS}`,
  },
];

const LINK_CARDS = [
  {
    title: "Staking",
    description:
      "Lock ARTS tokens in Fibonacci tiers (5, 8, 13, 21, 34%) and earn proportional rewards governed by golden ratio math.",
    href: "/stake",
    icon: "\u2B50",
  },
  {
    title: "Governance",
    description:
      "Propose and vote on protocol changes. Voting power scales with staking tier using phi-weighted quadratic voting.",
    href: "/govern",
    icon: "\u2696\uFE0F",
  },
  {
    title: "Quests",
    description:
      "Complete on-chain challenges to earn ARTS rewards, PhiCertificate NFTs, and climb the Artosphere leaderboard.",
    href: "/quests",
    icon: "\uD83C\uDFC6",
  },
  {
    title: "Golden Mirror",
    description:
      "Oracle-driven price reflection mechanism. The mirror ensures protocol stability through golden ratio rebalancing.",
    href: "#",
    icon: "\uD83D\uDD2E",
  },
];

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-fib-55">
      {/* Hero */}
      <section className="text-center mb-fib-89">
        <div className="inline-block mb-fib-21">
          <Image
            src="/images/logo.jpeg"
            alt="Artosphere"
            width={96}
            height={96}
            className="w-24 h-24 rounded-2xl shadow-2xl shadow-amber-500/30 animate-golden-float"
          />
        </div>
        <h1 className="text-phi-2xl md:text-phi-3xl font-bold mb-fib-21 text-balance">
          <span className="gold-text">Artosphere</span>
        </h1>
        <p className="text-phi-lg text-gray-400 max-w-2xl mx-auto mb-fib-34 text-balance">
          Built on the math that moves markets
        </p>
        <p className="text-sm text-gray-500 max-w-xl mx-auto mb-fib-34">
          A DeFi protocol where every parameter &mdash; staking tiers, fee
          curves, governance weights, treasury allocation &mdash; is derived
          from the golden ratio &phi; = (1+&radic;5)/2
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/stake" className="phi-button">
            Start Staking
          </Link>
          <a
            href={`${BLOCK_EXPLORER}/address/${CONTRACTS.ARTS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="phi-button-outline"
          >
            View on BaseScan
          </a>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="mb-fib-89">
        <h2 className="text-sm font-semibold text-gold-dark uppercase tracking-widest mb-fib-21">
          Protocol Stats
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-fib-21">
          {STATS.map((stat) => (
            <div key={stat.label} className="phi-card text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-fib-8">
                {stat.label}
              </p>
              <p className="text-phi-lg font-bold gold-text">{stat.value}</p>
              <p className="text-xs text-gray-600 mt-fib-5">{stat.suffix}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Token Info */}
      <section className="mb-fib-89">
        <h2 className="text-sm font-semibold text-gold-dark uppercase tracking-widest mb-fib-21">
          Token Information
        </h2>
        <div className="phi-card overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fib-21">
            {TOKEN_INFO.map((item) => (
              <div key={item.label} className="flex items-center justify-between sm:flex-col sm:items-start gap-2">
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  {item.label}
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono text-gold hover:text-gold-light transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="text-sm font-medium">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Link Cards */}
      <section>
        <h2 className="text-sm font-semibold text-gold-dark uppercase tracking-widest mb-fib-21">
          Explore the Protocol
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-fib-21">
          {LINK_CARDS.map((card) => (
            <Link key={card.title} href={card.href} className="block">
              <div className="phi-card group cursor-pointer h-full">
                <div className="flex items-start gap-fib-13">
                  <span className="text-2xl">{card.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold mb-fib-8 group-hover:text-gold transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Contracts Reference */}
      <section className="mt-fib-89">
        <h2 className="text-sm font-semibold text-gold-dark uppercase tracking-widest mb-fib-21">
          Smart Contracts (Base Sepolia)
        </h2>
        <div className="phi-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="pb-fib-13 pr-fib-21">Contract</th>
                <th className="pb-fib-13">Address</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {Object.entries(CONTRACTS).map(([name, address]) => (
                <tr key={name} className="border-t border-dark-border">
                  <td className="py-fib-8 pr-fib-21 text-gray-400">
                    {name}
                  </td>
                  <td className="py-fib-8">
                    <a
                      href={`${BLOCK_EXPLORER}/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-muted hover:text-gold transition-colors"
                    >
                      {address}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
