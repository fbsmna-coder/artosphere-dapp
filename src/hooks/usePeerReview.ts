import { useReadContract, useWriteContract } from 'wagmi';
import { CONTRACTS } from '../lib/contracts';
import { PEER_REVIEW_DAO_ABI } from '../lib/abis/peer-review-dao';

const peerReviewAddr = CONTRACTS.PeerReviewDAO as `0x${string}`;

/* ------------------------------------------------------------------ */
/*  Read hooks                                                         */
/* ------------------------------------------------------------------ */

export function useNextPaperId() {
  const { data } = useReadContract({
    address: peerReviewAddr,
    abi: PEER_REVIEW_DAO_ABI,
    functionName: 'nextPaperId',
  });

  return data !== undefined ? Number(data as bigint) : 0;
}

export function usePaper(paperId: number) {
  const { data } = useReadContract({
    address: peerReviewAddr,
    abi: PEER_REVIEW_DAO_ABI,
    functionName: 'papers',
    args: [BigInt(paperId)],
    query: { enabled: paperId >= 0 },
  });

  if (!data) return null;

  const [author, contentHash, title, doi, status, currentRound, roundStartedAt, publicationFee, totalSlashed, submittedAt] =
    data as [string, string, string, string, number, bigint, bigint, bigint, bigint, bigint];

  return {
    author: author as `0x${string}`,
    contentHash,
    title,
    doi,
    status,
    currentRound: Number(currentRound),
    roundStartedAt: Number(roundStartedAt),
    publicationFee,
    totalSlashed,
    submittedAt: Number(submittedAt),
  };
}

export function useRoundReviews(paperId: number, round: number) {
  const { data } = useReadContract({
    address: peerReviewAddr,
    abi: PEER_REVIEW_DAO_ABI,
    functionName: 'getRoundReviews',
    args: [BigInt(paperId), BigInt(round)],
    query: { enabled: paperId >= 0 && round >= 0 },
  });

  return (data as Array<{
    reviewer: string;
    commitHash: string;
    score: number;
    comment: string;
    revealed: boolean;
    stakeAmount: bigint;
    slashed: boolean;
    rewardAmount: bigint;
    claimed: boolean;
    killCondition: boolean;
  }>) ?? [];
}

export function useAssignedReviewers(paperId: number, round: number) {
  const { data } = useReadContract({
    address: peerReviewAddr,
    abi: PEER_REVIEW_DAO_ABI,
    functionName: 'getAssignedReviewers',
    args: [BigInt(paperId), BigInt(round)],
    query: { enabled: paperId >= 0 && round >= 0 },
  });

  return (data as string[]) ?? [];
}

export function useWeightedScore(paperId: number, round: number) {
  const { data } = useReadContract({
    address: peerReviewAddr,
    abi: PEER_REVIEW_DAO_ABI,
    functionName: 'getWeightedScore',
    args: [BigInt(paperId), BigInt(round)],
    query: { enabled: paperId >= 0 && round >= 0 },
  });

  if (!data) return { score: 0, revealedCount: 0 };
  const [score, revealedCount] = data as [bigint, bigint];
  return { score: Number(score), revealedCount: Number(revealedCount) };
}

export function useMinPublicationFee() {
  const { data } = useReadContract({
    address: peerReviewAddr,
    abi: PEER_REVIEW_DAO_ABI,
    functionName: 'MIN_PUBLICATION_FEE',
  });

  return (data as bigint) ?? BigInt(0);
}

export function useMinReviewerStake() {
  const { data } = useReadContract({
    address: peerReviewAddr,
    abi: PEER_REVIEW_DAO_ABI,
    functionName: 'MIN_REVIEWER_STAKE',
  });

  return (data as bigint) ?? BigInt(0);
}

export function useRoundDuration(round: number) {
  const { data } = useReadContract({
    address: peerReviewAddr,
    abi: PEER_REVIEW_DAO_ABI,
    functionName: 'roundDuration',
    args: [BigInt(round)],
  });

  return data !== undefined ? Number(data as bigint) : 0;
}

/* ------------------------------------------------------------------ */
/*  Write hooks                                                        */
/* ------------------------------------------------------------------ */

export function useSubmitPaper() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const submit = (contentHash: `0x${string}`, title: string, doi: string, publicationFee: bigint) => {
    writeContract({
      address: peerReviewAddr,
      abi: PEER_REVIEW_DAO_ABI,
      functionName: 'submitPaper',
      args: [contentHash, title, doi, publicationFee],
    });
  };

  return { submit, isPending, isSuccess, error };
}

export function useCommitReview() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const commit = (paperId: number, commitHash: `0x${string}`, stakeAmount: bigint) => {
    writeContract({
      address: peerReviewAddr,
      abi: PEER_REVIEW_DAO_ABI,
      functionName: 'commitReview',
      args: [BigInt(paperId), commitHash, stakeAmount],
    });
  };

  return { commit, isPending, isSuccess, error };
}

export function useRevealReview() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const reveal = (paperId: number, score: number, comment: string, salt: `0x${string}`, killCondition: boolean) => {
    writeContract({
      address: peerReviewAddr,
      abi: PEER_REVIEW_DAO_ABI,
      functionName: 'revealReview',
      args: [BigInt(paperId), score, comment, salt, killCondition],
    });
  };

  return { reveal, isPending, isSuccess, error };
}

export function useFinalizeRound() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const finalize = (paperId: number) => {
    writeContract({
      address: peerReviewAddr,
      abi: PEER_REVIEW_DAO_ABI,
      functionName: 'finalizeRound',
      args: [BigInt(paperId)],
    });
  };

  return { finalize, isPending, isSuccess, error };
}

export function useWithdrawPaper() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const withdraw = (paperId: number) => {
    writeContract({
      address: peerReviewAddr,
      abi: PEER_REVIEW_DAO_ABI,
      functionName: 'withdrawPaper',
      args: [BigInt(paperId)],
    });
  };

  return { withdraw, isPending, isSuccess, error };
}

export function useClaimReward() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const claim = (paperId: number, round: number) => {
    writeContract({
      address: peerReviewAddr,
      abi: PEER_REVIEW_DAO_ABI,
      functionName: 'claimReward',
      args: [BigInt(paperId), BigInt(round)],
    });
  };

  return { claim, isPending, isSuccess, error };
}
