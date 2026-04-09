"use client";

import { useState, useMemo } from "react";
import { StatCard } from "../../components/StatCard";
import {
  useTotalSpectralSupply,
  useSpectralTokenByIndex,
  useSpectralConfidence,
  useSpectralStakingMultiplier,
  useSpectralStage,
  useSpectralState,
} from "../../hooks/useSpectralNFT";

/* ------------------------------------------------------------------ */
/*  Stage definitions                                                  */
/* ------------------------------------------------------------------ */

const STAGES = [
  "ALL",
  "HYPOTHESIS",
  "SIGNAL",
  "CONVERGENCE",
  "CONFIRMATION",
  "DISCOVERY",
] as const;

type StageFilter = (typeof STAGES)[number];

const STAGE_COLORS: Record<string, string> = {
  HYPOTHESIS: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  SIGNAL: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  CONVERGENCE: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  CONFIRMATION: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  DISCOVERY: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

const STAGE_GLOW: Record<string, string> = {
  HYPOTHESIS: "shadow-violet-500/10",
  SIGNAL: "shadow-blue-500/10",
  CONVERGENCE: "shadow-cyan-500/10",
  CONFIRMATION: "shadow-emerald-500/10",
  DISCOVERY: "shadow-amber-500/20",
};

const STAGE_BAR_COLORS: Record<string, string> = {
  HYPOTHESIS: "from-violet-500 to-violet-400",
  SIGNAL: "from-blue-500 to-blue-400",
  CONVERGENCE: "from-cyan-500 to-cyan-400",
  CONFIRMATION: "from-emerald-500 to-emerald-400",
  DISCOVERY: "from-amber-500 to-yellow-400",
};

/* ------------------------------------------------------------------ */
/*  Spectral Card                                                      */
/* ------------------------------------------------------------------ */

function SpectralCard({ tokenId }: { tokenId: number }) {
  const state = useSpectralState(tokenId);
  const confidence = useSpectralConfidence(tokenId);
  const multiplier = useSpectralStakingMultiplier(tokenId);
  const stageData = useSpectralStage(tokenId);

  const stageName = stageData?.stage || "HYPOTHESIS";
  const stageColor = STAGE_COLORS[stageName] || STAGE_COLORS.HYPOTHESIS;
  const stageGlow = STAGE_GLOW[stageName] || STAGE_GLOW.HYPOTHESIS;
  const stageBar = STAGE_BAR_COLORS[stageName] || STAGE_BAR_COLORS.HYPOTHESIS;

  // Confidence is in WAD (1e18 = 100%), convert to percentage
  const confidencePct =
    confidence !== null ? (confidence / 1e16).toFixed(1) : "---";
  const multiplierDisplay =
    multiplier !== null ? (multiplier / 1e18).toFixed(2) : "---";

  return (
    <div
      className={`relative p-5 rounded-2xl bg-white/[0.03] backdrop-blur-sm
        border border-amber-500/20 hover:border-amber-500/40
        transition-all duration-300 group shadow-lg ${stageGlow}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-amber-500/60">
              #{tokenId}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${stageColor}`}
            >
              {stageName}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white/90 truncate">
            {state?.title || `Spectral #${tokenId}`}
          </h3>
          {state?.formula && (
            <p className="text-xs font-mono text-amber-400/60 mt-0.5 truncate">
              {state.formula}
            </p>
          )}
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-white/40 uppercase">Confidence</span>
          <span className="text-white/70 font-mono font-bold">
            {confidencePct}%
          </span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${stageBar} transition-all duration-700 rounded-full`}
            style={{
              width: `${confidence !== null ? Math.min(confidence / 1e16, 100) : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <div className="text-[10px] text-white/30 uppercase">Stage</div>
          <div className="text-xs font-bold text-white/70">{stageName}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-white/30 uppercase">Multiplier</div>
          <div className="text-xs font-bold text-amber-400">
            {multiplierDisplay}x
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-white/30 uppercase">Discovery</div>
          <div className="text-xs font-bold text-white/70">
            {state?.discoveryId !== undefined ? `#${state.discoveryId}` : "---"}
          </div>
        </div>
      </div>

      {/* Spectral metadata */}
      {state && (
        <div className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="grid grid-cols-2 gap-x-4 text-[11px]">
            <div className="flex justify-between">
              <span className="text-white/30">c0</span>
              <span className="text-white/50 font-mono">
                {Number(state.c0).toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/30">c&infin;</span>
              <span className="text-white/50 font-mono">
                {Number(state.cInf).toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between mt-0.5">
              <span className="text-white/30">&tau;</span>
              <span className="text-white/50 font-mono">{state.tau}s</span>
            </div>
            <div className="flex justify-between mt-0.5">
              <span className="text-white/30">Minted</span>
              <span className="text-amber-400/60 font-mono">
                {Number(state.mintAmount).toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{" "}
                ARTS
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom golden line */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent group-hover:via-amber-500/50 transition-all duration-300" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Token ID Loader (resolves tokenByIndex -> tokenId)                 */
/* ------------------------------------------------------------------ */

function SpectralCardByIndex({
  index,
  stageFilter,
}: {
  index: number;
  stageFilter: StageFilter;
}) {
  const tokenId = useSpectralTokenByIndex(index);
  const stageData = useSpectralStage(tokenId ?? -1);

  if (tokenId === null) return null;

  // Filter by stage
  if (stageFilter !== "ALL" && stageData?.stage !== stageFilter) return null;

  return <SpectralCard tokenId={tokenId} />;
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function SpectralGalleryPage() {
  const [stageFilter, setStageFilter] = useState<StageFilter>("ALL");
  const totalSupply = useTotalSpectralSupply();

  const indices = useMemo(
    () => Array.from({ length: totalSupply }, (_, i) => i),
    [totalSupply]
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
            Spectral Gallery
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Dynamic NFTs that evolve as scientific confidence grows &mdash; from
            Hypothesis to Discovery
          </p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Spectrals" value={String(totalSupply)} />
          <StatCard label="Stages" value="5" suffix="levels" />
          <StatCard label="Max Multiplier" value="1.618" suffix="x" />
          <StatCard
            label="Confidence"
            value="0-100"
            suffix="%"
          />
        </div>

        {/* Stage Evolution Explainer */}
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-amber-500/5 to-yellow-500/5 border border-amber-500/10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-lg">&#x1D6D7;</span>
            <span className="text-sm font-bold text-amber-400">
              Spectral Evolution: Confidence Stages
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            <div>
              <div className="text-violet-400 font-bold text-sm">0-20%</div>
              <div className="text-white/30">Hypothesis</div>
            </div>
            <div>
              <div className="text-blue-400 font-bold text-sm">20-40%</div>
              <div className="text-white/30">Signal</div>
            </div>
            <div>
              <div className="text-cyan-400 font-bold text-sm">40-60%</div>
              <div className="text-white/30">Convergence</div>
            </div>
            <div>
              <div className="text-emerald-400 font-bold text-sm">60-80%</div>
              <div className="text-white/30">Confirmation</div>
            </div>
            <div>
              <div className="text-amber-400 font-bold text-sm">80-100%</div>
              <div className="text-white/30">Discovery</div>
            </div>
          </div>
          <div className="mt-3 h-2 rounded-full overflow-hidden flex">
            <div className="flex-1 bg-gradient-to-r from-violet-600 to-violet-400" />
            <div className="flex-1 bg-gradient-to-r from-blue-500 to-blue-400" />
            <div className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-400" />
            <div className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />
            <div className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-400" />
          </div>
          <div className="mt-2 text-center text-[10px] text-white/20 font-mono">
            Staking multiplier scales with confidence: 1.0x &rarr; 1.618x
            (golden ratio)
          </div>
        </div>

        {/* Stage Filter */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {STAGES.map((stage) => (
            <button
              key={stage}
              onClick={() => setStageFilter(stage)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap
                transition-all duration-200 border ${
                  stageFilter === stage
                    ? stage === "ALL"
                      ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                      : STAGE_COLORS[stage]
                    : "bg-white/[0.02] border-white/10 text-white/40 hover:text-white/60 hover:border-white/20"
                }`}
            >
              {stage === "ALL" ? "All Stages" : stage}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {totalSupply === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 opacity-30">&#x1D6D7;</div>
            <h2 className="text-lg font-semibold text-white/40 mb-2">
              No Spectral NFTs yet
            </h2>
            <p className="text-sm text-white/20">
              Spectral NFTs will appear here once minted by the protocol.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {indices.map((index) => (
              <SpectralCardByIndex
                key={index}
                index={index}
                stageFilter={stageFilter}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
