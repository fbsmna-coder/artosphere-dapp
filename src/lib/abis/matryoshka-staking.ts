export const MATRYOSHKA_ABI = [
  "function stake(uint256 amount, uint256 layer)",
  "function unstake()",
  "function emergencyWithdraw()",
  "function calculateReward(address user) view returns (uint256)",
  "function totalMultiplier(uint256 layer) view returns (uint256)",
  "function totalStaked() view returns (uint256)",
  "function stakes(address) view returns (uint256 amount, uint256 layer, uint256 startTimestamp, uint256 lockEnd, uint256 rewardDebt, bool active)",
  "function LOCK_DAYS(uint256) view returns (uint256)",
  "event Staked(address indexed user, uint256 amount, uint256 layer, uint256 lockEnd)",
  "event Unstaked(address indexed user, uint256 amount, uint256 reward)",
] as const;
