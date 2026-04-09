"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useReadContract, useWriteContract } from "wagmi";
import { parseEther, formatEther } from "viem";
import { CONTRACTS } from "../../lib/contracts";

/* ------------------------------------------------------------------ */
/*  ABI fragments                                                     */
/* ------------------------------------------------------------------ */

const PHI_AMM_ABI = [
  {
    name: "swap",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tokenIn", type: "address" },
      { name: "amountIn", type: "uint256" },
      { name: "amountOutMin", type: "uint256" },
      { name: "to", type: "address" },
    ],
    outputs: [{ name: "amountOut", type: "uint256" }],
  },
  {
    name: "getAmountOut",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "tokenIn", type: "address" },
      { name: "amountIn", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getReserves",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "reserveARTS", type: "uint256" },
      { name: "reserveETH", type: "uint256" },
    ],
  },
  {
    name: "feeRate",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "totalLP",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
const SLIPPAGE_BPS = 50; // 0.5% default slippage

type Direction = "buy" | "sell";

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function SwapPage() {
  return (
    <main className="min-h-screen bg-dark text-white px-4 py-fib-34 max-w-2xl mx-auto space-y-fib-55">
      <h1 className="text-phi-xl font-bold text-gold text-center tracking-tight">
        PhiAMM Swap
      </h1>
      <p className="text-center text-gray-400 max-w-xl mx-auto">
        Swap between ARTS and ETH through the golden ratio AMM &mdash; where
        buying has less slippage than selling.
      </p>

      <SwapCard />
      <PoolStats />
    </main>
  );
}

/* ================================================================== */
/*  Swap Card                                                         */
/* ================================================================== */

function SwapCard() {
  const { address } = useAccount();
  const [direction, setDirection] = useState<Direction>("buy");
  const [inputAmount, setInputAmount] = useState("");

  const isBuying = direction === "buy";
  const tokenInAddress = isBuying ? ETH_ADDRESS : CONTRACTS.ARTS;
  const fromLabel = isBuying ? "ETH" : "ARTS";
  const toLabel = isBuying ? "ARTS" : "ETH";

  // Quote
  const { data: amountOut } = useReadContract({
    address: CONTRACTS.PhiAMM as `0x${string}`,
    abi: PHI_AMM_ABI,
    functionName: "getAmountOut",
    args: inputAmount
      ? [tokenInAddress as `0x${string}`, parseEther(inputAmount)]
      : undefined,
    query: { enabled: !!inputAmount && parseFloat(inputAmount) > 0 },
  });

  const outputDisplay = amountOut
    ? parseFloat(formatEther(amountOut)).toFixed(6)
    : "0.000000";

  // Slippage-adjusted min output
  const minOut = amountOut
    ? (amountOut * BigInt(10000 - SLIPPAGE_BPS)) / BigInt(10000)
    : BigInt(0);

  const { writeContract: swap, isPending } = useWriteContract();

  const handleSwap = () => {
    if (!inputAmount || !address) return;
    swap({
      address: CONTRACTS.PhiAMM as `0x${string}`,
      abi: PHI_AMM_ABI,
      functionName: "swap",
      args: [
        tokenInAddress as `0x${string}`,
        parseEther(inputAmount),
        minOut,
        address,
      ],
    });
  };

  const toggleDirection = () => {
    setDirection((d) => (d === "buy" ? "sell" : "buy"));
    setInputAmount("");
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-phi p-fib-34 space-y-5">
      {/* From */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          From ({fromLabel})
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="0"
            step="0.001"
            placeholder="0.00"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            className="flex-1 bg-dark border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold transition text-lg font-mono"
          />
          <span className="text-gold font-bold text-lg w-16 text-right">
            {fromLabel}
          </span>
        </div>
      </div>

      {/* Direction toggle */}
      <div className="flex justify-center">
        <button
          onClick={toggleDirection}
          className="w-10 h-10 rounded-full border border-dark-border bg-dark hover:border-gold text-gray-400 hover:text-gold transition flex items-center justify-center text-lg"
          aria-label="Switch direction"
        >
          &#8693;
        </button>
      </div>

      {/* To */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          To ({toLabel})
        </label>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-dark border border-dark-border rounded-lg px-4 py-3 text-lg font-mono text-white">
            {outputDisplay}
          </div>
          <span className="text-gold font-bold text-lg w-16 text-right">
            {toLabel}
          </span>
        </div>
      </div>

      {/* Asymmetry indicator */}
      <div className="bg-dark rounded-lg p-3 border border-dark-border/50 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gold">&#966;</span>
          <span className="text-gray-400">
            Asymmetric AMM:{" "}
            <span
              className={
                isBuying ? "text-green-400 font-medium" : "text-orange-400 font-medium"
              }
            >
              {isBuying
                ? "Buying has less slippage"
                : "Selling has higher slippage"}
            </span>
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          The PhiAMM applies golden ratio weighting: buy fees are lower than sell
          fees, encouraging accumulation over speculation.
        </p>
      </div>

      {/* Swap button */}
      <button
        onClick={handleSwap}
        disabled={isPending || !inputAmount || parseFloat(inputAmount || "0") <= 0}
        className="w-full py-4 bg-gold-gradient text-dark font-bold text-lg rounded-lg hover:opacity-90 disabled:opacity-40 transition"
      >
        {isPending
          ? "Swapping..."
          : `Swap ${fromLabel} for ${toLabel}`}
      </button>

      {/* Slippage info */}
      <p className="text-xs text-gray-600 text-center">
        Slippage tolerance: {SLIPPAGE_BPS / 100}%
      </p>
    </div>
  );
}

/* ================================================================== */
/*  Pool Stats                                                        */
/* ================================================================== */

function PoolStats() {
  const { data: reserves } = useReadContract({
    address: CONTRACTS.PhiAMM as `0x${string}`,
    abi: PHI_AMM_ABI,
    functionName: "getReserves",
  });

  const { data: feeRate } = useReadContract({
    address: CONTRACTS.PhiAMM as `0x${string}`,
    abi: PHI_AMM_ABI,
    functionName: "feeRate",
  });

  const { data: totalLP } = useReadContract({
    address: CONTRACTS.PhiAMM as `0x${string}`,
    abi: PHI_AMM_ABI,
    functionName: "totalLP",
  });

  const reserveARTS = reserves
    ? Number(formatEther(reserves[0])).toLocaleString()
    : "---";
  const reserveETH = reserves
    ? Number(formatEther(reserves[1])).toLocaleString()
    : "---";
  const feeDisplay = feeRate ? `${Number(feeRate) / 100}%` : "---";
  const lpDisplay = totalLP
    ? Number(formatEther(totalLP)).toLocaleString()
    : "---";

  return (
    <section className="space-y-4">
      <h2 className="text-phi-lg font-semibold text-gold-dark">Pool Stats</h2>

      <div className="bg-dark-card border border-dark-border rounded-phi p-fib-34">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              ARTS Reserve
            </p>
            <p className="text-lg font-mono text-white mt-1">{reserveARTS}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              ETH Reserve
            </p>
            <p className="text-lg font-mono text-white mt-1">{reserveETH}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Fee Rate
            </p>
            <p className="text-lg font-mono text-gold mt-1">{feeDisplay}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Total LP
            </p>
            <p className="text-lg font-mono text-white mt-1">{lpDisplay}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
