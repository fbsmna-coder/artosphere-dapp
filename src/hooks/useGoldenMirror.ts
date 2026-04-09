import { useReadContract, useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACTS } from '../lib/contracts';
import { GOLDEN_MIRROR_ABI } from '../lib/abis/golden-mirror';

export function useGoldenMirror() {
  const { address } = useAccount();

  const { data: totalArtsLocked } = useReadContract({
    address: CONTRACTS.GoldenMirror as `0x${string}`,
    abi: GOLDEN_MIRROR_ABI,
    functionName: 'totalArtsLocked',
  });

  const { data: gArtsBalance } = useReadContract({
    address: CONTRACTS.GoldenMirror as `0x${string}`,
    abi: GOLDEN_MIRROR_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: gArtsValue } = useReadContract({
    address: CONTRACTS.GoldenMirror as `0x${string}`,
    abi: GOLDEN_MIRROR_ABI,
    functionName: 'gArtsValue',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: mirrorStakeData } = useReadContract({
    address: CONTRACTS.GoldenMirror as `0x${string}`,
    abi: GOLDEN_MIRROR_ABI,
    functionName: 'mirrorStakes',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const mirrorStake = mirrorStakeData as
    | [bigint, bigint, bigint, boolean]
    | undefined;

  return {
    totalArtsLocked: totalArtsLocked
      ? formatEther(totalArtsLocked as bigint)
      : '0',
    gArtsBalance: gArtsBalance
      ? formatEther(gArtsBalance as bigint)
      : '0',
    gArtsValue: gArtsValue
      ? formatEther(gArtsValue as bigint)
      : '0',
    mirrorStake: mirrorStake
      ? {
          artsDeposited: formatEther(mirrorStake[0]),
          gArtsMinted: formatEther(mirrorStake[1]),
          startTimestamp: Number(mirrorStake[2]),
          active: mirrorStake[3],
        }
      : null,
  };
}
