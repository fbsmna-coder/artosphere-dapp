export const DISCOVERY_ORACLE_ABI = [
  // Proposal flow
  "function propose(uint256 discoveryId, uint8 outcome)",
  "function vote(uint256 discoveryId, bool inFavor)",
  "function veto(uint256 discoveryId)",
  "function resolve(uint256 discoveryId)",

  // View
  "function getProposal(uint256 discoveryId) view returns (uint8 outcome, uint8 state, address proposer, uint256 proposedAt, uint256 votesFor, uint256 votesAgainst, uint256 cooldownEnd, uint256 quorumRequired)",
  "function hasVoted(uint256 discoveryId, address voter) view returns (bool)",
  "function quorumReached(uint256 discoveryId) view returns (bool)",
  "function validatorCount() view returns (uint256)",
  "function isValidator(address) view returns (bool)",

  // Events
  "event ProposalCreated(uint256 indexed discoveryId, uint8 outcome, address indexed proposer, uint256 cooldownEnd)",
  "event VoteCast(uint256 indexed discoveryId, address indexed voter, bool inFavor)",
  "event ProposalVetoed(uint256 indexed discoveryId, address indexed vetoer)",
  "event ProposalResolved(uint256 indexed discoveryId, uint8 outcome)",
] as const;
