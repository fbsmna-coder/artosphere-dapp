"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useReadContract, useWriteContract } from "wagmi";
import { parseEther, formatEther, encodeFunctionData } from "viem";
import { CONTRACTS } from "../../lib/contracts";

/* ------------------------------------------------------------------ */
/*  ABI fragments                                                     */
/* ------------------------------------------------------------------ */

const GOVERNOR_ABI = [
  {
    name: "propose",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "targets", type: "address[]" },
      { name: "values", type: "uint256[]" },
      { name: "calldatas", type: "bytes[]" },
      { name: "description", type: "string" },
    ],
    outputs: [{ name: "proposalId", type: "uint256" }],
  },
  {
    name: "castVote",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "proposalId", type: "uint256" },
      { name: "support", type: "uint8" },
    ],
    outputs: [{ name: "balance", type: "uint256" }],
  },
  {
    name: "proposalCount",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "proposals",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [
      { name: "id", type: "uint256" },
      { name: "proposer", type: "address" },
      { name: "eta", type: "uint256" },
      { name: "startBlock", type: "uint256" },
      { name: "endBlock", type: "uint256" },
      { name: "forVotes", type: "uint256" },
      { name: "againstVotes", type: "uint256" },
      { name: "abstainVotes", type: "uint256" },
      { name: "executed", type: "bool" },
      { name: "canceled", type: "bool" },
    ],
  },
  {
    name: "state",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    name: "quorum",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "blockNumber", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const PROPOSAL_STATES = [
  "Pending",
  "Active",
  "Canceled",
  "Defeated",
  "Succeeded",
  "Queued",
  "Expired",
  "Executed",
] as const;

function stateColor(state: number): string {
  switch (state) {
    case 1:
      return "text-green-400 bg-green-400/10 border-green-400/30";
    case 4:
    case 5:
      return "text-gold bg-gold/10 border-gold/30";
    case 7:
      return "text-blue-400 bg-blue-400/10 border-blue-400/30";
    case 3:
    case 2:
    case 6:
      return "text-red-400 bg-red-400/10 border-red-400/30";
    default:
      return "text-gray-400 bg-gray-400/10 border-gray-400/30";
  }
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function GovernPage() {
  return (
    <main className="min-h-screen bg-dark text-white px-4 py-fib-34 max-w-5xl mx-auto space-y-fib-55">
      <h1 className="text-phi-xl font-bold text-gold text-center tracking-tight">
        Governance
      </h1>
      <p className="text-center text-gray-400 max-w-2xl mx-auto">
        Shape the Artosphere protocol. Proposals require a{" "}
        <span className="text-gold font-bold">61.8% supermajority</span>{" "}
        &mdash; the golden ratio threshold &mdash; to pass.
      </p>

      <ProposalList />
      <CreateProposal />
    </main>
  );
}

/* ================================================================== */
/*  Proposal List                                                     */
/* ================================================================== */

function ProposalList() {
  const { data: proposalCount } = useReadContract({
    address: CONTRACTS.PhiGovernor as `0x${string}`,
    abi: GOVERNOR_ABI,
    functionName: "proposalCount",
  });

  const count = proposalCount ? Number(proposalCount) : 0;

  // Show the last 10 proposals (or less)
  const ids = Array.from({ length: Math.min(count, 10) }, (_, i) => count - i);

  return (
    <section className="space-y-4">
      <h2 className="text-phi-lg font-semibold text-gold-dark">
        Active Proposals
      </h2>

      {count === 0 ? (
        <div className="bg-dark-card border border-dark-border rounded-phi p-fib-34 text-center text-gray-500">
          No proposals yet. Be the first to shape the golden protocol.
        </div>
      ) : (
        <div className="space-y-4">
          {ids.map((id) => (
            <ProposalCard key={id} proposalId={BigInt(id)} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ================================================================== */
/*  Single Proposal Card                                              */
/* ================================================================== */

function ProposalCard({ proposalId }: { proposalId: bigint }) {
  const { writeContract: castVote, isPending: voting } = useWriteContract();

  const { data: proposal } = useReadContract({
    address: CONTRACTS.PhiGovernor as `0x${string}`,
    abi: GOVERNOR_ABI,
    functionName: "proposals",
    args: [proposalId],
  });

  const { data: stateRaw } = useReadContract({
    address: CONTRACTS.PhiGovernor as `0x${string}`,
    abi: GOVERNOR_ABI,
    functionName: "state",
    args: [proposalId],
  });

  const state = stateRaw !== undefined ? Number(stateRaw) : 0;
  const isActive = state === 1;

  const forVotes = proposal ? Number(formatEther(proposal[5])) : 0;
  const againstVotes = proposal ? Number(formatEther(proposal[6])) : 0;
  const abstainVotes = proposal ? Number(formatEther(proposal[7])) : 0;
  const totalVotes = forVotes + againstVotes + abstainVotes;
  const forPct = totalVotes > 0 ? (forVotes / totalVotes) * 100 : 0;
  const againstPct = totalVotes > 0 ? (againstVotes / totalVotes) * 100 : 0;

  const vote = (support: number) => {
    castVote({
      address: CONTRACTS.PhiGovernor as `0x${string}`,
      abi: GOVERNOR_ABI,
      functionName: "castVote",
      args: [proposalId, support],
    });
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-phi p-fib-34 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-gray-500">
            #{proposalId.toString()}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${stateColor(state)}`}
          >
            {PROPOSAL_STATES[state] ?? "Unknown"}
          </span>
        </div>
        {proposal && (
          <span className="text-xs text-gray-600 font-mono truncate max-w-[160px]">
            by {proposal[1]}
          </span>
        )}
      </div>

      {/* Vote bars */}
      <div className="space-y-2">
        <VoteBar label="For" pct={forPct} votes={forVotes} color="bg-green-500" />
        <VoteBar
          label="Against"
          pct={againstPct}
          votes={againstVotes}
          color="bg-red-500"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Abstain: {abstainVotes.toLocaleString()} ARTS</span>
          <span>
            Quorum threshold:{" "}
            <span className="text-gold">61.8%</span>
          </span>
        </div>
      </div>

      {/* Vote buttons */}
      {isActive && (
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => vote(1)}
            disabled={voting}
            className="flex-1 py-2.5 bg-green-500/10 border border-green-500/30 text-green-400 font-bold rounded-lg hover:bg-green-500/20 disabled:opacity-40 transition"
          >
            For
          </button>
          <button
            onClick={() => vote(0)}
            disabled={voting}
            className="flex-1 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded-lg hover:bg-red-500/20 disabled:opacity-40 transition"
          >
            Against
          </button>
          <button
            onClick={() => vote(2)}
            disabled={voting}
            className="flex-1 py-2.5 bg-gray-500/10 border border-gray-500/30 text-gray-400 font-bold rounded-lg hover:bg-gray-500/20 disabled:opacity-40 transition"
          >
            Abstain
          </button>
        </div>
      )}
    </div>
  );
}

function VoteBar({
  label,
  pct,
  votes,
  color,
}: {
  label: string;
  pct: number;
  votes: number;
  color: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-400">
          {votes.toLocaleString()} ARTS ({pct.toFixed(1)}%)
        </span>
      </div>
      <div className="w-full h-2 bg-dark rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Create Proposal                                                   */
/* ================================================================== */

function CreateProposal() {
  const [target, setTarget] = useState("");
  const [value, setValue] = useState("0");
  const [calldata, setCalldata] = useState("");
  const [description, setDescription] = useState("");

  const { writeContract: propose, isPending } = useWriteContract();

  const handlePropose = () => {
    if (!target || !description) return;
    propose({
      address: CONTRACTS.PhiGovernor as `0x${string}`,
      abi: GOVERNOR_ABI,
      functionName: "propose",
      args: [
        [target as `0x${string}`],
        [parseEther(value || "0")],
        [(calldata || "0x") as `0x${string}`],
        description,
      ],
    });
  };

  return (
    <section className="space-y-4">
      <h2 className="text-phi-lg font-semibold text-gold-dark">
        Create Proposal
      </h2>

      <div className="bg-dark-card border border-dark-border rounded-phi p-fib-34 space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Target Address
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-gold transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Value (ETH)
            </label>
            <input
              type="number"
              min="0"
              step="0.001"
              placeholder="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold transition"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Calldata (hex)
            </label>
            <input
              type="text"
              placeholder="0x"
              value={calldata}
              onChange={(e) => setCalldata(e.target.value)}
              className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-gold transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Describe what this proposal does and why..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold transition resize-none"
          />
        </div>

        <button
          onClick={handlePropose}
          disabled={isPending || !target || !description}
          className="px-8 py-3 bg-gold-gradient text-dark font-bold rounded-lg hover:opacity-90 disabled:opacity-40 transition"
        >
          {isPending ? "Submitting..." : "Submit Proposal"}
        </button>
      </div>
    </section>
  );
}
