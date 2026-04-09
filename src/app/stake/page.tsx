"use client";

import { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { useReadContract, useWriteContract } from "wagmi";
import { parseEther, formatEther } from "viem";
import { CONTRACTS } from "../../lib/contracts";

/* ------------------------------------------------------------------ */
/*  ABIs (minimal fragments for the functions we call)                */
/* ------------------------------------------------------------------ */

const MATRYOSHKA_ABI = [
  {
    name: "stake",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "layer", type: "uint8" },
    ],
    outputs: [],
  },
  {
    name: "unstake",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "layer", type: "uint8" }],
    outputs: [],
  },
  {
    name: "emergencyWithdraw",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "layer", type: "uint8" }],
    outputs: [],
  },
  {
    name: "getUserStake",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "user", type: "address" },
      { name: "layer", type: "uint8" },
    ],
    outputs: [
      { name: "amount", type: "uint256" },
      { name: "reward", type: "uint256" },
    ],
  },
  {
    name: "totalStaked",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

const GOLDEN_MIRROR_ABI = [
  {
    name: "mirrorStake",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    name: "mirrorUnstake",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    name: "getUserLocked",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "totalLocked",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

const ARTS_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

const PHI_STAKING_ABI = [
  {
    name: "getTemporalMass",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getHoldingDuration",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const LAYERS = [
  { id: 0, name: "Outer Shell", lockDays: 5, apyMultiplier: "1.0x" },
  { id: 1, name: "Middle Layer", lockDays: 8, apyMultiplier: "1.6x" },
  { id: 2, name: "Inner Core", lockDays: 21, apyMultiplier: "3.4x" },
  { id: 3, name: "Golden Heart", lockDays: 55, apyMultiplier: "5.5x" },
  { id: 4, name: "Phi Singularity", lockDays: 377, apyMultiplier: "11.1x" },
] as const;

const PHI = 1.618033988749895;
const MAX_TEMPORAL_MASS = 7.5;
const MAX_HOLDING_DAYS = 377;

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function StakePage() {
  return (
    <main className="min-h-screen bg-dark text-white px-4 py-fib-34 max-w-6xl mx-auto space-y-fib-55">
      <h1 className="text-phi-xl font-bold text-gold text-center tracking-tight">
        Staking Dashboard
      </h1>
      <p className="text-center text-gray-400 max-w-2xl mx-auto">
        Lock ARTS tokens across Fibonacci time-layers. The longer you commit,
        the deeper the reward &mdash; governed by the golden ratio.
      </p>

      <MatryoshkaSection />
      <GoldenMirrorSection />
      <ProofOfPatienceSection />
    </main>
  );
}

/* ================================================================== */
/*  Section 1 — Matryoshka Staking                                    */
/* ================================================================== */

function MatryoshkaSection() {
  const { address } = useAccount();
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [amount, setAmount] = useState("");

  const { writeContract: stake, isPending: staking } = useWriteContract();
  const { writeContract: unstake, isPending: unstaking } = useWriteContract();
  const { writeContract: emergencyWithdraw, isPending: withdrawing } =
    useWriteContract();

  const { data: totalStaked } = useReadContract({
    address: CONTRACTS.MatryoshkaStaking as `0x${string}`,
    abi: MATRYOSHKA_ABI,
    functionName: "totalStaked",
  });

  const { data: userStake } = useReadContract({
    address: CONTRACTS.MatryoshkaStaking as `0x${string}`,
    abi: MATRYOSHKA_ABI,
    functionName: "getUserStake",
    args: address ? [address, selectedLayer] : undefined,
    query: { enabled: !!address },
  });

  const handleStake = () => {
    if (!amount) return;
    stake({
      address: CONTRACTS.MatryoshkaStaking as `0x${string}`,
      abi: MATRYOSHKA_ABI,
      functionName: "stake",
      args: [parseEther(amount), selectedLayer],
    });
  };

  const handleUnstake = () => {
    unstake({
      address: CONTRACTS.MatryoshkaStaking as `0x${string}`,
      abi: MATRYOSHKA_ABI,
      functionName: "unstake",
      args: [selectedLayer],
    });
  };

  const handleEmergency = () => {
    emergencyWithdraw({
      address: CONTRACTS.MatryoshkaStaking as `0x${string}`,
      abi: MATRYOSHKA_ABI,
      functionName: "emergencyWithdraw",
      args: [selectedLayer],
    });
  };

  return (
    <section className="space-y-6">
      <h2 className="text-phi-lg font-semibold text-gold-dark flex items-center gap-2">
        <span className="text-2xl">&#127886;</span> Matryoshka Staking
      </h2>

      {/* Layer cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {LAYERS.map((layer) => (
          <button
            key={layer.id}
            onClick={() => setSelectedLayer(layer.id)}
            className={`rounded-phi p-fib-21 border text-left transition-all duration-300 ${
              selectedLayer === layer.id
                ? "border-gold bg-dark-card shadow-gold"
                : "border-dark-border bg-dark-card hover:border-gold-muted hover:bg-dark-hover"
            }`}
          >
            <p className="text-sm text-gray-400">{layer.name}</p>
            <p className="text-lg font-bold text-white mt-1">
              {layer.lockDays} days
            </p>
            <p className="text-gold font-mono text-sm mt-fib-5">
              {layer.apyMultiplier} APY
            </p>
          </button>
        ))}
      </div>

      {/* Stake controls */}
      <div className="bg-dark-card border border-dark-border rounded-phi p-fib-34 space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Amount to Stake (ARTS)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold transition"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleStake}
            disabled={staking || !amount}
            className="px-6 py-3 bg-gold-gradient text-dark font-bold rounded-lg hover:opacity-90 disabled:opacity-40 transition"
          >
            {staking ? "Staking..." : "Stake"}
          </button>
          <button
            onClick={handleUnstake}
            disabled={unstaking}
            className="px-6 py-3 border border-gold text-gold font-bold rounded-lg hover:bg-gold/10 disabled:opacity-40 transition"
          >
            {unstaking ? "Unstaking..." : "Unstake"}
          </button>
          <button
            onClick={handleEmergency}
            disabled={withdrawing}
            className="px-6 py-3 border border-red-500/60 text-red-400 font-bold rounded-lg hover:bg-red-500/10 disabled:opacity-40 transition"
          >
            {withdrawing ? "Withdrawing..." : "Emergency Withdraw"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-dark-border">
          <Stat
            label="Your Staked"
            value={
              userStake
                ? `${formatEther(userStake[0])} ARTS`
                : "---"
            }
          />
          <Stat
            label="Current Reward"
            value={
              userStake
                ? `${formatEther(userStake[1])} ARTS`
                : "---"
            }
          />
          <Stat
            label="Total in Contract"
            value={
              totalStaked
                ? `${Number(formatEther(totalStaked)).toLocaleString()} ARTS`
                : "---"
            }
          />
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  Section 2 — Golden Mirror                                         */
/* ================================================================== */

function GoldenMirrorSection() {
  const { address } = useAccount();
  const [amount, setAmount] = useState("");

  const { writeContract: mirrorStake, isPending: staking } =
    useWriteContract();
  const { writeContract: mirrorUnstake, isPending: unstaking } =
    useWriteContract();

  const { data: userLocked } = useReadContract({
    address: CONTRACTS.GoldenMirror as `0x${string}`,
    abi: GOLDEN_MIRROR_ABI,
    functionName: "getUserLocked",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: gartsBalance } = useReadContract({
    address: CONTRACTS.GoldenMirror as `0x${string}`,
    abi: ARTS_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: totalLocked } = useReadContract({
    address: CONTRACTS.GoldenMirror as `0x${string}`,
    abi: GOLDEN_MIRROR_ABI,
    functionName: "totalLocked",
  });

  const mirrorOutput = amount ? (parseFloat(amount) * PHI).toFixed(6) : "0";

  const handleMirrorStake = () => {
    if (!amount) return;
    mirrorStake({
      address: CONTRACTS.GoldenMirror as `0x${string}`,
      abi: GOLDEN_MIRROR_ABI,
      functionName: "mirrorStake",
      args: [parseEther(amount)],
    });
  };

  const handleMirrorUnstake = () => {
    if (!amount) return;
    mirrorUnstake({
      address: CONTRACTS.GoldenMirror as `0x${string}`,
      abi: GOLDEN_MIRROR_ABI,
      functionName: "mirrorUnstake",
      args: [parseEther(amount)],
    });
  };

  return (
    <section className="space-y-6">
      <h2 className="text-phi-lg font-semibold text-gold-dark flex items-center gap-2">
        <span className="text-2xl">&#129668;</span> Golden Mirror
      </h2>

      <div className="bg-dark-card border border-dark-border rounded-phi p-fib-34 space-y-5">
        <p className="text-gray-300 leading-relaxed">
          Deposit <span className="text-gold font-bold">ARTS</span> and receive{" "}
          <span className="text-gold font-bold">&phi; &times; amount</span> in{" "}
          <span className="text-gold font-bold">gARTS</span> &mdash; a golden
          ratio amplified governance token.
        </p>

        {/* Input / preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Deposit ARTS
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold transition"
            />
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-sm text-gray-400 mb-1">You will receive</p>
            <p className="text-phi-lg font-bold text-gold font-mono">
              {mirrorOutput} <span className="text-base text-gold-dark">gARTS</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleMirrorStake}
            disabled={staking || !amount}
            className="px-6 py-3 bg-gold-gradient text-dark font-bold rounded-lg hover:opacity-90 disabled:opacity-40 transition"
          >
            {staking ? "Mirroring..." : "Mirror Stake"}
          </button>
          <button
            onClick={handleMirrorUnstake}
            disabled={unstaking || !amount}
            className="px-6 py-3 border border-gold text-gold font-bold rounded-lg hover:bg-gold/10 disabled:opacity-40 transition"
          >
            {unstaking ? "Unstaking..." : "Mirror Unstake"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-dark-border">
          <Stat
            label="Your ARTS Locked"
            value={
              userLocked
                ? `${formatEther(userLocked)} ARTS`
                : "---"
            }
          />
          <Stat
            label="Your gARTS Balance"
            value={
              gartsBalance
                ? `${formatEther(gartsBalance)} gARTS`
                : "---"
            }
          />
          <Stat
            label="Total ARTS in Mirror"
            value={
              totalLocked
                ? `${Number(formatEther(totalLocked)).toLocaleString()} ARTS`
                : "---"
            }
          />
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  Section 3 — Proof of Patience                                     */
/* ================================================================== */

function ProofOfPatienceSection() {
  const { address } = useAccount();

  const { data: temporalMassRaw } = useReadContract({
    address: CONTRACTS.PhiStaking as `0x${string}`,
    abi: PHI_STAKING_ABI,
    functionName: "getTemporalMass",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: holdingDurationRaw } = useReadContract({
    address: CONTRACTS.PhiStaking as `0x${string}`,
    abi: PHI_STAKING_ABI,
    functionName: "getHoldingDuration",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // temporalMass is stored as fixed-point (18 decimals)
  const temporalMass = temporalMassRaw
    ? parseFloat(formatEther(temporalMassRaw))
    : 1.0;
  const holdingDays = holdingDurationRaw
    ? Number(holdingDurationRaw) / 86400
    : 0;
  const progressPercent = Math.min(
    (temporalMass / MAX_TEMPORAL_MASS) * 100,
    100
  );

  return (
    <section className="space-y-6">
      <h2 className="text-phi-lg font-semibold text-gold-dark flex items-center gap-2">
        <span className="text-2xl">&#9203;</span> Proof of Patience
      </h2>

      <div className="bg-dark-card border border-dark-border rounded-phi p-fib-34 space-y-5">
        {/* Temporal Mass display */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-400">Your Temporal Mass</p>
          <p className="text-phi-xl font-bold text-gold font-mono">
            {temporalMass.toFixed(3)}x
          </p>
          <p className="text-sm text-gray-500">
            Holding for {Math.floor(holdingDays)} days
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>1.0x</span>
            <span>7.5x (max at 377 days)</span>
          </div>
          <div className="w-full h-3 bg-dark rounded-full overflow-hidden border border-dark-border">
            <div
              className="h-full bg-gold-gradient rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>0d</span>
            <span>5d</span>
            <span>21d</span>
            <span>55d</span>
            <span>144d</span>
            <span>377d</span>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-dark rounded-lg p-4 border border-dark-border/50 text-sm text-gray-400 leading-relaxed">
          <p className="text-gold-dark font-semibold mb-1">
            How Temporal Mass works
          </p>
          <p>
            Your temporal mass grows the longer you hold ARTS tokens without
            selling. It starts at <strong className="text-white">1.0x</strong>{" "}
            and can reach up to{" "}
            <strong className="text-white">7.5x</strong> after 377 days
            (Fibonacci F(14)). Temporal mass multiplies your governance voting
            power and staking rewards &mdash; rewarding conviction over
            speculation.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  Shared components                                                 */
/* ================================================================== */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-lg font-mono text-white mt-0.5">{value}</p>
    </div>
  );
}
