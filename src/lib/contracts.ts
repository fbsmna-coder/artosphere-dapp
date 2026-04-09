export const CONTRACTS = {
  // === Core Protocol (Base Mainnet, deployed 2026-04-09) ===
  ARTS: "0x1C11133D4dDa9D85a6696B020b0c48e2c24Ed0bf",
  PhiStaking: "0x37ab9c369d3bdf428d3081f54e570a63f4bcd6a4",
  MatryoshkaStaking: "0x25dda63461dfbd35228fcfbe89f1e8092332bc22",
  GoldenMirror: "0xdb212d6500d2a243c6636f73cea982a961b9b9ca",
  PhiAMM: "0xf32c97846963c335eb78969c8c732945edc4e575",
  ArtosphereQuests: "0x51816178a7fb3fe8be3934d302fc2109d9781770",
  PhiCertificate: "0xb56ce7f132d6c1dc32f42a1e70260b95bc026f94",
  PhiGovernor: "0xae286dca8e8bb431dbea0049f9ee7dad5f642680",
  PhiVesting: "0xc728062a36b2764d8022b9afddf498aed44538bf",
  NashFee: "0xb11e81168f97b6241cb037d9d02b282879ec3e52",
  ZeckendorfTreasury: "0x250161bF42227171172e847B43623e9a83513b55",
  FibonacciFusion: "0x5379561543Ef9a33a167C47F7A84365Cd88cB858",
  ConvictionNFT: "0x1D4E49E6E21BCD469b609428Cc6813eE93EB7b00",
  TimelockController: "0x9ab3A97a2F1bf026C55cEF439D92C5C8D5C30bFe",
  // === Discovery NFTs (Base Mainnet, 13 soulbound NFTs) ===
  ArtosphereDiscovery: "0xA345C41e74Afc16f9071C0EAa5Ac71b0BDfe1D49",
  // === Discovery Staking DeSci Platform (Base Mainnet) ===
  DiscoveryOracle: "0xd0f23765Fe50b59f539fF695B17aF5b23D4AcBE0",
  DiscoveryStaking: "0x3Fc4d3466743e0c068797D64A91EF7A8826a19e2",
  ResearcherRegistry: "0x295410735a0d9f68850a94b97a43fff7a5961cc9",
  // === Killer Features (Base Mainnet, deployed 2026-04-09) ===
  SpectralNFT: "0xBCf0128AA0b2aee04D537D9f93D7f73d32f10AD9",
  ReviewRewards: "0xe525A235C98fE32348c02A4EAa319B71ec5887C1",
  PeerReviewDAO: "0xE75F7B805e149F73C2D68630E34CD5D441928623",
  FalsificationMarket: "0x311E93f50aaDa3bF93061080024c54bd6F66701b",
  PhiCoherence: "0x78520663798B1efD24058C6452BfF4136A8CDf75",
  // === Safety & Upgrades ===
  KillSwitch: "0x027092681c118Fb0cC314f7F3Cb42787C882D927",
  FibonacciFusionV2: "0x1066f1ba1bf26af995c2592e648de98b8b9e1b09",
  GnosisSafe: "0x75ba1367c9b2b750a1751dd527902e0f1d67a8fb",
} as const;

export const CHAIN_ID = 8453; // Base Mainnet
export const RPC_URL = "https://mainnet.base.org";
export const BLOCK_EXPLORER = "https://basescan.org";
