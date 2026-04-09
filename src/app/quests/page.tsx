"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useReadContract, useWriteContract } from "wagmi";
import { formatEther } from "viem";
import { CONTRACTS } from "../../lib/contracts";

/* ------------------------------------------------------------------ */
/*  ABI fragments                                                     */
/* ------------------------------------------------------------------ */

const QUESTS_ABI = [
  {
    name: "startQuest",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "questId", type: "uint8" }],
    outputs: [],
  },
  {
    name: "completeQuest",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "questId", type: "uint8" }],
    outputs: [],
  },
  {
    name: "getQuestStatus",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "user", type: "address" },
      { name: "questId", type: "uint8" },
    ],
    outputs: [
      { name: "status", type: "uint8" },
      { name: "startedAt", type: "uint256" },
      { name: "completedAt", type: "uint256" },
    ],
  },
  {
    name: "getUserProgress",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      { name: "totalEarned", type: "uint256" },
      { name: "questsCompleted", type: "uint256" },
    ],
  },
] as const;

const CERTIFICATE_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "tokenOfOwnerByIndex",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "index", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "tokenURI",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const QUESTS = [
  { id: 0, name: "First Spiral", durationDays: 1, rewardArts: 1 },
  { id: 1, name: "Mirror Step", durationDays: 1, rewardArts: 1 },
  { id: 2, name: "Golden Seed", durationDays: 2, rewardArts: 2 },
  { id: 3, name: "Fibonacci Bloom", durationDays: 3, rewardArts: 3 },
  { id: 4, name: "Patience Trial", durationDays: 5, rewardArts: 5 },
  { id: 5, name: "Phi Convergence", durationDays: 8, rewardArts: 8 },
  { id: 6, name: "Golden Spiral", durationDays: 13, rewardArts: 13 },
  { id: 7, name: "Artosphere Ascent", durationDays: 21, rewardArts: 21 },
] as const;

// Status enum: 0 = Locked, 1 = Active, 2 = Completed
const STATUS_LABELS = ["Locked", "Active", "Completed"] as const;

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function QuestsPage() {
  const { address } = useAccount();

  const { data: progress } = useReadContract({
    address: CONTRACTS.ArtosphereQuests as `0x${string}`,
    abi: QUESTS_ABI,
    functionName: "getUserProgress",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const totalEarned = progress ? Number(formatEther(progress[0])) : 0;
  const questsCompleted = progress ? Number(progress[1]) : 0;

  return (
    <main className="min-h-screen bg-dark text-white px-4 py-fib-34 max-w-6xl mx-auto space-y-fib-55">
      <h1 className="text-phi-xl font-bold text-gold text-center tracking-tight">
        Fibonacci Quests
      </h1>
      <p className="text-center text-gray-400 max-w-2xl mx-auto">
        Complete quests on a Fibonacci timeline. Each quest takes longer but
        rewards more &mdash; patience is the currency of the golden ratio.
      </p>

      {/* Progress summary */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="bg-dark-card border border-dark-border rounded-phi p-fib-21 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Total Earned
          </p>
          <p className="text-phi-lg font-bold text-gold font-mono mt-1">
            {totalEarned} <span className="text-sm text-gold-dark">ARTS</span>
          </p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-phi p-fib-21 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Quests Completed
          </p>
          <p className="text-phi-lg font-bold text-white font-mono mt-1">
            {questsCompleted}
            <span className="text-sm text-gray-500"> / 8</span>
          </p>
        </div>
      </div>

      {/* Quest cards — Fibonacci-inspired grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUESTS.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>

      {/* NFT Certificates */}
      <CertificatesSection />
    </main>
  );
}

/* ================================================================== */
/*  Quest Card                                                        */
/* ================================================================== */

function QuestCard({
  quest,
}: {
  quest: (typeof QUESTS)[number];
}) {
  const { address } = useAccount();

  const { writeContract: startQuest, isPending: starting } =
    useWriteContract();
  const { writeContract: completeQuest, isPending: completing } =
    useWriteContract();

  const { data: statusData } = useReadContract({
    address: CONTRACTS.ArtosphereQuests as `0x${string}`,
    abi: QUESTS_ABI,
    functionName: "getQuestStatus",
    args: address ? [address, quest.id] : undefined,
    query: { enabled: !!address },
  });

  const status = statusData ? Number(statusData[0]) : 0;
  const startedAt = statusData ? Number(statusData[1]) : 0;
  const isActive = status === 1;
  const isCompleted = status === 2;
  const isLocked = status === 0;

  // Can complete if active and enough time has passed
  const now = Math.floor(Date.now() / 1000);
  const elapsed = startedAt > 0 ? now - startedAt : 0;
  const requiredSeconds = quest.durationDays * 86400;
  const canComplete = isActive && elapsed >= requiredSeconds;
  const timeLeftSeconds = isActive
    ? Math.max(requiredSeconds - elapsed, 0)
    : 0;

  const handleStart = () => {
    startQuest({
      address: CONTRACTS.ArtosphereQuests as `0x${string}`,
      abi: QUESTS_ABI,
      functionName: "startQuest",
      args: [quest.id],
    });
  };

  const handleComplete = () => {
    completeQuest({
      address: CONTRACTS.ArtosphereQuests as `0x${string}`,
      abi: QUESTS_ABI,
      functionName: "completeQuest",
      args: [quest.id],
    });
  };

  const borderClass = isCompleted
    ? "border-gold/50 shadow-gold"
    : isActive
      ? "border-green-500/40"
      : "border-dark-border";

  return (
    <div
      className={`bg-dark-card border rounded-phi p-fib-21 flex flex-col justify-between gap-4 transition-all duration-300 ${borderClass}`}
    >
      {/* Top */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-gray-600">
            Q{quest.id + 1}
          </span>
          <StatusBadge status={status} />
        </div>
        <h3 className="text-lg font-semibold text-white">{quest.name}</h3>
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
          <span>
            {quest.durationDays}d duration
          </span>
          <span className="text-gold font-mono">
            +{quest.rewardArts} ARTS
          </span>
        </div>
      </div>

      {/* Time remaining (if active) */}
      {isActive && timeLeftSeconds > 0 && (
        <div className="text-xs text-gray-500">
          Time remaining:{" "}
          <span className="text-white font-mono">
            {formatDuration(timeLeftSeconds)}
          </span>
        </div>
      )}

      {/* Action */}
      <div>
        {isLocked && (
          <button
            onClick={handleStart}
            disabled={starting}
            className="w-full py-2.5 bg-gold-gradient text-dark font-bold rounded-lg hover:opacity-90 disabled:opacity-40 transition text-sm"
          >
            {starting ? "Starting..." : "Start Quest"}
          </button>
        )}
        {isActive && (
          <button
            onClick={handleComplete}
            disabled={completing || !canComplete}
            className={`w-full py-2.5 font-bold rounded-lg transition text-sm ${
              canComplete
                ? "bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30"
                : "bg-dark border border-dark-border text-gray-600 cursor-not-allowed"
            }`}
          >
            {completing
              ? "Completing..."
              : canComplete
                ? "Complete Quest"
                : "In Progress..."}
          </button>
        )}
        {isCompleted && (
          <div className="w-full py-2.5 text-center text-gold font-bold text-sm">
            Completed
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: number }) {
  const classes =
    status === 2
      ? "text-gold bg-gold/10 border-gold/30"
      : status === 1
        ? "text-green-400 bg-green-400/10 border-green-400/30"
        : "text-gray-500 bg-gray-500/10 border-gray-500/30";

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${classes}`}
    >
      {STATUS_LABELS[status] ?? "Unknown"}
    </span>
  );
}

/* ================================================================== */
/*  NFT Certificates                                                  */
/* ================================================================== */

function CertificatesSection() {
  const { address } = useAccount();

  const { data: certBalance } = useReadContract({
    address: CONTRACTS.PhiCertificate as `0x${string}`,
    abi: CERTIFICATE_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const count = certBalance ? Number(certBalance) : 0;

  return (
    <section className="space-y-4">
      <h2 className="text-phi-lg font-semibold text-gold-dark flex items-center gap-2">
        <span className="text-2xl">&#127942;</span> NFT Certificates
      </h2>

      {count === 0 ? (
        <div className="bg-dark-card border border-dark-border rounded-phi p-fib-34 text-center text-gray-500">
          Complete quests to earn NFT certificates of achievement.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: Math.min(count, 12) }, (_, i) => (
            <CertificateCard key={i} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}

function CertificateCard({ index }: { index: number }) {
  const { address } = useAccount();

  const { data: tokenId } = useReadContract({
    address: CONTRACTS.PhiCertificate as `0x${string}`,
    abi: CERTIFICATE_ABI,
    functionName: "tokenOfOwnerByIndex",
    args: address ? [address, BigInt(index)] : undefined,
    query: { enabled: !!address },
  });

  return (
    <div className="bg-dark-card border border-gold/20 rounded-phi p-4 text-center space-y-2 hover:shadow-gold transition-shadow duration-300">
      <div className="w-16 h-16 mx-auto rounded-full bg-gold-gradient flex items-center justify-center text-dark font-bold text-lg">
        &#966;
      </div>
      <p className="text-sm font-mono text-gray-400">
        #{tokenId?.toString() ?? "..."}
      </p>
      <p className="text-xs text-gold-dark">Quest Certificate</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function formatDuration(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
