"use client";

import Link from "next/link";
import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import { CONTRACTS } from "../../../lib/contracts";
import { DISCOVERY_ORACLE_ABI } from "../../../lib/abis/discovery-oracle";
import { useDiscoveryPool } from "../../../hooks/useDiscoveryStaking";
import { DISCOVERIES as DISCOVERY_LIST, TOTAL_DISCOVERIES } from "../../../lib/discoveries";

const DISCOVERIES: Record<number, { title: string; doi: string }> = Object.fromEntries(
  DISCOVERY_LIST.map((d) => [d.id, { title: d.title, doi: d.doi }])
);

const oracleAddr = CONTRACTS.DiscoveryOracle as `0x${string}`;

/* ------------------------------------------------------------------ */
/*  Resolution Entry                                                   */
/* ------------------------------------------------------------------ */

function ResolutionEntry({ discoveryId }: { discoveryId: number }) {
  const pool = useDiscoveryPool(discoveryId);
  const info = DISCOVERIES[discoveryId];

  // Get evidence DOI from oracle
  const { data: evidence } = useReadContract({
    address: oracleAddr,
    abi: [
      "function getEvidence(uint256) view returns (string evidenceDOI, string evidenceNote)",
    ] as const,
    functionName: "getEvidence",
    args: [BigInt(discoveryId)],
  });

  const { data: proposal } = useReadContract({
    address: oracleAddr,
    abi: DISCOVERY_ORACLE_ABI,
    functionName: "getProposal",
    args: [BigInt(discoveryId)],
  });

  if (!pool) return null;

  const outcomeLabel = pool.resolved
    ? pool.winnerSide === 0
      ? "CONFIRMED"
      : "REFUTED"
    : pool.frozen
    ? "VOTING"
    : "OPEN";

  const outcomeColor = pool.resolved
    ? pool.winnerSide === 0
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : "text-rose-400 bg-rose-500/10 border-rose-500/20"
    : pool.frozen
    ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
    : "text-white/40 bg-white/5 border-white/10";

  const evidenceDOI = evidence ? (evidence as [string, string])[0] : "";
  const evidenceNote = evidence ? (evidence as [string, string])[1] : "";

  const proposalData = proposal as
    | [number, number, string, bigint, bigint, bigint, bigint, bigint]
    | undefined;
  const proposedAt = proposalData ? Number(proposalData[3]) : 0;

  // Calculate burn/rewards from pool data
  const losingPool =
    pool.resolved && pool.winnerSide === 0
      ? Number(pool.refutePool)
      : Number(pool.confirmPool);
  const burned = losingPool * 0.236;
  const winnerRewards = losingPool * 0.618;

  return (
    <div className="p-5 rounded-2xl bg-white/[0.03] border border-amber-500/10 hover:border-amber-500/20 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-amber-500/60">
              #{discoveryId}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${outcomeColor}`}
            >
              {outcomeLabel}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white/90">
            {info?.title || `Discovery #${discoveryId}`}
          </h3>
        </div>
        {proposedAt > 0 && (
          <span className="text-[10px] text-white/20 font-mono">
            {new Date(proposedAt * 1000).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* DOI Links */}
      <div className="space-y-1 mb-3">
        {/* Discovery DOI */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-white/30 w-20 shrink-0">Discovery:</span>
          <a
            href={`https://doi.org/${info?.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 font-mono truncate transition-colors"
          >
            {info?.doi}
          </a>
        </div>

        {/* Evidence DOI (from resolution) */}
        {evidenceDOI && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-white/30 w-20 shrink-0">Evidence:</span>
            <a
              href={`https://doi.org/${evidenceDOI}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-mono truncate transition-colors"
            >
              {evidenceDOI}
            </a>
          </div>
        )}

        {/* Evidence note */}
        {evidenceNote && (
          <div className="flex items-start gap-2 text-xs">
            <span className="text-white/30 w-20 shrink-0">Note:</span>
            <span className="text-white/50 italic">{evidenceNote}</span>
          </div>
        )}
      </div>

      {/* Resolution stats (only if resolved) */}
      {pool.resolved && (
        <div className="grid grid-cols-4 gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="text-center">
            <div className="text-[10px] text-white/30">Total Pool</div>
            <div className="text-xs font-bold text-amber-400">
              {Number(pool.scienceWeight).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-white/30">Winners (61.8%)</div>
            <div className="text-xs font-bold text-emerald-400">
              {winnerRewards.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-white/30">Burned (23.6%)</div>
            <div className="text-xs font-bold text-rose-400">
              {burned.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-white/30">Science Weight</div>
            <div className="text-xs font-bold text-white/60">
              {Number(pool.scienceWeight).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  History Page                                                       */
/* ------------------------------------------------------------------ */

export default function HistoryPage() {
  const discoveryIds = Array.from({ length: TOTAL_DISCOVERIES }, (_, i) => i);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <Link
              href="/discoveries"
              className="text-white/40 hover:text-white/60 text-sm"
            >
              Discoveries
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-amber-400 text-sm font-medium">
              Resolution History
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Resolution History</h1>
          <p className="text-xs text-white/40 mt-1">
            Journal of resolved discoveries with DOI evidence links — bridging
            on-chain prediction markets with traditional scientific publishing
          </p>
        </div>

        {/* Legend */}
        <div className="mb-6 p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-wrap gap-4 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-white/40">Confirmed</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span className="text-white/40">Refuted</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-white/40">Voting</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-white/20" />
            <span className="text-white/40">Open</span>
          </span>
        </div>

        {/* Resolution entries */}
        <div className="space-y-3">
          {discoveryIds.map((id) => (
            <ResolutionEntry key={id} discoveryId={id} />
          ))}
        </div>
      </div>
    </div>
  );
}
