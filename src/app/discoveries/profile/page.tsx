"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { formatEther } from "viem";
import Link from "next/link";
import { CONTRACTS } from "../../../lib/contracts";
import { RESEARCHER_REGISTRY_ABI } from "../../../lib/abis/researcher-registry";
import { StatCard } from "../../../components/StatCard";

const registryAddr = CONTRACTS.ResearcherRegistry as `0x${string}`;

const TIER_NAMES = ["Novice", "Scholar", "Expert", "Oracle"];
const TIER_COLORS = [
  "text-white/40",
  "text-blue-400",
  "text-purple-400",
  "text-amber-400",
];
const TIER_THRESHOLDS = [0, 2, 5, 13]; // F(3), F(5), F(7)

/* ------------------------------------------------------------------ */
/*  Researcher Profile Page                                            */
/* ------------------------------------------------------------------ */

export default function ProfilePage() {
  const { address } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const [orcid, setOrcid] = useState("");
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");

  // Read current profile
  const { data: isRegistered } = useReadContract({
    address: registryAddr,
    abi: RESEARCHER_REGISTRY_ABI,
    functionName: "isRegistered",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: researcher } = useReadContract({
    address: registryAddr,
    abi: RESEARCHER_REGISTRY_ABI,
    functionName: "getResearcher",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!isRegistered },
  });

  const { data: tier } = useReadContract({
    address: registryAddr,
    abi: RESEARCHER_REGISTRY_ABI,
    functionName: "getTier",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!isRegistered },
  });

  const { data: winRateBps } = useReadContract({
    address: registryAddr,
    abi: RESEARCHER_REGISTRY_ABI,
    functionName: "winRate",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!isRegistered },
  });

  const { data: totalResearchers } = useReadContract({
    address: registryAddr,
    abi: RESEARCHER_REGISTRY_ABI,
    functionName: "totalResearchers",
  });

  const profile = researcher as {
    orcid: string;
    name: string;
    institution: string;
    orcidVerified: boolean;
    correctPredictions: bigint;
    totalPredictions: bigint;
    totalStaked: bigint;
    totalEarned: bigint;
    registeredAt: bigint;
  } | undefined;

  const currentTier = tier ? Number(tier) : 0;
  const winRate = winRateBps ? Number(winRateBps) / 100 : 0;

  const handleRegister = () => {
    if (!orcid || orcid.length !== 19) return;
    writeContract({
      address: registryAddr,
      abi: RESEARCHER_REGISTRY_ABI,
      functionName: "register",
      args: [orcid, name, institution],
    });
  };

  const handleUpdateProfile = () => {
    writeContract({
      address: registryAddr,
      abi: RESEARCHER_REGISTRY_ABI,
      functionName: "updateProfile",
      args: [name, institution],
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <Link href="/discoveries" className="text-white/40 hover:text-white/60 text-sm">
              Discoveries
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-amber-400 text-sm font-medium">Researcher Profile</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Researcher Profile</h1>
          <p className="text-xs text-white/40 mt-1">
            Link your ORCID, build reputation through correct predictions, earn Oracle status
          </p>
        </div>

        {!address ? (
          <div className="text-center py-20 text-white/30">
            Connect wallet to view or create your researcher profile
          </div>
        ) : !isRegistered ? (
          /* Registration Form */
          <div className="max-w-md mx-auto">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-amber-500/20">
              <h2 className="text-lg font-bold text-white mb-4">Register as Researcher</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block">
                    ORCID iD *
                  </label>
                  <input
                    type="text"
                    value={orcid}
                    onChange={(e) => setOrcid(e.target.value)}
                    placeholder="0000-0002-1234-5678"
                    maxLength={19}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10
                      text-white placeholder-white/20 focus:border-amber-500/40
                      focus:outline-none transition-colors text-sm font-mono"
                  />
                  <p className="text-[10px] text-white/20 mt-1">
                    Get your ORCID at{" "}
                    <a href="https://orcid.org/register" target="_blank" rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300">
                      orcid.org
                    </a>
                  </p>
                </div>

                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Jane Smith"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10
                      text-white placeholder-white/20 focus:border-amber-500/40
                      focus:outline-none transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="CERN, MIT, etc."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10
                      text-white placeholder-white/20 focus:border-amber-500/40
                      focus:outline-none transition-colors text-sm"
                  />
                </div>

                <button
                  onClick={handleRegister}
                  disabled={isPending || orcid.length !== 19}
                  className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-yellow-500
                    text-black hover:from-amber-400 hover:to-yellow-400 disabled:opacity-30 transition-all"
                >
                  {isPending ? "Registering..." : "Register on Artosphere"}
                </button>
              </div>
            </div>

            {/* Tier progression info */}
            <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <h3 className="text-sm font-bold text-amber-400 mb-3">
                Reputation Tiers (Fibonacci)
              </h3>
              <div className="space-y-2">
                {TIER_NAMES.map((tierName, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className={TIER_COLORS[i] + " font-bold"}>{tierName}</span>
                    <span className="text-white/30 font-mono">
                      {i === 0 ? "Start" : `${TIER_THRESHOLDS[i]}+ correct predictions`}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-white/20 mt-2">
                Oracle tier = eligible for validator role (propose resolutions)
              </p>
            </div>
          </div>
        ) : (
          /* Profile Dashboard */
          <div>
            {/* Profile header */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-amber-500/20 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-lg font-bold ${TIER_COLORS[currentTier]}`}>
                      {TIER_NAMES[currentTier]}
                    </span>
                    {profile?.orcidVerified && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        VERIFIED
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {profile?.name || "Anonymous Researcher"}
                  </h2>
                  {profile?.institution && (
                    <p className="text-sm text-white/40">{profile.institution}</p>
                  )}
                </div>

                {/* ORCID badge */}
                <a
                  href={`https://orcid.org/${profile?.orcid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10
                    border border-green-500/20 hover:border-green-500/40 transition-colors"
                >
                  <span className="text-xs font-bold text-green-400">ORCID</span>
                  <span className="text-xs font-mono text-green-300/60">
                    {profile?.orcid}
                  </span>
                </a>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                label="Correct"
                value={profile ? String(Number(profile.correctPredictions)) : "0"}
                suffix={`/ ${profile ? Number(profile.totalPredictions) : 0}`}
              />
              <StatCard
                label="Win Rate"
                value={`${winRate.toFixed(1)}%`}
              />
              <StatCard
                label="Total Staked"
                value={profile ? Number(formatEther(profile.totalStaked)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "0"}
                suffix="ARTS"
              />
              <StatCard
                label="Total Earned"
                value={profile ? Number(formatEther(profile.totalEarned)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "0"}
                suffix="ARTS"
              />
            </div>

            {/* Tier progress */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/40">Tier Progress</span>
                <span className={`text-xs font-bold ${TIER_COLORS[currentTier]}`}>
                  {TIER_NAMES[currentTier]}
                  {currentTier < 3 && ` → ${TIER_NAMES[currentTier + 1]}`}
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                {(() => {
                  const correct = profile ? Number(profile.correctPredictions) : 0;
                  const nextThreshold = currentTier < 3 ? TIER_THRESHOLDS[currentTier + 1] : TIER_THRESHOLDS[3];
                  const prevThreshold = TIER_THRESHOLDS[currentTier];
                  const progress = currentTier >= 3
                    ? 100
                    : ((correct - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
                  return (
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  );
                })()}
              </div>
              {currentTier < 3 && (
                <p className="text-[10px] text-white/20 mt-1">
                  {profile ? Number(profile.correctPredictions) : 0} / {TIER_THRESHOLDS[currentTier + 1]} correct predictions
                </p>
              )}
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/discoveries/claims"
                className="p-4 rounded-xl bg-white/[0.03] border border-amber-500/10 hover:border-amber-500/30
                  text-center text-sm font-medium text-amber-400 transition-all"
              >
                My Claims
              </Link>
              <Link
                href="/discoveries/history"
                className="p-4 rounded-xl bg-white/[0.03] border border-amber-500/10 hover:border-amber-500/30
                  text-center text-sm font-medium text-amber-400 transition-all"
              >
                Resolution History
              </Link>
            </div>
          </div>
        )}

        {/* Global stats */}
        <div className="mt-8 text-center text-xs text-white/20">
          {totalResearchers ? `${Number(totalResearchers)} researchers registered` : ""}
        </div>
      </div>
    </div>
  );
}
