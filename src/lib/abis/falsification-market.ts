export const FALSIFICATION_MARKET_ABI = [
  // Write — hypothesis lifecycle
  "function createHypothesis(uint256 discoveryId, bytes32 contentHash, string title, uint256 stakeAmount) returns (uint256 hypothesisId)",
  "function submitFalsification(uint256 hypothesisId, bytes32 methodHash, string method, uint256 stakeAmount) returns (uint256 attemptId)",
  "function resolveAttempt(uint256 hypothesisId, uint256 attemptId, bool falsified)",
  "function claimReward(uint256 hypothesisId, uint256 attemptId)",
  "function retireHypothesis(uint256 hypothesisId)",

  // View — hypothesis data
  "function hypotheses(uint256) view returns (address author, uint256 discoveryId, bytes32 contentHash, string title, uint256 authorStake, uint256 totalFalsificationStake, uint256 survivals, uint256 createdAt, uint8 status)",
  "function falsificationAttempts(uint256 hypothesisId, uint256 attemptId) view returns (address challenger, bytes32 methodHash, string method, uint256 stake, uint8 status)",
  "function nextHypothesisId() view returns (uint256)",
  "function getHardnessMultiplier(uint256 hypothesisId) view returns (uint256 multiplier)",
] as const;
