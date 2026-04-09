export const FIBONACCI_FUSION_ABI = [
  // Core fusion
  "function fuse(uint256[] tokenIds) returns (uint256 fusedTokenId)",
  "function defuse(uint256 fusedTokenId) returns (uint256[] originalTokenIds)",

  // View
  "function getFusion(uint256 fusedTokenId) view returns (tuple(uint256[] componentIds, uint256 fusedAt, uint256 fibonacciLevel, uint256 bonusMultiplier))",
  "function fibonacciLevel(uint256 count) view returns (uint256)",
  "function bonusMultiplier(uint256 level) view returns (uint256)",
  "function isFused(uint256 tokenId) view returns (bool)",
  "function fusionCount(address owner) view returns (uint256)",

  // Events
  "event Fused(uint256 indexed fusedTokenId, address indexed owner, uint256[] componentIds, uint256 fibonacciLevel)",
  "event Defused(uint256 indexed fusedTokenId, address indexed owner, uint256[] returnedIds)",
] as const;
