import { useReadContract, useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACTS } from '../lib/contracts';
import { ARTS_ABI } from '../lib/abis/arts-token';

export function useArtsToken() {
  const { address } = useAccount();

  const { data: totalSupply } = useReadContract({
    address: CONTRACTS.ARTS as `0x${string}`,
    abi: ARTS_ABI,
    functionName: 'totalSupply',
  });

  const { data: balance } = useReadContract({
    address: CONTRACTS.ARTS as `0x${string}`,
    abi: ARTS_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: temporalMass } = useReadContract({
    address: CONTRACTS.ARTS as `0x${string}`,
    abi: ARTS_ABI,
    functionName: 'temporalMass',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: burnRate } = useReadContract({
    address: CONTRACTS.ARTS as `0x${string}`,
    abi: ARTS_ABI,
    functionName: 'spiralBurnRate',
  });

  const { data: burnFloor } = useReadContract({
    address: CONTRACTS.ARTS as `0x${string}`,
    abi: ARTS_ABI,
    functionName: 'BURN_FLOOR',
  });

  return {
    totalSupply: totalSupply ? formatEther(totalSupply as bigint) : '0',
    balance: balance ? formatEther(balance as bigint) : '0',
    temporalMass: temporalMass ? formatEther(temporalMass as bigint) : '1.0',
    burnRate: burnRate ? formatEther(burnRate as bigint) : '0',
    burnFloor: burnFloor ? formatEther(burnFloor as bigint) : '0',
  };
}
