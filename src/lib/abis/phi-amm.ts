export const PHI_AMM_ABI = [
  "function swap(bool buyARTS, uint256 amountIn) returns (uint256 amountOut)",
  "function addLiquidity(uint256 artsAmount, uint256 pairedAmount) returns (uint256 lpMinted)",
  "function removeLiquidity(uint256 lpAmount) returns (uint256 artsOut, uint256 pairedOut)",
  "function getAmountOut(bool buyARTS, uint256 amountIn) view returns (uint256)",
  "function reserveARTS() view returns (uint256)",
  "function reservePaired() view returns (uint256)",
  "function totalLP() view returns (uint256)",
  "function lpBalance(address) view returns (uint256)",
  "event Swap(address indexed user, bool buyARTS, uint256 amountIn, uint256 amountOut, uint256 fee)",
] as const;
