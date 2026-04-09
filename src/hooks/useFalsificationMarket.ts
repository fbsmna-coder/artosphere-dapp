import { useReadContract, useWriteContract } from 'wagmi';
import { formatEther, parseEther, keccak256, toBytes } from 'viem';
import { CONTRACTS } from '../lib/contracts';
import { FALSIFICATION_MARKET_ABI } from '../lib/abis/falsification-market';

const marketAddr = CONTRACTS.FalsificationMarket as `0x${string}`;

/* ------------------------------------------------------------------ */
/*  Read hooks                                                         */
/* ------------------------------------------------------------------ */

export function useNextHypothesisId() {
  const { data } = useReadContract({
    address: marketAddr,
    abi: FALSIFICATION_MARKET_ABI,
    functionName: 'nextHypothesisId',
  });

  return data !== undefined ? Number(data as bigint) : 0;
}

export function useHypothesis(hypothesisId: number) {
  const { data } = useReadContract({
    address: marketAddr,
    abi: FALSIFICATION_MARKET_ABI,
    functionName: 'getHypothesis',
    args: [BigInt(hypothesisId)],
    query: { enabled: hypothesisId >= 0 },
  });

  if (!data) return null;

  const [author, discoveryId, contentHash, title, authorStake, totalFalsificationStake, survivals, createdAt, status] =
    data as [string, bigint, string, string, bigint, bigint, bigint, bigint, number];

  return {
    author,
    discoveryId: Number(discoveryId),
    contentHash,
    title,
    authorStake: formatEther(authorStake),
    authorStakeRaw: authorStake,
    totalFalsificationStake: formatEther(totalFalsificationStake),
    totalFalsificationStakeRaw: totalFalsificationStake,
    survivals: Number(survivals),
    createdAt: Number(createdAt),
    status, // 0 = ACTIVE, 1 = FALSIFIED, 2 = RETIRED
  };
}

export function useAttempt(hypothesisId: number, attemptId: number) {
  const { data } = useReadContract({
    address: marketAddr,
    abi: FALSIFICATION_MARKET_ABI,
    functionName: 'getAttempt',
    args: [BigInt(hypothesisId), BigInt(attemptId)],
    query: { enabled: hypothesisId >= 0 && attemptId >= 0 },
  });

  if (!data) return null;

  const [falsifier, methodHash, method, stake, submittedAt, status] =
    data as [string, string, string, bigint, bigint, number];

  return {
    falsifier,
    methodHash,
    method,
    stake: formatEther(stake),
    stakeRaw: stake,
    submittedAt: Number(submittedAt),
    status, // 0 = PENDING, 1 = RESOLVED_SURVIVED, 2 = RESOLVED_FALSIFIED, 3 = EXPIRED
  };
}

export function useHardnessMultiplier(hypothesisId: number) {
  const { data } = useReadContract({
    address: marketAddr,
    abi: FALSIFICATION_MARKET_ABI,
    functionName: 'getHardnessMultiplier',
    args: [BigInt(hypothesisId)],
    query: { enabled: hypothesisId >= 0 },
  });

  return data !== undefined ? Number(data as bigint) / 1e18 : 1;
}

export function useAttemptCount(hypothesisId: number) {
  const { data } = useReadContract({
    address: marketAddr,
    abi: FALSIFICATION_MARKET_ABI,
    functionName: 'getAttemptCount',
    args: [BigInt(hypothesisId)],
    query: { enabled: hypothesisId >= 0 },
  });

  return data !== undefined ? Number(data as bigint) : 0;
}

export function useTotalStaked() {
  const { data } = useReadContract({
    address: marketAddr,
    abi: FALSIFICATION_MARKET_ABI,
    functionName: 'totalStaked',
  });

  return data !== undefined ? formatEther(data as bigint) : '0';
}

export function useReward(hypothesisId: number, attemptId: number, account: `0x${string}` | undefined) {
  const { data } = useReadContract({
    address: marketAddr,
    abi: FALSIFICATION_MARKET_ABI,
    functionName: 'getReward',
    args: account ? [BigInt(hypothesisId), BigInt(attemptId), account] : undefined,
    query: { enabled: hypothesisId >= 0 && attemptId >= 0 && !!account },
  });

  if (!data) return { amount: '0', claimed: false };

  const [amount, claimed] = data as [bigint, boolean];
  return { amount: formatEther(amount), claimed };
}

export function useEstimateSurvivalReward(hypothesisId: number, attemptId: number) {
  const { data } = useReadContract({
    address: marketAddr,
    abi: FALSIFICATION_MARKET_ABI,
    functionName: 'estimateSurvivalReward',
    args: [BigInt(hypothesisId), BigInt(attemptId)],
    query: { enabled: hypothesisId >= 0 && attemptId >= 0 },
  });

  return data !== undefined ? formatEther(data as bigint) : '0';
}

export function useEstimateFalsificationReward(hypothesisId: number, attemptId: number) {
  const { data } = useReadContract({
    address: marketAddr,
    abi: FALSIFICATION_MARKET_ABI,
    functionName: 'estimateFalsificationReward',
    args: [BigInt(hypothesisId), BigInt(attemptId)],
    query: { enabled: hypothesisId >= 0 && attemptId >= 0 },
  });

  return data !== undefined ? formatEther(data as bigint) : '0';
}

/* ------------------------------------------------------------------ */
/*  Write hooks                                                        */
/* ------------------------------------------------------------------ */

export function useFalsificationActions() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const createHypothesis = (discoveryId: number, title: string, stakeAmount: string) => {
    const contentHash = keccak256(toBytes(title));
    writeContract({
      address: marketAddr,
      abi: FALSIFICATION_MARKET_ABI,
      functionName: 'createHypothesis',
      args: [BigInt(discoveryId), contentHash, title, parseEther(stakeAmount)],
    });
  };

  const submitFalsification = (hypothesisId: number, method: string, stakeAmount: string) => {
    const methodHash = keccak256(toBytes(method));
    writeContract({
      address: marketAddr,
      abi: FALSIFICATION_MARKET_ABI,
      functionName: 'submitFalsification',
      args: [BigInt(hypothesisId), methodHash, method, parseEther(stakeAmount)],
    });
  };

  const resolveAttempt = (hypothesisId: number, attemptId: number, falsified: boolean) => {
    writeContract({
      address: marketAddr,
      abi: FALSIFICATION_MARKET_ABI,
      functionName: 'resolveAttempt',
      args: [BigInt(hypothesisId), BigInt(attemptId), falsified],
    });
  };

  const claimReward = (hypothesisId: number, attemptId: number) => {
    writeContract({
      address: marketAddr,
      abi: FALSIFICATION_MARKET_ABI,
      functionName: 'claimReward',
      args: [BigInt(hypothesisId), BigInt(attemptId)],
    });
  };

  const retireHypothesis = (hypothesisId: number) => {
    writeContract({
      address: marketAddr,
      abi: FALSIFICATION_MARKET_ABI,
      functionName: 'retireHypothesis',
      args: [BigInt(hypothesisId)],
    });
  };

  return {
    createHypothesis,
    submitFalsification,
    resolveAttempt,
    claimReward,
    retireHypothesis,
    isPending,
    isSuccess,
    error,
  };
}
