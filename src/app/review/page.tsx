"use client";

import { useState, useMemo } from "react";
import { StatCard } from "../../components/StatCard";
import {
  useNextPaperId,
  usePaper,
  useReviewCount,
} from "../../hooks/usePeerReview";

/* ------------------------------------------------------------------ */
/*  Paper status definitions                                           */
/* ------------------------------------------------------------------ */

const STATUS_LABELS = [
  "SUBMITTED",
  "IN_REVIEW",
  "REVISION",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
] as const;

type StatusFilter = "ALL" | (typeof STATUS_LABELS)[number];

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  IN_REVIEW: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  REVISION: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  ACCEPTED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  REJECTED: "text-red-400 bg-red-500/10 border-red-500/20",
  WITHDRAWN: "text-white/40 bg-white/5 border-white/10",
};

const STATUS_GLOW: Record<string, string> = {
  SUBMITTED: "shadow-amber-500/10",
  IN_REVIEW: "shadow-blue-500/10",
  REVISION: "shadow-violet-500/10",
  ACCEPTED: "shadow-emerald-500/10",
  REJECTED: "shadow-red-500/10",
  WITHDRAWN: "",
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatCountdown(deadline: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = deadline - now;
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  return `${hours}h ${mins}m`;
}

/* ------------------------------------------------------------------ */
/*  Paper Card                                                         */
/* ------------------------------------------------------------------ */

function PaperCard({ paperId }: { paperId: number }) {
  const paper = usePaper(paperId);
  const reviewCount = useReviewCount(paperId);

  if (!paper) return null;

  const statusLabel = STATUS_LABELS[paper.status] || "SUBMITTED";
  const statusColor = STATUS_COLORS[statusLabel] || STATUS_COLORS.SUBMITTED;
  const statusGlow = STATUS_GLOW[statusLabel] || "";

  const deadline =
    paper.status === 1
      ? paper.reviewDeadline
      : paper.status === 1
        ? paper.revealDeadline
        : 0;

  return (
    <div
      className={`relative p-5 rounded-2xl bg-white/[0.03] backdrop-blur-sm
        border border-amber-500/20 hover:border-amber-500/40
        transition-all duration-300 group shadow-lg ${statusGlow}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-amber-500/60">
              #{paperId}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${statusColor}`}
            >
              {statusLabel}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white/90 truncate">
            {paper.title || `Paper #${paperId}`}
          </h3>
          {paper.doi && (
            <p className="text-xs font-mono text-amber-400/60 mt-0.5 truncate">
              DOI: {paper.doi}
            </p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <div className="text-[10px] text-white/30 uppercase">Author</div>
          <div className="text-xs font-bold text-white/70 font-mono">
            {truncateAddress(paper.author)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-white/30 uppercase">Reviews</div>
          <div className="text-xs font-bold text-amber-400">
            {reviewCount}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-white/30 uppercase">Deadline</div>
          <div className="text-xs font-bold text-white/70">
            {deadline > 0 ? formatCountdown(deadline) : "---"}
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
        <div className="grid grid-cols-2 gap-x-4 text-[11px]">
          <div className="flex justify-between">
            <span className="text-white/30">Submitted</span>
            <span className="text-white/50 font-mono">
              {paper.submittedAt > 0
                ? new Date(paper.submittedAt * 1000).toLocaleDateString()
                : "---"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/30">Content</span>
            <span className="text-white/50 font-mono truncate max-w-[80px]">
              {paper.contentHash.slice(0, 10)}...
            </span>
          </div>
        </div>
      </div>

      {/* Bottom golden line */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent group-hover:via-amber-500/50 transition-all duration-300" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Paper Card with status filter                                      */
/* ------------------------------------------------------------------ */

function PaperCardFiltered({
  paperId,
  statusFilter,
}: {
  paperId: number;
  statusFilter: StatusFilter;
}) {
  const paper = usePaper(paperId);

  if (!paper) return null;

  const statusLabel = STATUS_LABELS[paper.status] || "SUBMITTED";
  if (statusFilter !== "ALL" && statusLabel !== statusFilter) return null;

  return <PaperCard paperId={paperId} />;
}

/* ------------------------------------------------------------------ */
/*  Submit Paper Form                                                  */
/* ------------------------------------------------------------------ */

function SubmitPaperForm() {
  const [title, setTitle] = useState("");
  const [contentHash, setContentHash] = useState("");
  const [doi, setDoi] = useState("");

  return (
    <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-amber-500/20">
      <h2 className="text-lg font-bold text-white/90 mb-4">Submit Paper</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/40 font-medium mb-1.5">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Paper title..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10
              text-sm text-white/90 placeholder-white/20
              focus:outline-none focus:border-amber-500/40 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/40 font-medium mb-1.5">
            Content Hash
          </label>
          <input
            type="text"
            value={contentHash}
            onChange={(e) => setContentHash(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10
              text-sm text-white/90 placeholder-white/20 font-mono
              focus:outline-none focus:border-amber-500/40 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/40 font-medium mb-1.5">
            DOI
          </label>
          <input
            type="text"
            value={doi}
            onChange={(e) => setDoi(e.target.value)}
            placeholder="10.xxxx/..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10
              text-sm text-white/90 placeholder-white/20 font-mono
              focus:outline-none focus:border-amber-500/40 transition-colors"
          />
        </div>
        <button
          disabled
          className="w-full px-4 py-3 rounded-xl bg-amber-500/20 border border-amber-500/30
            text-sm font-semibold text-amber-400/60 cursor-not-allowed
            transition-all duration-200"
        >
          Submit Paper (Coming Soon)
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function PeerReviewPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const nextPaperId = useNextPaperId();

  const totalPapers = nextPaperId;
  const paperIds = useMemo(
    () => Array.from({ length: totalPapers }, (_, i) => i),
    [totalPapers],
  );

  const filters: StatusFilter[] = [
    "ALL",
    "SUBMITTED",
    "IN_REVIEW",
    "ACCEPTED",
    "REJECTED",
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
            Peer Review DAO
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Decentralized scientific peer review with &phi;-weighted consensus
            &mdash; commit-reveal scoring, on-chain reputation, and fair reward
            distribution
          </p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Papers" value={String(totalPapers)} />
          <StatCard label="Active Reviews" value="---" suffix="papers" />
          <StatCard label="Accepted" value="---" suffix="papers" />
          <StatCard label="Rejected" value="---" suffix="papers" />
        </div>

        {/* Review Process Explainer */}
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-amber-500/5 to-yellow-500/5 border border-amber-500/10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-lg">&#x1D6D7;</span>
            <span className="text-sm font-bold text-amber-400">
              Review Lifecycle: Commit-Reveal Protocol
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <div className="text-amber-400 font-bold text-sm">1</div>
              <div className="text-white/30">Submit Paper</div>
            </div>
            <div>
              <div className="text-blue-400 font-bold text-sm">2</div>
              <div className="text-white/30">Commit Review</div>
            </div>
            <div>
              <div className="text-cyan-400 font-bold text-sm">3</div>
              <div className="text-white/30">Reveal Score</div>
            </div>
            <div>
              <div className="text-emerald-400 font-bold text-sm">4</div>
              <div className="text-white/30">Resolve &amp; Reward</div>
            </div>
          </div>
          <div className="mt-3 h-2 rounded-full overflow-hidden flex">
            <div className="flex-1 bg-gradient-to-r from-amber-500 to-amber-400" />
            <div className="flex-1 bg-gradient-to-r from-blue-500 to-blue-400" />
            <div className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-400" />
            <div className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />
          </div>
          <div className="mt-2 text-center text-[10px] text-white/20 font-mono">
            &phi;-weighted scoring ensures fair, Sybil-resistant scientific
            consensus
          </div>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {filters.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap
                transition-all duration-200 border ${
                  statusFilter === status
                    ? status === "ALL"
                      ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                      : STATUS_COLORS[status] || ""
                    : "bg-white/[0.02] border-white/10 text-white/40 hover:text-white/60 hover:border-white/20"
                }`}
            >
              {status === "ALL" ? "All Papers" : status.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Papers Grid */}
        {totalPapers === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 opacity-30">&#x1D6D7;</div>
            <h2 className="text-lg font-semibold text-white/40 mb-2">
              No papers submitted yet
            </h2>
            <p className="text-sm text-white/20">
              Papers will appear here once submitted to the Peer Review DAO.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {paperIds.map((id) => (
              <PaperCardFiltered
                key={id}
                paperId={id}
                statusFilter={statusFilter}
              />
            ))}
          </div>
        )}

        {/* Submit Paper Section */}
        <div className="mt-8">
          <SubmitPaperForm />
        </div>
      </div>
    </div>
  );
}
