"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CONTRACTS, CHAIN_ID, BLOCK_EXPLORER } from "@/lib/contracts";

/* ── JUNO Countdown Target ── */
const JUNO_DATE = new Date("2028-01-01T00:00:00Z");

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

/* ── KillSwitch Conditions ── */
const KILL_CONDITIONS = [
  { id: 1, label: "sin\u00B2\u03B8\u2081\u2082", experiment: "JUNO 2027\u20132028", active: true },
  { id: 2, label: "\u03C7-boson 58 GeV", experiment: "HL-LHC 2028\u20132030", active: true },
  { id: 3, label: "\u03B4_CP = 65.91\u00B0", experiment: "DUNE 2029", active: true },
  { id: 4, label: "w\u2080 = \u22120.977", experiment: "DESI 2028", active: true },
  { id: 5, label: "Axion", experiment: "ADMX 2031", active: true },
  { id: 6, label: "M_H = 125.251", experiment: "FCC-ee 2036", active: true },
];

const STATS = [
  { label: "Total Supply", value: "1,618,033,988", suffix: "ARTS" },
  { label: "Circulating", value: "618,033,988", suffix: "ARTS" },
  { label: "Total Burned", value: "0", suffix: "ARTS" },
  { label: "Total Staked", value: "0", suffix: "ARTS" },
];

const TOKEN_INFO = [
  { label: "Name", value: "Artosphere" },
  { label: "Symbol", value: "ARTS" },
  { label: "Chain", value: "Base Mainnet" },
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

function JunoCountdown() {
  const { days, hours, minutes, seconds } = useCountdown(JUNO_DATE);
  const units = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Min", value: minutes },
    { label: "Sec", value: seconds },
  ];

  return (
    <section className="mb-fib-89">
      <h2 className="text-sm font-semibold text-gold-dark uppercase tracking-widest mb-fib-21">
        JUNO Resolution Event
      </h2>
      <div className="phi-card border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-fib-8">
            Countdown to JUNO precision data release
          </p>

          {/* Countdown digits */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 my-fib-21">
            {units.map((u) => (
              <div key={u.label} className="flex flex-col items-center">
                <span className="text-phi-lg sm:text-phi-2xl font-bold gold-text tabular-nums">
                  {String(u.value).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
                  {u.label}
                </span>
              </div>
            ))}
          </div>

          {/* Prediction */}
          <div className="rounded-lg border border-amber-500/10 bg-amber-500/5 px-4 py-3 inline-block">
            <p className="text-sm font-mono text-gold">
              sin&sup2;&theta;&nbsp;&nbsp;= 1/(2&phi;) = 0.30902
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-fib-13">
            If confirmed: first Discovery Staking resolution
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-fib-55">
      {/* Hero */}
      <section className="text-center mb-fib-89">
        <div className="inline-block mb-fib-21">
          <Image
            src="/images/logo.png"
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

      {/* JUNO Countdown */}
      <JunoCountdown />

      {/* KillSwitch Status */}
      <section className="mb-fib-89">
        <h2 className="text-sm font-semibold text-gold-dark uppercase tracking-widest mb-fib-21">
          KillSwitch Status
        </h2>
        <div className="phi-card">
          <p className="text-xs text-gray-500 mb-fib-13">
            6 falsifiable predictions &mdash; any single failure triggers protocol pause
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fib-13">
            {KILL_CONDITIONS.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-lg border border-dark-border px-4 py-3"
              >
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${
                    c.active ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" : "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]"
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{c.label}</p>
                  <p className="text-xs text-gray-500">{c.experiment}</p>
                </div>
                <span
                  className={`ml-auto text-[10px] font-semibold uppercase tracking-wider ${
                    c.active ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {c.active ? "ACTIVE" : "TRIGGERED"}
                </span>
              </div>
            ))}
          </div>
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
          Smart Contracts (Base Mainnet)
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
