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

  const [author, contentHash, title, doi, submittedAt, publicationFee, status, reviewDeadline, revealDeadline] =
    data as [string, string, string, string, bigint, bigint, number, bigint, bigint];

  return {
    author: author as `0x${string}`,
    contentHash,
    title,
    doi,
    submittedAt: Number(submittedAt),
    publicationFee,
    status,
    reviewDeadline: Number(reviewDeadline),
    revealDeadline: Number(revealDeadline),
  };
}

export function useReviewCount(paperId: number) {
  const { data } = useReadContract({
    address: peerReviewAddr,
    abi: PEER_REVIEW_DAO_ABI,
    functionName: 'getReviewCount',
    args: [BigInt(paperId)],
    query: { enabled: paperId >= 0 },
  });

  return data !== undefined ? Number(data as bigint) : 0;
}

export function useReviewWindow() {
  const { data } = useReadContract({
    address: peerReviewAddr,
    abi: PEER_REVIEW_DAO_ABI,
    functionName: 'reviewWindow',
  });

  return data !== undefined ? Number(data as bigint) : 0;
}

export function useRevealWindow() {
  const { data } = useReadContract({
    address: peerReviewAddr,
    abi: PEER_REVIEW_DAO_ABI,
    functionName: 'revealWindow',
  });

  return data !== undefined ? Number(data as bigint) : 0;
}

/* ------------------------------------------------------------------ */
/*  Write hooks                                                        */
/* ------------------------------------------------------------------ */

export function useSubmitPaper() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const submit = (contentHash: `0x${string}`, title: string, doi: string) => {
    writeContract({
      address: peerReviewAddr,
      abi: PEER_REVIEW_DAO_ABI,
      functionName: 'submitPaper',
      args: [contentHash, title, doi],
    });
  };

  return { submit, isPending, isSuccess, error };
}

export function useCommitReview() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const commit = (paperId: number, commitHash: `0x${string}`) => {
    writeContract({
      address: peerReviewAddr,
      abi: PEER_REVIEW_DAO_ABI,
      functionName: 'commitReview',
      args: [BigInt(paperId), commitHash],
    });
  };

  return { commit, isPending, isSuccess, error };
}

export function useRevealReview() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const reveal = (paperId: number, score: number, comment: string, salt: `0x${string}`) => {
    writeContract({
      address: peerReviewAddr,
      abi: PEER_REVIEW_DAO_ABI,
      functionName: 'revealReview',
      args: [BigInt(paperId), score, comment, salt],
    });
  };

  return { reveal, isPending, isSuccess, error };
}
