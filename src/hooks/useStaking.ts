import { useReadContract, useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACTS } from '../lib/contracts';
import { MATRYOSHKA_ABI } from '../lib/abis/matryoshka-staking';

export function useStaking() {
  const { address } = useAccount();

  const { data: totalStaked } = useReadContract({
    address: CONTRACTS.MatryoshkaStaking as `0x${string}`,
    abi: MATRYOSHKA_ABI,
    functionName: 'totalStaked',
  });

  const { data: stakeData } = useReadContract({
    address: CONTRACTS.MatryoshkaStaking as `0x${string}`,
    abi: MATRYOSHKA_ABI,
    functionName: 'stakes',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: pendingReward } = useReadContract({
    address: CONTRACTS.MatryoshkaStaking as `0x${string}`,
    abi: MATRYOSHKA_ABI,
    functionName: 'calculateReward',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const stake = stakeData as
    | [bigint, bigint, bigint, bigint, bigint, boolean]
    | undefined;

  return {
    totalStaked: totalStaked ? formatEther(totalStaked as bigint) : '0',
    userStake: stake
      ? {
          amount: formatEther(stake[0]),
          layer: Number(stake[1]),
          startTimestamp: Number(stake[2]),
          lockEnd: Number(stake[3]),
          rewardDebt: formatEther(stake[4]),
          active: stake[5],
        }
      : null,
    pendingReward: pendingReward
      ? formatEther(pendingReward as bigint)
      : '0',
  };
}
