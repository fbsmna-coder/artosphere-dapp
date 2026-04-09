"use client";

import { useState, useMemo } from "react";
import { StatCard } from "../../components/StatCard";
import {
  useNextHypothesisId,
  useHypothesis,
  useHardnessMultiplier,
  useFalsificationActions,
} from "../../hooks/useFalsificationMarket";

/* ------------------------------------------------------------------ */
/*  Status definitions                                                 */
/* ------------------------------------------------------------------ */

const STATUS_LABELS: Record<number, string> = {
  0: "ACTIVE",
  1: "FALSIFIED",
  2: "RETIRED",
};

const STATUS_COLORS: Record<number, string> = {
  0: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  1: "text-red-400 bg-red-500/10 border-red-500/20",
  2: "text-white/40 bg-white/5 border-white/10",
};

/* ------------------------------------------------------------------ */
/*  Hardness Bar                                                       */
/* ------------------------------------------------------------------ */

function HardnessBar({ hypothesisId, survivals }: { hypothesisId: number; survivals: number }) {
  const multiplier = useHardnessMultiplier(hypothesisId);

  // Hardness grows as phi^(survivals/5); cap display at ~4.236 (phi^3)
  const maxMultiplier = 4.236;
  const pct = Math.min((multiplier / maxMultiplier) * 100, 100);

  return (
    <div>
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-white/40 uppercase">
          Hardness &middot; {survivals} survivals
        </span>
        <span className="text-amber-400 font-mono font-bold">
          {multiplier.toFixed(3)}x
        </span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 transition-all duration-700 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-[9px] text-white/20 font-mono mt-0.5 text-right">
        &phi;^({survivals}/5)
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hypothesis Card                                                    */
/* ------------------------------------------------------------------ */

function HypothesisCard({
  hypothesisId,
  onChallenge,
}: {
  hypothesisId: number;
  onChallenge: (id: number) => void;
}) {
  const h = useHypothesis(hypothesisId);

  if (!h) return null;

  const statusLabel = STATUS_LABELS[h.status] || "UNKNOWN";
  const statusColor = STATUS_COLORS[h.status] || STATUS_COLORS[2];
  const isActive = h.status === 0;

  return (
    <div
      className={`relative p-5 rounded-2xl bg-white/[0.03] backdrop-blur-sm
        border border-amber-500/20 hover:border-amber-500/40
        transition-all duration-300 group shadow-lg ${
          isActive ? "shadow-emerald-500/5" : h.status === 1 ? "shadow-red-500/5" : ""
        }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-amber-500/60">
              #{hypothesisId}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${statusColor}`}
            >
              {statusLabel}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white/90 truncate">
            {h.title || `Hypothesis #${hypothesisId}`}
          </h3>
          <p className="text-xs text-white/30 mt-0.5 truncate font-mono">
            by {h.author.slice(0, 6)}...{h.author.slice(-4)}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <div className="text-[10px] text-white/30 uppercase">Stake</div>
          <div className="text-xs font-bold text-amber-400">
            {Number(h.authorStake).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{" "}
            ARTS
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-white/30 uppercase">Survivals</div>
          <div className="text-xs font-bold text-white/70">{h.survivals}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-white/30 uppercase">Discovery</div>
          <div className="text-xs font-bold text-white/70">#{h.discoveryId}</div>
        </div>
      </div>

      {/* Hardness Bar */}
      <div className="mb-3">
        <HardnessBar hypothesisId={hypothesisId} survivals={h.survivals} />
      </div>

      {/* Falsification stakes */}
      <div className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 mb-3">
        <div className="flex justify-between text-[11px]">
          <span className="text-white/30">Total challenge stake</span>
          <span className="text-red-400/80 font-mono font-bold">
            {Number(h.totalFalsificationStake).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{" "}
            ARTS
          </span>
        </div>
      </div>

      {/* Challenge Button */}
      {isActive && (
        <button
          onClick={() => onChallenge(hypothesisId)}
          className="w-full py-2.5 rounded-xl text-sm font-semibold
            bg-gradient-to-r from-red-600/80 to-red-500/80 text-white
            hover:from-red-500 hover:to-red-400
            border border-red-500/30 hover:border-red-400/50
            transition-all duration-200 active:scale-[0.98]"
        >
          Challenge
        </button>
      )}

      {/* Bottom golden line */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent group-hover:via-amber-500/50 transition-all duration-300" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Create Hypothesis Form                                             */
/* ------------------------------------------------------------------ */

function CreateHypothesisForm() {
  const [discoveryId, setDiscoveryId] = useState("");
  const [title, setTitle] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");

  const { createHypothesis, isPending } = useFalsificationActions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discoveryId || !title || !stakeAmount) return;
    createHypothesis(Number(discoveryId), title, stakeAmount);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
          Discovery ID
        </label>
        <input
          type="number"
          min="0"
          value={discoveryId}
          onChange={(e) => setDiscoveryId(e.target.value)}
          placeholder="0"
          className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10
            text-white text-sm placeholder:text-white/20
            focus:outline-none focus:border-amber-500/40 transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
          Hypothesis Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Dark energy density equals phi^-4 in Planck units"
          className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10
            text-white text-sm placeholder:text-white/20
            focus:outline-none focus:border-amber-500/40 transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
          Stake Amount (ARTS)
        </label>
        <input
          type="text"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
          placeholder="1000"
          className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10
            text-white text-sm placeholder:text-white/20
            focus:outline-none focus:border-amber-500/40 transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={isPending || !discoveryId || !title || !stakeAmount}
        className="w-full py-3 rounded-xl text-sm font-semibold
          bg-gradient-to-r from-amber-600 to-yellow-500 text-black
          hover:from-amber-500 hover:to-yellow-400
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-200 active:scale-[0.98]"
      >
        {isPending ? "Submitting..." : "Create Hypothesis"}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Challenge Modal (inline)                                           */
/* ------------------------------------------------------------------ */

function ChallengeForm({
  hypothesisId,
  onClose,
}: {
  hypothesisId: number;
  onClose: () => void;
}) {
  const [method, setMethod] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const { submitFalsification, isPending } = useFalsificationActions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!method || !stakeAmount) return;
    submitFalsification(hypothesisId, method, stakeAmount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 p-6 rounded-2xl bg-[#12121a] border border-red-500/20 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-red-400">
            Challenge Hypothesis #{hypothesisId}
          </h3>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors text-lg"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
              Falsification Method
            </label>
            <textarea
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              placeholder="Describe your falsification approach..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10
                text-white text-sm placeholder:text-white/20 resize-none
                focus:outline-none focus:border-red-500/40 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
              Stake Amount (ARTS)
            </label>
            <input
              type="text"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="500"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10
                text-white text-sm placeholder:text-white/20
                focus:outline-none focus:border-red-500/40 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isPending || !method || !stakeAmount}
            className="w-full py-3 rounded-xl text-sm font-semibold
              bg-gradient-to-r from-red-600 to-red-500 text-white
              hover:from-red-500 hover:to-red-400
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-200 active:scale-[0.98]"
          >
            {isPending ? "Submitting..." : "Submit Falsification"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function FalsificationMarketPage() {
  const [challengeTarget, setChallengeTarget] = useState<number | null>(null);
  const nextId = useNextHypothesisId();

  const hypothesisIds = useMemo(
    () => Array.from({ length: nextId }, (_, i) => i),
    [nextId]
  );

  // Rough stats (derived from count; real stats would need aggregation)
  const totalHypotheses = nextId;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
            Falsification Market
          </h1>
          <p className="text-sm text-white/40 mt-1 italic">
            &ldquo;A theory that is not refutable is not scientific&rdquo;
            &mdash; Karl Popper
          </p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Active Hypotheses" value={String(totalHypotheses)} />
          <StatCard label="Total Falsifications" value="---" suffix="attempts" />
          <StatCard label="Survival Rate" value="---" suffix="%" />
          <StatCard label="Total ARTS Staked" value="---" suffix="ARTS" />
        </div>

        {/* Popper explainer */}
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-red-500/5 to-amber-500/5 border border-red-500/10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-lg">&phi;</span>
            <span className="text-sm font-bold text-red-400">
              Popperian Hardness: &phi;^(survivals/5)
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <div className="text-white/60 font-bold text-sm">0</div>
              <div className="text-white/30">1.000x</div>
            </div>
            <div>
              <div className="text-amber-400/80 font-bold text-sm">5</div>
              <div className="text-white/30">1.618x</div>
            </div>
            <div>
              <div className="text-amber-400 font-bold text-sm">10</div>
              <div className="text-white/30">2.618x</div>
            </div>
            <div>
              <div className="text-yellow-400 font-bold text-sm">15</div>
              <div className="text-white/30">4.236x</div>
            </div>
          </div>
          <div className="mt-3 h-2 rounded-full overflow-hidden flex">
            <div className="flex-1 bg-gradient-to-r from-white/10 to-amber-600/60" />
            <div className="flex-1 bg-gradient-to-r from-amber-600/60 to-amber-500" />
            <div className="flex-1 bg-gradient-to-r from-amber-500 to-amber-400" />
            <div className="flex-1 bg-gradient-to-r from-amber-400 to-yellow-400" />
          </div>
          <div className="mt-2 text-center text-[10px] text-white/20 font-mono">
            Each survived falsification attempt increases hypothesis hardness by
            &phi;^(1/5)
          </div>
        </div>

        {/* Two-column: Gallery + Create Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hypothesis Cards */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-white/80 mb-4">
              Hypotheses
            </h2>
            {totalHypotheses === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4 opacity-30">&phi;</div>
                <h2 className="text-lg font-semibold text-white/40 mb-2">
                  No hypotheses yet
                </h2>
                <p className="text-sm text-white/20">
                  Be the first to stake your scientific claim.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hypothesisIds.map((id) => (
                  <HypothesisCard
                    key={id}
                    hypothesisId={id}
                    onChallenge={(hId) => setChallengeTarget(hId)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Create Hypothesis */}
          <div>
            <h2 className="text-lg font-semibold text-white/80 mb-4">
              Create Hypothesis
            </h2>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-amber-500/20">
              <CreateHypothesisForm />
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Modal */}
      {challengeTarget !== null && (
        <ChallengeForm
          hypothesisId={challengeTarget}
          onClose={() => setChallengeTarget(null)}
        />
      )}
    </div>
  );
}
