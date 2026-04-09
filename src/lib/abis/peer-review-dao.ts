export const PEER_REVIEW_DAO_ABI = [
  // Paper lifecycle
  "function submitPaper(bytes32 contentHash, string title, string doi, uint256 publicationFee) returns (uint256 paperId)",
  "function assignReviewer(uint256 paperId, address reviewer)",
  "function startReviewRound(uint256 paperId)",
  "function commitReview(uint256 paperId, bytes32 commitHash, uint256 stakeAmount)",
  "function revealReview(uint256 paperId, uint8 score, string comment, bytes32 salt, bool killCondition)",
  "function finalizeRound(uint256 paperId)",
  "function withdrawPaper(uint256 paperId)",
  "function claimReward(uint256 paperId, uint256 round)",

  // Paper & review getters
  "function papers(uint256) view returns (address author, bytes32 contentHash, string title, string doi, uint8 status, uint256 currentRound, uint256 roundStartedAt, uint256 publicationFee, uint256 totalSlashed, uint256 submittedAt)",
  "function getRoundReviews(uint256 paperId, uint256 round) view returns (tuple(address reviewer, bytes32 commitHash, uint8 score, string comment, bool revealed, uint256 stakeAmount, bool slashed, uint256 rewardAmount, bool claimed, bool killCondition)[])",
  "function getAssignedReviewers(uint256 paperId, uint256 round) view returns (address[])",
  "function getWeightedScore(uint256 paperId, uint256 round) view returns (uint256 score, uint256 revealedCount)",

  // State variables
  "function nextPaperId() view returns (uint256)",
  "function artsToken() view returns (address)",
  "function registry() view returns (address)",
  "function rewardsContract() view returns (address)",
  "function treasury() view returns (address)",
  "function reviewerIndex(uint256, uint256, address) view returns (uint256)",
  "function isAssigned(uint256, uint256, address) view returns (bool)",

  // Constants
  "function ROUND_0_DURATION() view returns (uint256)",
  "function ROUND_1_DURATION() view returns (uint256)",
  "function ROUND_2_DURATION() view returns (uint256)",
  "function ROUND_3_DURATION() view returns (uint256)",
  "function MAX_ROUNDS() view returns (uint256)",
  "function MIN_REVIEWER_STAKE() view returns (uint256)",
  "function MIN_PUBLICATION_FEE() view returns (uint256)",
  "function SLASH_WAD() view returns (uint256)",
  "function MIN_REVIEW_TIER() view returns (uint256)",
  "function ACCEPT_THRESHOLD() view returns (uint256)",
  "function REJECT_THRESHOLD() view returns (uint256)",
  "function goldenQuorum(uint256 numReviewers) pure returns (uint256)",
  "function roundDuration(uint256 round) pure returns (uint256)",

  // Access control
  "function DEFAULT_ADMIN_ROLE() view returns (bytes32)",
  "function SUBMIT_ROLE() view returns (bytes32)",
  "function REVIEW_ROLE() view returns (bytes32)",
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function grantRole(bytes32 role, address account)",
  "function revokeRole(bytes32 role, address account)",
  "function renounceRole(bytes32 role, address callerConfirmation)",
  "function getRoleAdmin(bytes32 role) view returns (bytes32)",
  "function supportsInterface(bytes4 interfaceId) view returns (bool)",

  // Events
  "event PaperSubmitted(uint256 indexed paperId, address indexed author, bytes32 contentHash, string title)",
  "event ReviewRoundStarted(uint256 indexed paperId, uint256 round, uint256 duration, uint256 assignedCount)",
  "event ReviewerAssigned(uint256 indexed paperId, uint256 round, address indexed reviewer)",
  "event ReviewCommitted(uint256 indexed paperId, uint256 round, address indexed reviewer, bytes32 commitHash)",
  "event ReviewRevealed(uint256 indexed paperId, uint256 round, address indexed reviewer, uint8 score, bool killCondition)",
  "event RoundFinalized(uint256 indexed paperId, uint256 round, uint256 weightedScore, uint256 slashedTotal)",
  "event ReviewerSlashed(uint256 indexed paperId, uint256 round, address indexed reviewer, uint256 slashAmount)",
  "event PaperAccepted(uint256 indexed paperId, uint256 finalRound)",
  "event PaperRejected(uint256 indexed paperId, uint256 finalRound)",
  "event PaperWithdrawn(uint256 indexed paperId)",
  "event RewardClaimed(uint256 indexed paperId, uint256 round, address indexed reviewer, uint256 amount)",
  "event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)",
  "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)",
  "event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)",
] as const;
