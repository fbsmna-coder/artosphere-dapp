export const DISCOVERY_STAKING_ABI = [
  // Core staking
  "function stakeOnDiscovery(uint256 discoveryId, uint256 amount, uint8 side, uint256 tier)",
  "function claim(uint256 discoveryId)",
  "function claimBatch(uint256[] discoveryIds)",
  "function emergencyWithdraw(uint256 discoveryId)",
  "function withdrawExpired(uint256 discoveryId)",

  // View - pool data
  "function getPool(uint256 discoveryId) view returns (uint256 confirmPool, uint256 refutePool, uint256 scienceWeight, bool resolved, uint8 winnerSide, bool frozen)",
  "function getStake(uint256 discoveryId, address staker) view returns (tuple(uint256 amount, uint8 side, uint256 tier, uint256 stakedAt, uint256 lockEnd, bool claimed))",
  "function estimateReward(uint256 discoveryId, address staker) view returns (uint256)",
  "function tierMultiplier(uint256 tier) view returns (uint256)",
  "function isExpired(uint256 discoveryId) view returns (bool)",
  "function totalStaked() view returns (uint256)",
  "function scientist() view returns (address)",
  "function treasury() view returns (address)",

  // Constants
  "function SIDE_CONFIRM() view returns (uint8)",
  "function SIDE_REFUTE() view returns (uint8)",
  "function NUM_TIERS() view returns (uint256)",

  // Events
  "event Staked(uint256 indexed discoveryId, address indexed staker, uint8 side, uint256 amount, uint256 tier)",
  "event Resolved(uint256 indexed discoveryId, uint8 winnerSide, uint256 losingPool, uint256 burned, uint256 winnerRewards, uint256 scientistCut, uint256 treasuryCut)",
  "event Claimed(uint256 indexed discoveryId, address indexed staker, uint256 reward)",
  "event EmergencyWithdraw(uint256 indexed discoveryId, address indexed staker, uint256 netAmount, uint256 penalty)",
  "event ExpirationWithdraw(uint256 indexed discoveryId, address indexed staker, uint256 amount)",
  "event StakingFrozen(uint256 indexed discoveryId)",
  "event StakingUnfrozen(uint256 indexed discoveryId)",
  "event ScienceWeightUpdated(uint256 indexed discoveryId, uint256 newWeight)",
] as const;
