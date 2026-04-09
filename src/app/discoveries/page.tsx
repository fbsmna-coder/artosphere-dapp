"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useReadContract, useWriteContract } from "wagmi";
import { parseEther, formatEther } from "viem";
import { StatCard } from "../../components/StatCard";
import {
  useDiscoveryPool,
  useUserStake,
  useEstimateReward,
  useTotalStaked,
  useDiscoveryStakingActions,
} from "../../hooks/useDiscoveryStaking";
import { DISCOVERIES, type DiscoveryInfo } from "../../lib/discoveries";

const TIER_NAMES = ["5 days (×1.0)", "21 days (×φ)", "55 days (×φ²)"];
const SIDE_LABELS = ["CONFIRM", "REFUTE"];
const SIDE_COLORS = ["text-emerald-400", "text-rose-400"];
const STATUS_COLORS: Record<string, string> = {
  PROVEN: "text-blue-400 bg-blue-500/10",
  CONFIRMED: "text-emerald-400 bg-emerald-500/10",
  PREDICTED: "text-amber-400 bg-amber-500/10",
  OPEN: "text-white/60 bg-white/5",
  REFUTED: "text-rose-400 bg-rose-500/10",
  SUPERSEDED: "text-white/30 bg-white/5",
};

/* ------------------------------------------------------------------ */
/*  Discovery Card                                                     */
/* ------------------------------------------------------------------ */

function DiscoveryCard({
  info,
  onStake,
}: {
  info: DiscoveryInfo;
  onStake: (id: number) => void;
}) {
  const pool = useDiscoveryPool(info.id);
  const userStake = useUserStake(info.id);
  const estimatedReward = useEstimateReward(info.id);

  const confirmPct =
    pool && pool.confirmPoolRaw + pool.refutePoolRaw > BigInt(0)
      ? Number(
          (pool.confirmPoolRaw * BigInt(1000)) /
            (pool.confirmPoolRaw + pool.refutePoolRaw)
        ) / 10
      : 50;

  return (
    <div className="relative p-5 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-amber-500/60">
              #{info.id}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                STATUS_COLORS[info.status] || STATUS_COLORS.OPEN
              }`}
            >
              {info.status}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 font-mono">
              {info.category}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white/90 truncate">
            {info.title}
          </h3>
          <p className="text-xs font-mono text-amber-400/60 mt-0.5 truncate">
            {info.formula}
          </p>
        </div>
      </div>

      {/* Science Weight Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-emerald-400">
            CONFIRM {confirmPct.toFixed(1)}%
          </span>
          <span className="text-rose-400">
            REFUTE {(100 - confirmPct).toFixed(1)}%
          </span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden flex">
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${confirmPct}%` }}
          />
          <div
            className="bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-500"
            style={{ width: `${100 - confirmPct}%` }}
          />
        </div>
      </div>

      {/* Pool Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <div className="text-[10px] text-white/30 uppercase">Weight</div>
          <div className="text-xs font-bold text-amber-400">
            {pool ? Number(pool.scienceWeight).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "—"}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-white/30 uppercase">Confirm</div>
          <div className="text-xs font-bold text-emerald-400">
            {pool ? Number(pool.confirmPool).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "—"}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-white/30 uppercase">Refute</div>
          <div className="text-xs font-bold text-rose-400">
            {pool ? Number(pool.refutePool).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "—"}
          </div>
        </div>
      </div>

      {/* User stake info */}
      {userStake?.hasStake && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
          <div className="flex justify-between text-xs">
            <span className="text-white/40">Your Stake</span>
            <span className={SIDE_COLORS[userStake.side]}>
              {Number(userStake.amount).toLocaleString(undefined, { maximumFractionDigits: 0 })} ARTS
              ({SIDE_LABELS[userStake.side]})
            </span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-white/40">Est. Reward</span>
            <span className="text-amber-400">
              +{Number(estimatedReward).toLocaleString(undefined, { maximumFractionDigits: 0 })} ARTS
            </span>
          </div>
        </div>
      )}

      {/* Status badges */}
      <div className="flex gap-2">
        {pool?.frozen && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            FROZEN
          </span>
        )}
        {pool?.resolved && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            RESOLVED: {pool.winnerSide === 0 ? "CONFIRMED" : "REFUTED"}
          </span>
        )}
      </div>

      {/* Action button */}
      {!pool?.resolved && !pool?.frozen && (
        <button
          onClick={() => onStake(info.id)}
          className="w-full mt-3 py-2 rounded-lg text-xs font-semibold
            bg-gradient-to-r from-amber-500/20 to-yellow-500/20
            border border-amber-500/30 text-amber-400
            hover:from-amber-500/30 hover:to-yellow-500/30
            hover:border-amber-500/50 transition-all duration-200"
        >
          Stake on Discovery
        </button>
      )}

      {/* Bottom golden line */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent group-hover:via-amber-500/50 transition-all duration-300" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stake Modal                                                        */
/* ------------------------------------------------------------------ */

function StakeModal({
  discoveryId,
  discoveryTitle,
  onClose,
}: {
  discoveryId: number;
  discoveryTitle: string;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [side, setSide] = useState(0); // 0=CONFIRM, 1=REFUTE
  const [tier, setTier] = useState(2); // Default to best tier
  const { stakeOnDiscovery, isPending } = useDiscoveryStakingActions();
  const { address } = useAccount();

  const handleStake = () => {
    if (!amount || Number(amount) < 100) return;
    stakeOnDiscovery(discoveryId, amount, side, tier);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 p-6 rounded-2xl bg-[#111118] border border-amber-500/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Stake on Discovery</h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-amber-400/60 mb-4 font-mono truncate">
          #{discoveryId}: {discoveryTitle}
        </p>

        {/* Side selection */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {SIDE_LABELS.map((label, i) => (
            <button
              key={i}
              onClick={() => setSide(i)}
              className={`py-3 rounded-xl text-sm font-bold transition-all duration-200 border ${
                side === i
                  ? i === 0
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/40 text-rose-400"
                  : "bg-white/[0.02] border-white/10 text-white/40 hover:text-white/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tier selection */}
        <div className="mb-4">
          <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">
            Lock Tier (Fibonacci)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TIER_NAMES.map((name, i) => (
              <button
                key={i}
                onClick={() => setTier(i)}
                className={`py-2 rounded-lg text-[11px] font-medium transition-all border ${
                  tier === i
                    ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                    : "bg-white/[0.02] border-white/10 text-white/40"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Amount input */}
        <div className="mb-4">
          <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">
            Amount (ARTS)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Min: 100 ARTS"
            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10
              text-white placeholder-white/20 focus:border-amber-500/40
              focus:outline-none transition-colors text-sm font-mono"
          />
        </div>

        {/* Fee info */}
        <div className="mb-4 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="flex justify-between text-xs">
            <span className="text-white/30">Staking Fee (1.18%)</span>
            <span className="text-amber-400/60">
              {amount ? (Number(amount) * 0.0118).toFixed(2) : "0"} ARTS
            </span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-white/30">Net Stake</span>
            <span className="text-white/60">
              {amount ? (Number(amount) * 0.9882).toFixed(2) : "0"} ARTS
            </span>
          </div>
        </div>

        {/* phi-Cascade info */}
        <div className="mb-4 px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
          <div className="text-[10px] text-amber-400/60 uppercase tracking-wider mb-1">
            φ-Cascade v2 (if you win)
          </div>
          <div className="grid grid-cols-2 gap-x-4 text-[11px]">
            <span className="text-emerald-400">Winners: 61.80%</span>
            <span className="text-rose-400">Burn: 23.60%</span>
            <span className="text-amber-400">Scientist: 9.02%</span>
            <span className="text-white/40">Treasury: 5.57%</span>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleStake}
          disabled={isPending || !address || !amount || Number(amount) < 100}
          className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200
            bg-gradient-to-r from-amber-500 to-yellow-500 text-black
            hover:from-amber-400 hover:to-yellow-400
            disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isPending
            ? "Confirming..."
            : !address
            ? "Connect Wallet"
            : `Stake ${amount || "0"} ARTS (${SIDE_LABELS[side]})`}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function DiscoveriesPage() {
  const [selectedDiscovery, setSelectedDiscovery] = useState<number | null>(null);
  const totalStaked = useTotalStaked();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
            Discovery Staking
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Prediction market for scientific discoveries — stake ARTS on
            experimental outcomes
          </p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Staked" value={Number(totalStaked).toLocaleString(undefined, { maximumFractionDigits: 0 })} suffix="ARTS" />
          <StatCard label="Discoveries" value={String(DISCOVERIES.length)} />
          <StatCard label="Winner Share" value="61.80%" suffix="φ⁻¹" />
          <StatCard label="Burn Rate" value="23.60%" suffix="φ⁻³" />
        </div>

        {/* φ-Cascade explainer */}
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-amber-500/5 to-yellow-500/5 border border-amber-500/10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg">φ</span>
            <span className="text-sm font-bold text-amber-400">
              φ-Cascade v2: Losing Pool Distribution
            </span>
          </div>
          <div className="grid grid-cols-4 gap-4 text-center text-xs">
            <div>
              <div className="text-emerald-400 font-bold text-lg">61.80%</div>
              <div className="text-white/30">Winners (φ⁻¹)</div>
            </div>
            <div>
              <div className="text-rose-400 font-bold text-lg">23.60%</div>
              <div className="text-white/30">Burned (φ⁻³)</div>
            </div>
            <div>
              <div className="text-amber-400 font-bold text-lg">9.02%</div>
              <div className="text-white/30">Scientist (φ⁻⁵)</div>
            </div>
            <div>
              <div className="text-white/60 font-bold text-lg">5.57%</div>
              <div className="text-white/30">Treasury (φ⁻⁶)</div>
            </div>
          </div>
          <div className="mt-2 text-center text-[10px] text-white/20 font-mono">
            φ⁻¹ + φ⁻³ + φ⁻⁵ + φ⁻⁶ = 1 (exact, by φ² = φ + 1)
          </div>
        </div>

        {/* Discovery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DISCOVERIES.map((d) => (
            <DiscoveryCard
              key={d.id}
              info={d}
              onStake={setSelectedDiscovery}
            />
          ))}
        </div>

        {/* Stake Modal */}
        {selectedDiscovery !== null && (
          <StakeModal
            discoveryId={selectedDiscovery}
            discoveryTitle={
              DISCOVERIES.find((d) => d.id === selectedDiscovery)?.title || ""
            }
            onClose={() => setSelectedDiscovery(null)}
          />
        )}
      </div>
    </div>
  );
}
