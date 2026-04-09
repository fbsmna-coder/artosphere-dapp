import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACTS } from '../lib/contracts';
import { SPECTRAL_NFT_ABI } from '../lib/abis/spectral-nft';

const spectralAddr = CONTRACTS.SpectralNFT as `0x${string}`;

export function useTotalSpectralSupply() {
  const { data } = useReadContract({
    address: spectralAddr,
    abi: SPECTRAL_NFT_ABI,
    functionName: 'totalSupply',
  });

  return data ? Number(data as bigint) : 0;
}

export function useSpectralTokenByIndex(index: number) {
  const { data } = useReadContract({
    address: spectralAddr,
    abi: SPECTRAL_NFT_ABI,
    functionName: 'tokenByIndex',
    args: [BigInt(index)],
    query: { enabled: index >= 0 },
  });

  return data !== undefined ? Number(data as bigint) : null;
}

export function useSpectralConfidence(tokenId: number) {
  const { data } = useReadContract({
    address: spectralAddr,
    abi: SPECTRAL_NFT_ABI,
    functionName: 'getConfidence',
    args: [BigInt(tokenId)],
    query: { enabled: tokenId >= 0 },
  });

  return data !== undefined ? Number(data as bigint) : null;
}

export function useSpectralStakingMultiplier(tokenId: number) {
  const { data } = useReadContract({
    address: spectralAddr,
    abi: SPECTRAL_NFT_ABI,
    functionName: 'getStakingMultiplier',
    args: [BigInt(tokenId)],
    query: { enabled: tokenId >= 0 },
  });

  return data !== undefined ? Number(data as bigint) : null;
}

export function useSpectralStage(tokenId: number) {
  const { data } = useReadContract({
    address: spectralAddr,
    abi: SPECTRAL_NFT_ABI,
    functionName: 'getStage',
    args: [BigInt(tokenId)],
    query: { enabled: tokenId >= 0 },
  });

  if (!data) return null;

  const [stage, color] = data as [string, string];
  return { stage, color };
}

export function useSpectralState(tokenId: number) {
  const { data } = useReadContract({
    address: spectralAddr,
    abi: SPECTRAL_NFT_ABI,
    functionName: 'spectralStates',
    args: [BigInt(tokenId)],
    query: { enabled: tokenId >= 0 },
  });

  if (!data) return null;

  const [discoveryId, c0, cInf, tau, t0, mintAmount, title, formula] = data as [
    bigint, bigint, bigint, bigint, bigint, bigint, string, string
  ];

  return {
    discoveryId: Number(discoveryId),
    c0: formatEther(c0),
    cInf: formatEther(cInf),
    tau: Number(tau),
    t0: Number(t0),
    mintAmount: formatEther(mintAmount),
    title,
    formula,
  };
}

export function useUserSpectralTokens() {
  const { address } = useAccount();

  const { data } = useReadContract({
    address: spectralAddr,
    abi: SPECTRAL_NFT_ABI,
    functionName: 'tokensOfOwner',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return data ? (data as bigint[]).map(Number) : [];
}

export function useHasMinterRole() {
  const { address } = useAccount();

  const { data: minterRole } = useReadContract({
    address: spectralAddr,
    abi: SPECTRAL_NFT_ABI,
    functionName: 'MINTER_ROLE',
  });

  const { data: hasRole } = useReadContract({
    address: spectralAddr,
    abi: SPECTRAL_NFT_ABI,
    functionName: 'hasRole',
    args: address && minterRole ? [minterRole as `0x${string}`, address] : undefined,
    query: { enabled: !!address && !!minterRole },
  });

  return !!hasRole;
}

export function useSpectralMint() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const mint = (to: `0x${string}`, discoveryId: number, title: string, formula: string, mintAmount: string) => {
    writeContract({
      address: spectralAddr,
      abi: SPECTRAL_NFT_ABI,
      functionName: 'mint',
      args: [to, BigInt(discoveryId), title, formula, BigInt(mintAmount)],
    });
  };

  return { mint, isPending, isSuccess, error };
}
