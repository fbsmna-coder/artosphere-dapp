export const RESEARCHER_REGISTRY_ABI = [
  // Registration
  "function register(string orcid, string name, string institution)",
  "function updateProfile(string name, string institution)",

  // View
  "function getResearcher(address) view returns (tuple(string orcid, string name, string institution, bool orcidVerified, uint256 correctPredictions, uint256 totalPredictions, uint256 totalStaked, uint256 totalEarned, uint256 registeredAt))",
  "function isRegistered(address) view returns (bool)",
  "function getTier(address) view returns (uint256)",
  "function getTierName(address) view returns (string)",
  "function winRate(address) view returns (uint256)",
  "function totalResearchers() view returns (uint256)",
  "function getAddressByOrcid(string orcid) view returns (address)",

  // Events
  "event ResearcherRegistered(address indexed researcher, string orcid, string name)",
  "event OrcidVerified(address indexed researcher, string orcid)",
  "event ReputationUpdated(address indexed researcher, uint256 correctPredictions, uint256 totalPredictions, uint256 newTier)",
] as const;
