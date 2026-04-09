export const FALSIFICATION_MARKET_ABI = [
  // Write — hypothesis lifecycle
  "function createHypothesis(uint256 discoveryId, bytes32 contentHash, string title, uint256 stakeAmount) returns (uint256 hypothesisId)",
  "function submitFalsification(uint256 hypothesisId, bytes32 methodHash, string method, uint256 stakeAmount) returns (uint256 attemptId)",
  "function resolveAttempt(uint256 hypothesisId, uint256 attemptId, bool falsified)",
  "function claimReward(uint256 hypothesisId, uint256 attemptId)",
  "function retireHypothesis(uint256 hypothesisId)",

  // View — hypothesis data
  "function hypotheses(uint256) view returns (address author, uint256 discoveryId, bytes32 contentHash, string title, uint256 authorStake, uint256 totalFalsificationStake, uint256 survivals, uint256 createdAt, uint8 status)",
  "function attempts(uint256 hypothesisId, uint256 attemptId) view returns (address falsifier, bytes32 methodHash, string method, uint256 stake, uint256 submittedAt, uint8 status)",
  "function nextHypothesisId() view returns (uint256)",
  "function nextAttemptId(uint256 hypothesisId) view returns (uint256)",
  "function pendingAttemptCount(uint256 hypothesisId) view returns (uint256)",
  "function totalStaked() view returns (uint256)",
  "function rewards(uint256 hypothesisId, uint256 attemptId, address account) view returns (uint256 amount, bool claimed)",
  "function getHardnessMultiplier(uint256 hypothesisId) view returns (uint256 multiplier)",
  "function getHypothesis(uint256 hypothesisId) view returns (tuple(address author, uint256 discoveryId, bytes32 contentHash, string title, uint256 authorStake, uint256 totalFalsificationStake, uint256 survivals, uint256 createdAt, uint8 status))",
  "function getAttempt(uint256 hypothesisId, uint256 attemptId) view returns (tuple(address falsifier, bytes32 methodHash, string method, uint256 stake, uint256 submittedAt, uint8 status))",
  "function getReward(uint256 hypothesisId, uint256 attemptId, address account) view returns (uint256 amount, bool claimed)",
  "function getAttemptCount(uint256 hypothesisId) view returns (uint256 count)",
  "function estimateSurvivalReward(uint256 hypothesisId, uint256 attemptId) view returns (uint256 authorReward)",
  "function estimateFalsificationReward(uint256 hypothesisId, uint256 attemptId) view returns (uint256 falsifierReward)",

  // View — contract references
  "function artsToken() view returns (address)",
  "function discoveryNFT() view returns (address)",
  "function scientist() view returns (address)",
  "function treasury() view returns (address)",

  // Access control
  "function DEFAULT_ADMIN_ROLE() view returns (bytes32)",
  "function ADMIN_ROLE() view returns (bytes32)",
  "function ORACLE_ROLE() view returns (bytes32)",
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function grantRole(bytes32 role, address account)",
  "function revokeRole(bytes32 role, address account)",
  "function renounceRole(bytes32 role, address callerConfirmation)",
  "function getRoleAdmin(bytes32 role) view returns (bytes32)",

  // Events
  "event HypothesisCreated(uint256 indexed hypothesisId, address indexed author, uint256 indexed discoveryId, uint256 authorStake)",
  "event FalsificationSubmitted(uint256 indexed hypothesisId, uint256 indexed attemptId, address indexed falsifier, uint256 stake)",
  "event AttemptResolved(uint256 indexed hypothesisId, uint256 indexed attemptId, bool falsified, address beneficiary, uint256 reward)",
  "event HypothesisRetired(uint256 indexed hypothesisId, uint256 survivals)",
  "event HypothesisFalsified(uint256 indexed hypothesisId, uint256 indexed attemptId, address indexed falsifier)",
  "event RewardClaimed(uint256 indexed hypothesisId, uint256 indexed attemptId, address indexed claimer, uint256 amount)",
  "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)",
  "event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)",
] as const;
