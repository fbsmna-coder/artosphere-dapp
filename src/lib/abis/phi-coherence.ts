export const PHI_COHERENCE_ABI = [
  // Admin — contract registration
  "function registerContract(address contractAddr, uint8 level)",

  // Core — cascade propagation
  "function propagate(uint256 magnitude, bytes32 eventType)",

  // View — cascade data
  "function getDampedEffect(address contractAddr, uint256 eventIndex) view returns (uint256 dampedEffect)",
  "function getTotalCascadeEffect(uint256 eventIndex) view returns (uint256 totalEffect)",
  "function getRecentCascades(uint256 count) view returns (tuple(address source, uint256 magnitude, uint256 dampedMagnitude, uint8 sourceLevel, uint256 timestamp, bytes32 eventType)[])",
  "function getCascadeCount() view returns (uint256)",
  "function cascadeLog(uint256 eventIndex) view returns (tuple(address source, uint256 magnitude, uint256 dampedMagnitude, uint8 sourceLevel, uint256 timestamp, bytes32 eventType))",
  "function getLevelContractCount(uint8 level) view returns (uint256)",
  "function getContractsAtLevel(uint8 level) view returns (address[])",

  // View — contract state
  "function contractLevel(address) view returns (uint8)",
  "function registeredContracts(address) view returns (bool)",
  "function cascadeLogHead() view returns (uint256)",
  "function totalCascades() view returns (uint256)",

  // View — constants
  "function ADMIN_ROLE() view returns (bytes32)",
  "function MAX_LEVEL() view returns (uint8)",
  "function MAX_LOG_SIZE() view returns (uint256)",

  // Access control
  "function DEFAULT_ADMIN_ROLE() view returns (bytes32)",
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function grantRole(bytes32 role, address account)",
  "function revokeRole(bytes32 role, address account)",
  "function renounceRole(bytes32 role, address callerConfirmation)",
  "function getRoleAdmin(bytes32 role) view returns (bytes32)",

  // Events
  "event ContractRegistered(address indexed contractAddr, uint8 level)",
  "event CascadeTriggered(address indexed source, uint256 magnitude, uint256 dampedNext, bytes32 eventType)",
  "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)",
  "event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)",
] as const;
