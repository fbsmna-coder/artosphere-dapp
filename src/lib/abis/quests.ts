export const QUESTS_ABI = [
  "function startQuest(uint256 questIndex)",
  "function completeQuest()",
  "function getUserProgress(address user) view returns (uint8 currentQuest, uint256 questStartTime, uint8 completedQuests, uint256 totalEarned, uint256 timeRemaining)",
  "function QUEST_DURATIONS(uint256) view returns (uint256)",
  "function QUEST_REWARDS(uint256) view returns (uint256)",
  "function NUM_QUESTS() view returns (uint256)",
  "event QuestStarted(address indexed user, uint256 questIndex)",
  "event QuestCompleted(address indexed user, uint256 questIndex, uint256 reward)",
] as const;
