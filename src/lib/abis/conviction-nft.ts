export const CONVICTION_NFT_ABI = [
  // ERC721 standard
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function totalSupply() view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",

  // Conviction-specific
  "function mint(address to, uint256 discoveryId, uint8 side, uint256 amount)",
  "function getConviction(uint256 tokenId) view returns (tuple(uint256 discoveryId, uint8 side, uint256 amount, uint256 mintedAt))",
  "function convictionsByDiscovery(uint256 discoveryId) view returns (uint256[])",

  // Soulbound (non-transferable)
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event ConvictionMinted(uint256 indexed tokenId, address indexed to, uint256 indexed discoveryId, uint8 side, uint256 amount)",
] as const;
