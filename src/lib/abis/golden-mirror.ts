export const GOLDEN_MIRROR_ABI = [
  "function mirrorStake(uint256 amount)",
  "function mirrorUnstake()",
  "function gArtsValue(address user) view returns (uint256)",
  "function totalArtsLocked() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function mirrorStakes(address) view returns (uint256 artsDeposited, uint256 gArtsMinted, uint256 startTimestamp, bool active)",
  "event MirrorStaked(address indexed user, uint256 artsIn, uint256 gArtsOut)",
] as const;
