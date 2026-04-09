export const PEER_REVIEW_DAO_ABI = [
  // Paper lifecycle
  "function submitPaper(bytes32 contentHash, string title, string doi) returns (uint256 paperId)",
  "function assignReviewers(uint256 paperId)",
  "function commitReview(uint256 paperId, bytes32 commitHash)",
  "function revealReview(uint256 paperId, uint8 score, string comment, bytes32 salt)",
  "function resolveReview(uint256 paperId)",
  "function claimReviewReward(uint256 paperId, uint256 reviewIdx)",
  "function expirePaper(uint256 paperId)",

  // Paper & review getters
  "function papers(uint256) view returns (address author, bytes32 contentHash, string title, string doi, uint256 submittedAt, uint256 publicationFee, uint8 status, uint256 reviewDeadline, uint256 revealDeadline)",
  "function getReview(uint256 paperId, uint256 reviewIdx) view returns (tuple review)",
  "function getReviews(uint256 paperId) view returns (tuple[])",
  "function getReviewCount(uint256 paperId) view returns (uint256 count)",
  "function getWeightedScore(uint256 paperId) view returns (uint256 weightedScore, uint256 revealedCount)",

  // State variables
  "function nextPaperId() view returns (uint256)",
  "function reviewWindow() view returns (uint256)",
  "function revealWindow() view returns (uint256)",
  "function minPublicationFee() view returns (uint256)",
  "function minReviewStake() view returns (uint256)",
  "function reviewersPerPaper() view returns (uint256)",
  "function rewardPool() view returns (uint256)",

  // Reviewer pool
  "function joinReviewerPool()",
  "function getReviewerPoolSize() view returns (uint256)",
  "function inReviewerPool(address) view returns (bool)",
  "function isAssignedReviewer(uint256, address) view returns (bool)",

  // Access control
  "function DEFAULT_ADMIN_ROLE() view returns (bytes32)",
  "function ADMIN_ROLE() view returns (bytes32)",
  "function ACCEPT_THRESHOLD() view returns (uint256)",
  "function REJECT_THRESHOLD() view returns (uint256)",
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function grantRole(bytes32 role, address account)",
  "function revokeRole(bytes32 role, address account)",
  "function supportsInterface(bytes4 interfaceId) view returns (bool)",

  // Events
  "event PaperSubmitted(uint256 indexed paperId, address indexed author, bytes32 contentHash)",
  "event ReviewerAssigned(uint256 indexed paperId, address indexed reviewer)",
  "event ReviewCommitted(uint256 indexed paperId, address indexed reviewer, bytes32 commitHash)",
  "event ReviewRevealed(uint256 indexed paperId, address indexed reviewer, uint8 score)",
  "event PaperResolved(uint256 indexed paperId, uint8 status, uint256 weightedScore)",
  "event ReviewRewarded(uint256 indexed paperId, address indexed reviewer, uint256 amount)",
  "event ReviewSlashed(uint256 indexed paperId, address indexed reviewer, uint256 amount)",
  "event RewardClaimed(uint256 indexed paperId, address indexed reviewer, uint256 amount)",
  "event ReviewerJoinedPool(address indexed reviewer)",
] as const;
