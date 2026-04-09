"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import Link from "next/link";
import { StatCard } from "../../../components/StatCard";
import {
  useDiscoveryPool,
  useUserStake,
  useEstimateReward,
  useDiscoveryStakingActions,
} from "../../../hooks/useDiscoveryStaking";
import { DISCOVERY_TITLES, TOTAL_DISCOVERIES } from "../../../lib/discoveries";

const SIDE_LABELS = ["CONFIRM", "REFUTE"];
const SIDE_COLORS = ["text-emerald-400", "text-rose-400"];
const TIER_LABELS = ["5d (x1)", "21d (xphi)", "55d (xphi^2)"];

/* ------------------------------------------------------------------ */
/*  Claim Row                                                          */
/* ------------------------------------------------------------------ */

function ClaimRow({ discoveryId }: { discoveryId: number }) {
  const pool = useDiscoveryPool(discoveryId);
  const userStake = useUserStake(discoveryId);
  const estimatedReward = useEstimateReward(discoveryId);
  const { claim, emergencyWithdraw, isPending } = useDiscoveryStakingActions();

  if (!userStake?.hasStake) return null;

  const isWinner = pool?.resolved && userStake.side === pool.winnerSide;
  const isLoser = pool?.resolved && userStake.side !== pool.winnerSide;

  let status = "PENDING";
  let statusColor = "text-amber-400";
  if (pool?.resolved && isWinner) {
    status = "WON";
    statusColor = "text-emerald-400";
  } else if (pool?.resolved && isLoser) {
    status = "LOST";
    statusColor = "text-rose-400";
  } else if (pool?.frozen) {
    status = "VOTING";
    statusColor = "text-yellow-400";
  }

  return (
    <div className="p-4 rounded-xl bg-white/[0.03] border border-amber-500/10 hover:border-amber-500/20 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-amber-500/60">#{discoveryId}</span>
            <span className={`text-xs font-bold ${statusColor}`}>{status}</span>
          </div>
          <h3 className="text-sm text-white/80 truncate">
            {DISCOVERY_TITLES[discoveryId] || `Discovery #${discoveryId}`}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 text-xs mb-3">
        <div>
          <div className="text-white/30">Staked</div>
          <div className="text-white font-mono">
            {Number(userStake.amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div>
          <div className="text-white/30">Side</div>
          <div className={SIDE_COLORS[userStake.side]}>
            {SIDE_LABELS[userStake.side]}
          </div>
        </div>
        <div>
          <div className="text-white/30">Tier</div>
          <div className="text-white/60">{TIER_LABELS[userStake.tier]}</div>
        </div>
        <div>
          <div className="text-white/30">Est. Reward</div>
          <div className="text-amber-400 font-mono">
            +{Number(estimatedReward).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {pool?.resolved && isWinner && !userStake.claimed && (
          <button
            onClick={() => claim(discoveryId)}
            disabled={isPending}
            className="flex-1 py-2 rounded-lg text-xs font-bold bg-emerald-500/20 border border-emerald-500/30
              text-emerald-400 hover:bg-emerald-500/30 transition-all disabled:opacity-30"
          >
            {isPending ? "Claiming..." : "Claim Reward"}
          </button>
        )}
        {userStake.claimed && (
          <span className="text-xs text-white/30 py-2">Claimed</span>
        )}
        {!pool?.resolved && (
          <button
            onClick={() => emergencyWithdraw(discoveryId)}
            disabled={isPending}
            className="py-2 px-4 rounded-lg text-xs font-medium bg-rose-500/10 border border-rose-500/20
              text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/20 transition-all disabled:opacity-30"
          >
            Emergency Exit (-38.2%)
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Claims Page                                                        */
/* ------------------------------------------------------------------ */

export default function ClaimsPage() {
  const { address } = useAccount();
  const { claimBatch, isPending } = useDiscoveryStakingActions();

  // Check all 13 discoveries for user stakes
  const discoveryIds = Array.from({ length: TOTAL_DISCOVERIES }, (_, i) => i);

  const handleClaimAll = () => {
    claimBatch(discoveryIds);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/discoveries" className="text-white/40 hover:text-white/60 text-sm">
                Discoveries
              </Link>
              <span className="text-white/20">/</span>
              <span className="text-amber-400 text-sm font-medium">My Claims</span>
            </div>
            <h1 className="text-2xl font-bold text-white">My Stakes & Claims</h1>
          </div>

          <button
            onClick={handleClaimAll}
            disabled={isPending || !address}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-yellow-500
              text-black hover:from-amber-400 hover:to-yellow-400 disabled:opacity-30 transition-all"
          >
            Claim All
          </button>
        </div>

        {!address ? (
          <div className="text-center py-20 text-white/30">
            Connect wallet to see your stakes
          </div>
        ) : (
          <div className="space-y-3">
            {discoveryIds.map((id) => (
              <ClaimRow key={id} discoveryId={id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
