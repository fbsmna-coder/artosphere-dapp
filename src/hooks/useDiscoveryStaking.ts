import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { CONTRACTS } from '../lib/contracts';
import { DISCOVERY_STAKING_ABI } from '../lib/abis/discovery-staking';
import { DISCOVERY_ORACLE_ABI } from '../lib/abis/discovery-oracle';

const stakingAddr = CONTRACTS.DiscoveryStaking as `0x${string}`;
const oracleAddr = CONTRACTS.DiscoveryOracle as `0x${string}`;

export function useDiscoveryPool(discoveryId: number) {
  const { data } = useReadContract({
    address: stakingAddr,
    abi: DISCOVERY_STAKING_ABI,
    functionName: 'getPool',
    args: [BigInt(discoveryId)],
  });

  if (!data) return null;

  const [confirmPool, refutePool, scienceWeight, resolved, winnerSide, frozen] = data as [
    bigint, bigint, bigint, boolean, number, boolean
  ];

  return {
    confirmPool: formatEther(confirmPool),
    refutePool: formatEther(refutePool),
    scienceWeight: formatEther(scienceWeight),
    resolved,
    winnerSide,
    frozen,
    confirmPoolRaw: confirmPool,
    refutePoolRaw: refutePool,
  };
}

export function useUserStake(discoveryId: number) {
  const { address } = useAccount();

  const { data } = useReadContract({
    address: stakingAddr,
    abi: DISCOVERY_STAKING_ABI,
    functionName: 'getStake',
    args: address ? [BigInt(discoveryId), address] : undefined,
    query: { enabled: !!address },
  });

  if (!data) return null;

  const stake = data as {
    amount: bigint;
    side: number;
    tier: number;
    stakedAt: bigint;
    lockEnd: bigint;
    claimed: boolean;
  };

  return {
    amount: formatEther(stake.amount),
    amountRaw: stake.amount,
    side: stake.side,
    tier: stake.tier,
    stakedAt: Number(stake.stakedAt),
    lockEnd: Number(stake.lockEnd),
    claimed: stake.claimed,
    hasStake: stake.amount > BigInt(0),
  };
}

export function useEstimateReward(discoveryId: number) {
  const { address } = useAccount();

  const { data } = useReadContract({
    address: stakingAddr,
    abi: DISCOVERY_STAKING_ABI,
    functionName: 'estimateReward',
    args: address ? [BigInt(discoveryId), address] : undefined,
    query: { enabled: !!address },
  });

  return data ? formatEther(data as bigint) : '0';
}

export function useTotalStaked() {
  const { data } = useReadContract({
    address: stakingAddr,
    abi: DISCOVERY_STAKING_ABI,
    functionName: 'totalStaked',
  });

  return data ? formatEther(data as bigint) : '0';
}

export function useOracleProposal(discoveryId: number) {
  const { data } = useReadContract({
    address: oracleAddr,
    abi: DISCOVERY_ORACLE_ABI,
    functionName: 'getProposal',
    args: [BigInt(discoveryId)],
  });

  if (!data) return null;

  const [outcome, state, proposer, proposedAt, votesFor, votesAgainst, cooldownEnd, quorumRequired] =
    data as [number, number, string, bigint, bigint, bigint, bigint, bigint];

  return {
    outcome,
    state,
    proposer,
    proposedAt: Number(proposedAt),
    votesFor: Number(votesFor),
    votesAgainst: Number(votesAgainst),
    cooldownEnd: Number(cooldownEnd),
    quorumRequired: Number(quorumRequired),
  };
}

export function useDiscoveryStakingActions() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const stakeOnDiscovery = (discoveryId: number, amount: string, side: number, tier: number) => {
    writeContract({
      address: stakingAddr,
      abi: DISCOVERY_STAKING_ABI,
      functionName: 'stakeOnDiscovery',
      args: [BigInt(discoveryId), parseEther(amount), side, BigInt(tier)],
    });
  };

  const claim = (discoveryId: number) => {
    writeContract({
      address: stakingAddr,
      abi: DISCOVERY_STAKING_ABI,
      functionName: 'claim',
      args: [BigInt(discoveryId)],
    });
  };

  const claimBatch = (discoveryIds: number[]) => {
    writeContract({
      address: stakingAddr,
      abi: DISCOVERY_STAKING_ABI,
      functionName: 'claimBatch',
      args: [discoveryIds.map(BigInt)],
    });
  };

  const emergencyWithdraw = (discoveryId: number) => {
    writeContract({
      address: stakingAddr,
      abi: DISCOVERY_STAKING_ABI,
      functionName: 'emergencyWithdraw',
      args: [BigInt(discoveryId)],
    });
  };

  return {
    stakeOnDiscovery,
    claim,
    claimBatch,
    emergencyWithdraw,
    isPending,
    isSuccess,
    error,
  };
}
