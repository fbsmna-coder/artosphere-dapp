export const ARTS_ABI = [
  // ERC20 standard
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  // Artosphere specific
  "function temporalMass(address account) view returns (uint256)",
  "function spiralBurnRate() view returns (uint256)",
  "function BURN_FLOOR() view returns (uint256)",
  "function delegate(address delegatee)",
  "function getVotes(address account) view returns (uint256)",
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
] as const;
