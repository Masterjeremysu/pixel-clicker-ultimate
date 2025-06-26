export interface GameState {
  coins: number;
  totalCoins: number;
  clickPower: number;
  autoClickers: number;
  autoClickerPower: number;
  gems: number;
  totalGems: number;
  energy: number;
  maxEnergy: number;
  energyRegenRate: number;
  level: number;
  experience: number;
  experienceToNext: number;
  upgrades: {
    clickPowerLevel: number;
    autoClickerLevel: number;
    multiplierLevel: number;
    energyLevel: number;
    gemMinerLevel: number;
    luckyClickLevel: number;
    criticalHitLevel: number;
    energyEfficiencyLevel: number;
    megaClickLevel: number;
    quantumBoostLevel: number;
  };
  buildings: {
    coinMines: number;
    gemFactories: number;
    energyPlants: number;
    researchLabs: number;
    quantumComputers: number;
    spaceStations: number;
    timeMachines: number;
    dimensionalRifts: number;
  };
  achievements: Achievement[];
  prestige: {
    level: number;
    points: number;
    multiplier: number;
    tokens: number;
  };
  challenges: Challenge[];
  dailyQuests: DailyQuest[];
  statistics: GameStatistics;
  settings: GameSettings;
  events: GameEvent[];
  boosts: ActiveBoost[];
  inventory: InventoryItem[];
  // NEW MULTIPLAYER FEATURES
  player: PlayerProfile;
  guild: GuildInfo | null;
  leaderboard: LeaderboardEntry[];
  socialFeatures: SocialFeatures;
  battlePass: BattlePass;
  tournaments: Tournament[];
  pets: Pet[];
  artifacts: Artifact[];
  skills: SkillTree;
  quests: Quest[];
  worldEvents: WorldEvent[];
  trading: TradingSystem;
  crafting: CraftingSystem;
  exploration: ExplorationSystem;
  pvp: PvPSystem;
  seasons: SeasonSystem;
  cosmetics: CosmeticSystem;
  notifications: GameNotification[];
}

export interface PlayerProfile {
  id: string;
  username: string;
  avatar: string;
  title: string;
  level: number;
  totalPower: number;
  joinDate: number;
  lastActive: number;
  country: string;
  badges: Badge[];
  friends: string[];
  blockedUsers: string[];
  reputation: number;
  vipLevel: number;
  premiumUntil?: number;
}

export interface GuildInfo {
  id: string;
  name: string;
  description: string;
  level: number;
  members: GuildMember[];
  maxMembers: number;
  totalPower: number;
  perks: GuildPerk[];
  wars: GuildWar[];
  treasury: number;
  createdAt: number;
  isPublic: boolean;
  requirements: {
    minLevel: number;
    minPower: number;
  };
}

export interface GuildMember {
  playerId: string;
  username: string;
  role: 'leader' | 'officer' | 'member';
  contribution: number;
  joinDate: number;
  lastActive: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  username: string;
  avatar: string;
  score: number;
  change: number;
  country: string;
  guild?: string;
}

export interface SocialFeatures {
  chatMessages: ChatMessage[];
  friendRequests: FriendRequest[];
  giftsSent: number;
  giftsReceived: number;
  referrals: string[];
  socialPoints: number;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  username: string;
  message: string;
  timestamp: number;
  channel: 'global' | 'guild' | 'private';
  reactions: { emoji: string; count: number; users: string[] }[];
}

export interface BattlePass {
  season: number;
  level: number;
  experience: number;
  experienceToNext: number;
  isPremium: boolean;
  rewards: BattlePassReward[];
  claimedRewards: string[];
}

export interface BattlePassReward {
  id: string;
  level: number;
  type: 'free' | 'premium';
  reward: {
    type: 'coins' | 'gems' | 'cosmetic' | 'boost' | 'pet' | 'artifact';
    amount?: number;
    itemId?: string;
  };
  claimed: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  type: 'clicks' | 'coins' | 'power' | 'speed';
  startTime: number;
  endTime: number;
  participants: TournamentParticipant[];
  rewards: TournamentReward[];
  entryFee: number;
  maxParticipants: number;
  status: 'upcoming' | 'active' | 'ended';
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  level: number;
  experience: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  abilities: PetAbility[];
  isActive: boolean;
  happiness: number;
  lastFed: number;
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'accessory' | 'relic';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  level: number;
  stats: ArtifactStat[];
  setBonus?: string;
  isEquipped: boolean;
}

export interface SkillTree {
  points: number;
  skills: {
    [skillId: string]: {
      level: number;
      maxLevel: number;
      unlocked: boolean;
      prerequisites: string[];
    };
  };
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'main' | 'side' | 'daily' | 'weekly' | 'event';
  objectives: QuestObjective[];
  rewards: QuestReward[];
  status: 'available' | 'active' | 'completed' | 'failed';
  timeLimit?: number;
  startTime?: number;
}

export interface WorldEvent {
  id: string;
  name: string;
  description: string;
  type: 'boss_raid' | 'double_rewards' | 'special_shop' | 'community_goal';
  startTime: number;
  endTime: number;
  globalProgress: number;
  globalTarget: number;
  playerProgress: number;
  rewards: WorldEventReward[];
  isActive: boolean;
}

export interface TradingSystem {
  activeOffers: TradeOffer[];
  tradeHistory: TradeHistory[];
  reputation: number;
  successfulTrades: number;
}

export interface CraftingSystem {
  recipes: CraftingRecipe[];
  materials: CraftingMaterial[];
  craftingLevel: number;
  craftingExperience: number;
}

export interface ExplorationSystem {
  currentZone: number;
  unlockedZones: number[];
  expeditions: Expedition[];
  discoveries: Discovery[];
  explorationEnergy: number;
  maxExplorationEnergy: number;
}

export interface PvPSystem {
  rank: number;
  rating: number;
  wins: number;
  losses: number;
  winStreak: number;
  seasonRewards: PvPReward[];
  battleHistory: PvPBattle[];
}

export interface SeasonSystem {
  currentSeason: number;
  seasonStartTime: number;
  seasonEndTime: number;
  seasonTheme: string;
  seasonRewards: SeasonReward[];
  seasonProgress: number;
}

export interface CosmeticSystem {
  ownedCosmetics: string[];
  equippedCosmetics: {
    avatar: string;
    frame: string;
    background: string;
    clickEffect: string;
    trail: string;
  };
  cosmeticShop: CosmeticItem[];
}

export interface GameNotification {
  id: string;
  type: 'achievement' | 'friend' | 'guild' | 'event' | 'system';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  data?: any;
}

// Supporting interfaces
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  unlockedAt: number;
}

export interface GuildPerk {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  cost: number;
}

export interface GuildWar {
  id: string;
  opponentGuildId: string;
  opponentGuildName: string;
  startTime: number;
  endTime: number;
  ourScore: number;
  theirScore: number;
  status: 'upcoming' | 'active' | 'ended';
}

export interface FriendRequest {
  id: string;
  fromPlayerId: string;
  fromUsername: string;
  timestamp: number;
  status: 'pending' | 'accepted' | 'declined';
}

export interface TournamentParticipant {
  playerId: string;
  username: string;
  score: number;
  rank: number;
}

export interface TournamentReward {
  rank: number;
  coins: number;
  gems: number;
  items: string[];
}

export interface PetAbility {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  lastUsed: number;
}

export interface ArtifactStat {
  type: 'clickPower' | 'coinMultiplier' | 'gemChance' | 'energyRegen' | 'criticalChance';
  value: number;
  percentage: boolean;
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'click' | 'earn' | 'upgrade' | 'defeat' | 'collect';
  target: number;
  progress: number;
  completed: boolean;
}

export interface QuestReward {
  type: 'coins' | 'gems' | 'experience' | 'item';
  amount?: number;
  itemId?: string;
}

export interface WorldEventReward {
  threshold: number;
  coins: number;
  gems: number;
  items: string[];
  claimed: boolean;
}

export interface TradeOffer {
  id: string;
  fromPlayerId: string;
  toPlayerId: string;
  offeredItems: TradeItem[];
  requestedItems: TradeItem[];
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: number;
  expiresAt: number;
}

export interface TradeItem {
  type: 'coins' | 'gems' | 'artifact' | 'pet' | 'material';
  itemId?: string;
  amount: number;
}

export interface TradeHistory {
  id: string;
  partnerId: string;
  partnerName: string;
  items: TradeItem[];
  timestamp: number;
  rating: number;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  description: string;
  materials: { materialId: string; amount: number }[];
  result: { type: string; itemId: string; amount: number };
  craftingTime: number;
  unlocked: boolean;
}

export interface CraftingMaterial {
  id: string;
  name: string;
  rarity: string;
  amount: number;
  maxStack: number;
}

export interface Expedition {
  id: string;
  zoneId: number;
  duration: number;
  startTime: number;
  status: 'active' | 'completed' | 'failed';
  rewards: ExpeditionReward[];
}

export interface Discovery {
  id: string;
  name: string;
  description: string;
  zoneId: number;
  discoveredAt: number;
  bonus: string;
}

export interface PvPReward {
  rank: number;
  coins: number;
  gems: number;
  title?: string;
  cosmetic?: string;
}

export interface PvPBattle {
  id: string;
  opponentId: string;
  opponentName: string;
  result: 'win' | 'loss';
  ratingChange: number;
  timestamp: number;
}

export interface SeasonReward {
  level: number;
  coins: number;
  gems: number;
  cosmetics: string[];
  claimed: boolean;
}

export interface CosmeticItem {
  id: string;
  name: string;
  type: 'avatar' | 'frame' | 'background' | 'clickEffect' | 'trail';
  rarity: string;
  price: number;
  currency: 'coins' | 'gems' | 'premium';
  limited: boolean;
  owned: boolean;
}

export interface ExpeditionReward {
  type: 'coins' | 'gems' | 'material' | 'artifact';
  amount: number;
  itemId?: string;
}

// Existing interfaces (keeping them for compatibility)
export interface Achievement {
  id: string;
  name: string;
  description: string;
  target: number;
  completed: boolean;
  reward: number;
  rewardType: 'coins' | 'gems' | 'energy' | 'multiplier' | 'prestige';
  category: 'clicking' | 'earning' | 'upgrading' | 'prestige' | 'special' | 'social';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  hidden: boolean;
  progress?: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'time' | 'clicks' | 'coins' | 'efficiency';
  target: number;
  timeLimit?: number;
  reward: number;
  rewardType: 'coins' | 'gems' | 'prestige';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  active: boolean;
  completed: boolean;
  progress: number;
  startTime?: number;
}

export interface DailyQuest {
  id: string;
  name: string;
  description: string;
  target: number;
  progress: number;
  completed: boolean;
  reward: number;
  rewardType: 'coins' | 'gems' | 'energy';
  expiresAt: number;
}

export interface GameStatistics {
  totalClicks: number;
  totalTimePlayedMs: number;
  highestCoinsPerSecond: number;
  highestClickPower: number;
  totalUpgradesPurchased: number;
  totalBuildingsBuilt: number;
  prestigeCount: number;
  achievementsUnlocked: number;
  challengesCompleted: number;
  criticalHits: number;
  luckyClicks: number;
  energySpent: number;
  gemsSpent: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  particlesEnabled: boolean;
  autoSaveEnabled: boolean;
  notificationsEnabled: boolean;
  theme: 'dark' | 'neon' | 'retro';
}

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  type: 'double_coins' | 'lucky_hour' | 'energy_boost' | 'gem_rush';
  multiplier: number;
  duration: number;
  startTime: number;
  active: boolean;
}

export interface ActiveBoost {
  id: string;
  name: string;
  type: 'click_power' | 'auto_clicker' | 'coin_multiplier' | 'energy_regen';
  multiplier: number;
  duration: number;
  startTime: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: 'consumable' | 'permanent' | 'special';
  quantity: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  effect: string;
}

export interface Building {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseProduction: number;
  owned: number;
  costMultiplier: number;
  productionType: 'coins' | 'gems' | 'energy';
}