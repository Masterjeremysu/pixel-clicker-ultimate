import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Achievement, Challenge, Pet, Artifact, WorldEvent } from '../types/game';
import { achievementsData } from '../data/achievements';
import { challengesData } from '../data/challenges';
import toast from 'react-hot-toast';

const SAVE_KEY = 'pixel-clicker-save';
const LAST_SAVE_KEY = 'pixel-clicker-last-save';

const initialGameState: GameState = {
  coins: 0,
  totalCoins: 0,
  clickPower: 1,
  autoClickers: 0,
  autoClickerPower: 1,
  gems: 0,
  totalGems: 0,
  energy: 100,
  maxEnergy: 100,
  energyRegenRate: 1,
  level: 1,
  experience: 0,
  experienceToNext: 100,
  upgrades: {
    clickPowerLevel: 0,
    autoClickerLevel: 0,
    multiplierLevel: 0,
    energyLevel: 0,
    gemMinerLevel: 0,
    luckyClickLevel: 0,
    criticalHitLevel: 0,
    energyEfficiencyLevel: 0,
    megaClickLevel: 0,
    quantumBoostLevel: 0,
  },
  buildings: {
    coinMines: 0,
    gemFactories: 0,
    energyPlants: 0,
    researchLabs: 0,
    quantumComputers: 0,
    spaceStations: 0,
    timeMachines: 0,
    dimensionalRifts: 0,
  },
  achievements: achievementsData,
  prestige: {
    level: 0,
    points: 0,
    multiplier: 1,
    tokens: 0,
  },
  challenges: challengesData,
  dailyQuests: [],
  statistics: {
    totalClicks: 0,
    totalTimePlayedMs: 0,
    highestCoinsPerSecond: 0,
    highestClickPower: 0,
    totalUpgradesPurchased: 0,
    totalBuildingsBuilt: 0,
    prestigeCount: 0,
    achievementsUnlocked: 0,
    challengesCompleted: 0,
    criticalHits: 0,
    luckyClicks: 0,
    energySpent: 0,
    gemsSpent: 0,
  },
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    particlesEnabled: true,
    autoSaveEnabled: true,
    notificationsEnabled: true,
    theme: 'neon',
  },
  events: [],
  boosts: [],
  inventory: [],
  player: {
    id: 'player-' + Math.random().toString(36).substr(2, 9),
    username: 'Player' + Math.floor(Math.random() * 10000),
    avatar: 'default',
    title: 'Novice Clicker',
    level: 1,
    totalPower: 0,
    joinDate: Date.now(),
    lastActive: Date.now(),
    country: '🌍',
    badges: [],
    friends: [],
    blockedUsers: [],
    reputation: 100,
    vipLevel: 0,
  },
  guild: null,
  leaderboard: generateMockLeaderboard(),
  socialFeatures: {
    chatMessages: [],
    friendRequests: generateMockFriendRequests(),
    giftsSent: 0,
    giftsReceived: 0,
    referrals: [],
    socialPoints: 0,
  },
  battlePass: {
    season: 1,
    level: 1,
    experience: 0,
    experienceToNext: 1000,
    isPremium: false,
    rewards: generateBattlePassRewards(),
    claimedRewards: [],
  },
  tournaments: generateMockTournaments(),
  pets: [],
  artifacts: [],
  skills: {
    points: 0,
    skills: {},
  },
  quests: [],
  worldEvents: generateMockWorldEvents(),
  trading: {
    activeOffers: [],
    tradeHistory: [],
    reputation: 100,
    successfulTrades: 0,
  },
  crafting: {
    recipes: [],
    materials: [],
    craftingLevel: 1,
    craftingExperience: 0,
  },
  exploration: {
    currentZone: 1,
    unlockedZones: [1],
    expeditions: [],
    discoveries: [],
    explorationEnergy: 100,
    maxExplorationEnergy: 100,
  },
  pvp: {
    rank: 1000,
    rating: 1200,
    wins: 0,
    losses: 0,
    winStreak: 0,
    seasonRewards: [],
    battleHistory: [],
  },
  seasons: {
    currentSeason: 1,
    seasonStartTime: Date.now(),
    seasonEndTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
    seasonTheme: 'Cyber Genesis',
    seasonRewards: [],
    seasonProgress: 0,
  },
  cosmetics: {
    ownedCosmetics: ['default_avatar'],
    equippedCosmetics: {
      avatar: 'default_avatar',
      frame: '',
      background: '',
      clickEffect: '',
      trail: '',
    },
    cosmeticShop: [],
  },
  notifications: [],
};

// Mock data generators
function generateMockLeaderboard() {
  const countries = ['🇺🇸', '🇬🇧', '🇫🇷', '🇩🇪', '🇯🇵', '🇰🇷', '🇨🇳', '🇧🇷', '🇷🇺', '🇮🇳'];
  const names = ['ClickMaster', 'CoinHunter', 'GemCollector', 'PowerClicker', 'IdleKing', 'PrestigeGod', 'AutoClicker', 'LuckyPlayer', 'CriticalHit', 'MegaClicker'];
  
  return Array.from({ length: 100 }, (_, i) => ({
    rank: i + 1,
    playerId: `player-${i}`,
    username: names[Math.floor(Math.random() * names.length)] + (i + 1),
    avatar: 'default',
    score: Math.floor(Math.random() * 1000000000) + 1000000,
    change: Math.floor(Math.random() * 21) - 10,
    country: countries[Math.floor(Math.random() * countries.length)],
    guild: Math.random() > 0.5 ? 'Guild' + Math.floor(Math.random() * 100) : undefined,
  }));
}

function generateMockFriendRequests() {
  return [
    {
      id: 'req-1',
      fromPlayerId: 'player-123',
      fromUsername: 'ClickMaster2024',
      timestamp: Date.now() - 3600000,
      status: 'pending' as const,
    },
    {
      id: 'req-2',
      fromPlayerId: 'player-456',
      fromUsername: 'GemHunter',
      timestamp: Date.now() - 7200000,
      status: 'pending' as const,
    },
  ];
}

function generateBattlePassRewards() {
  const rewards = [];
  for (let level = 1; level <= 100; level++) {
    rewards.push({
      id: `free-${level}`,
      level,
      type: 'free' as const,
      reward: {
        type: level % 10 === 0 ? 'gems' : 'coins' as const,
        amount: level % 10 === 0 ? level * 10 : level * 100,
      },
      claimed: false,
    });
    
    rewards.push({
      id: `premium-${level}`,
      level,
      type: 'premium' as const,
      reward: {
        type: level % 5 === 0 ? 'cosmetic' : level % 15 === 0 ? 'pet' : 'gems' as const,
        amount: level % 5 === 0 ? undefined : level * 20,
        itemId: level % 5 === 0 ? `cosmetic-${level}` : level % 15 === 0 ? `pet-${level}` : undefined,
      },
      claimed: false,
    });
  }
  return rewards;
}

function generateMockTournaments() {
  return [
    {
      id: 'tournament-1',
      name: 'Speed Clicking Championship',
      description: 'Click as fast as you can in 5 minutes!',
      type: 'clicks' as const,
      startTime: Date.now() + 3600000,
      endTime: Date.now() + 7200000,
      participants: [],
      rewards: [
        { rank: 1, coins: 100000, gems: 500, items: ['legendary_artifact'] },
        { rank: 2, coins: 50000, gems: 250, items: ['epic_artifact'] },
        { rank: 3, coins: 25000, gems: 100, items: ['rare_artifact'] },
      ],
      entryFee: 100,
      maxParticipants: 1000,
      status: 'upcoming' as const,
    },
    {
      id: 'tournament-2',
      name: 'Coin Accumulation Contest',
      description: 'Earn the most coins in 24 hours!',
      type: 'coins' as const,
      startTime: Date.now() - 3600000,
      endTime: Date.now() + 82800000,
      participants: [],
      rewards: [
        { rank: 1, coins: 1000000, gems: 1000, items: ['mythic_pet'] },
        { rank: 2, coins: 500000, gems: 500, items: ['legendary_pet'] },
        { rank: 3, coins: 250000, gems: 250, items: ['epic_pet'] },
      ],
      entryFee: 500,
      maxParticipants: 500,
      status: 'active' as const,
    },
  ];
}

function generateMockWorldEvents() {
  return [
    {
      id: 'world-event-1',
      name: 'Global Coin Rush',
      description: 'All players work together to collect 1 trillion coins!',
      type: 'community_goal' as const,
      startTime: Date.now() - 86400000,
      endTime: Date.now() + 6 * 86400000,
      globalProgress: 750000000000,
      globalTarget: 1000000000000,
      playerProgress: 1000000,
      rewards: [
        { threshold: 250000000000, coins: 10000, gems: 50, items: ['boost_pack'], claimed: true },
        { threshold: 500000000000, coins: 25000, gems: 100, items: ['rare_pet_egg'], claimed: true },
        { threshold: 750000000000, coins: 50000, gems: 200, items: ['epic_artifact'], claimed: false },
        { threshold: 1000000000000, coins: 100000, gems: 500, items: ['legendary_title'], claimed: false },
      ],
      isActive: true,
    },
  ];
}

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        const mergedState = {
          ...initialGameState,
          ...parsedState,
          upgrades: { ...initialGameState.upgrades, ...parsedState.upgrades },
          buildings: { ...initialGameState.buildings, ...parsedState.buildings },
          prestige: { ...initialGameState.prestige, ...parsedState.prestige },
          statistics: { ...initialGameState.statistics, ...parsedState.statistics },
          settings: { ...initialGameState.settings, ...parsedState.settings },
          player: { ...initialGameState.player, ...parsedState.player },
          socialFeatures: { ...initialGameState.socialFeatures, ...parsedState.socialFeatures },
          battlePass: { ...initialGameState.battlePass, ...parsedState.battlePass },
          achievements: mergeAchievements(parsedState.achievements || [], achievementsData),
          challenges: mergeChallenges(parsedState.challenges || [], challengesData),
          leaderboard: parsedState.leaderboard || initialGameState.leaderboard,
          tournaments: parsedState.tournaments || initialGameState.tournaments,
          pets: parsedState.pets || [],
          artifacts: parsedState.artifacts || [],
          worldEvents: parsedState.worldEvents || initialGameState.worldEvents,
          notifications: parsedState.notifications || [],
        };
        return mergedState;
      } catch (error) {
        console.warn('Failed to load saved game state, using initial state:', error);
        return initialGameState;
      }
    }
    return initialGameState;
  });

  const gameStartTime = useRef(Date.now());
  const lastClickTime = useRef(0);
  const clickStreak = useRef(0);

  // Auto-save
  useEffect(() => {
    if (gameState.settings.autoSaveEnabled) {
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
      localStorage.setItem(LAST_SAVE_KEY, Date.now().toString());
    }
  }, [gameState]);

  // Track play time
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        statistics: {
          ...prev.statistics,
          totalTimePlayedMs: prev.statistics.totalTimePlayedMs + 1000,
        },
        player: {
          ...prev.player,
          lastActive: Date.now(),
        },
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.energy < prev.maxEnergy) {
          return {
            ...prev,
            energy: Math.min(prev.maxEnergy, prev.energy + prev.energyRegenRate),
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-clicker and building production
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        let coinsGained = 0;
        let gemsGained = 0;
        let energyGained = 0;

        if (prev.autoClickers > 0) {
          coinsGained += prev.autoClickers * prev.autoClickerPower * prev.prestige.multiplier;
        }

        coinsGained += prev.buildings.coinMines * 1 * prev.prestige.multiplier;
        gemsGained += prev.buildings.gemFactories * 0.1;
        energyGained += prev.buildings.energyPlants * 2;
        coinsGained += prev.buildings.spaceStations * 100 * prev.prestige.multiplier;
        coinsGained += prev.buildings.timeMachines * 1000 * prev.prestige.multiplier;
        coinsGained += prev.buildings.dimensionalRifts * 10000 * prev.prestige.multiplier;

        if (prev.buildings.researchLabs > 0) {
          const researchBonus = 1 + (prev.buildings.researchLabs * 0.1);
          coinsGained *= researchBonus;
          gemsGained *= researchBonus;
        }

        if (prev.buildings.quantumComputers > 0) {
          const quantumBonus = Math.pow(1.05, prev.buildings.quantumComputers);
          coinsGained *= quantumBonus;
          gemsGained *= quantumBonus;
        }

        // Pet bonuses
        prev.pets.forEach(pet => {
          if (pet.isActive) {
            const petBonus = pet.level * 0.1;
            coinsGained *= (1 + petBonus);
          }
        });

        const newCoinsPerSecond = coinsGained;
        const newHighestCPS = Math.max(prev.statistics.highestCoinsPerSecond, newCoinsPerSecond);

        const battlePassExp = Math.floor(coinsGained / 1000);
        let newBattlePass = { ...prev.battlePass };
        if (battlePassExp > 0) {
          newBattlePass.experience += battlePassExp;
          while (newBattlePass.experience >= newBattlePass.experienceToNext) {
            newBattlePass.experience -= newBattlePass.experienceToNext;
            newBattlePass.level += 1;
            newBattlePass.experienceToNext = Math.floor(1000 * Math.pow(1.1, newBattlePass.level));
          }
        }

        return {
          ...prev,
          coins: prev.coins + coinsGained,
          totalCoins: prev.totalCoins + coinsGained,
          gems: prev.gems + gemsGained,
          totalGems: prev.totalGems + gemsGained,
          energy: Math.min(prev.maxEnergy, prev.energy + energyGained),
          battlePass: newBattlePass,
          player: {
            ...prev.player,
            totalPower: prev.totalCoins + prev.totalGems * 100,
          },
          statistics: {
            ...prev.statistics,
            highestCoinsPerSecond: newHighestCPS,
          },
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = useCallback(() => {
    setGameState(prev => {
      const now = Date.now();
      const timeSinceLastClick = now - lastClickTime.current;
      
      if (timeSinceLastClick < 1000) {
        clickStreak.current += 1;
      } else {
        clickStreak.current = 1;
      }
      lastClickTime.current = now;

      let clickPower = prev.clickPower * prev.prestige.multiplier;
      let coinsGained = clickPower;
      let gemsGained = 0;
      let experienceGained = 1;
      let isCritical = false;
      let isLucky = false;

      const criticalChance = 0.05 + (prev.upgrades.criticalHitLevel * 0.02);
      if (Math.random() < criticalChance) {
        coinsGained *= 5;
        experienceGained *= 2;
        isCritical = true;
      }

      const luckyChance = 0.02 + (prev.upgrades.luckyClickLevel * 0.01);
      if (Math.random() < luckyChance) {
        gemsGained += 1;
        isLucky = true;
      }

      if (prev.energy >= 10 && clickStreak.current >= 10) {
        coinsGained *= 10;
        experienceGained *= 5;
      }

      let newLevel = prev.level;
      let newExperience = prev.experience + experienceGained;
      let newExperienceToNext = prev.experienceToNext;

      if (newExperience >= newExperienceToNext) {
        newLevel += 1;
        newExperience = 0;
        newExperienceToNext = Math.floor(100 * Math.pow(1.5, newLevel - 1));
        coinsGained += newLevel * 100;
        gemsGained += Math.floor(newLevel / 5);
      }

      const newTotalCoins = prev.totalCoins + coinsGained;
      const newTotalGems = prev.totalGems + gemsGained;

      const battlePassExp = Math.floor(coinsGained / 100);
      let newBattlePass = { ...prev.battlePass };
      if (battlePassExp > 0) {
        newBattlePass.experience += battlePassExp;
        while (newBattlePass.experience >= newBattlePass.experienceToNext) {
          newBattlePass.experience -= newBattlePass.experienceToNext;
          newBattlePass.level += 1;
          newBattlePass.experienceToNext = Math.floor(1000 * Math.pow(1.1, newBattlePass.level));
        }
      }

      const updatedAchievements = checkAchievements(prev, {
        totalClicks: prev.statistics.totalClicks + 1,
        totalCoins: newTotalCoins,
        totalGems: newTotalGems,
        isCritical,
        isLucky,
        clickStreak: clickStreak.current,
      });

      return {
        ...prev,
        coins: prev.coins + coinsGained,
        totalCoins: newTotalCoins,
        gems: prev.gems + gemsGained,
        totalGems: newTotalGems,
        level: newLevel,
        experience: newExperience,
        experienceToNext: newExperienceToNext,
        energy: Math.max(0, prev.energy - (clickStreak.current >= 10 ? 10 : 0)),
        achievements: updatedAchievements,
        battlePass: newBattlePass,
        player: {
          ...prev.player,
          level: newLevel,
          totalPower: newTotalCoins + newTotalGems * 100,
        },
        statistics: {
          ...prev.statistics,
          totalClicks: prev.statistics.totalClicks + 1,
          criticalHits: prev.statistics.criticalHits + (isCritical ? 1 : 0),
          luckyClicks: prev.statistics.luckyClicks + (isLucky ? 1 : 0),
          highestClickPower: Math.max(prev.statistics.highestClickPower, clickPower),
        },
      };
    });
  }, []);

  const buyUpgrade = useCallback((upgradeType: string, cost: number, costType: 'coins' | 'gems' = 'coins') => {
    setGameState(prev => {
      const canAfford = costType === 'coins' ? prev.coins >= cost : prev.gems >= cost;
      if (!canAfford) return prev;

      const newState = { 
        ...prev, 
        [costType]: prev[costType] - cost,
        statistics: {
          ...prev.statistics,
          totalUpgradesPurchased: prev.statistics.totalUpgradesPurchased + 1,
          gemsSpent: prev.statistics.gemsSpent + (costType === 'gems' ? cost : 0),
        },
      };

      switch (upgradeType) {
        case 'clickPower':
          newState.clickPower *= 2;
          newState.upgrades.clickPowerLevel += 1;
          break;
        case 'autoClicker':
          newState.autoClickers += 1;
          newState.upgrades.autoClickerLevel += 1;
          break;
        case 'multiplier':
          newState.prestige.multiplier += 0.5;
          newState.upgrades.multiplierLevel += 1;
          break;
        case 'energy':
          newState.maxEnergy += 50;
          newState.energyRegenRate += 0.5;
          newState.upgrades.energyLevel += 1;
          break;
        case 'gemMiner':
          newState.upgrades.gemMinerLevel += 1;
          break;
        case 'luckyClick':
          newState.upgrades.luckyClickLevel += 1;
          break;
        case 'criticalHit':
          newState.upgrades.criticalHitLevel += 1;
          break;
        case 'energyEfficiency':
          newState.upgrades.energyEfficiencyLevel += 1;
          break;
        case 'megaClick':
          newState.upgrades.megaClickLevel += 1;
          break;
        case 'quantumBoost':
          newState.upgrades.quantumBoostLevel += 1;
          break;
        default:
          return prev;
      }

      toast.success(`Upgrade acheté: ${upgradeType}!`);
      return newState;
    });
  }, []);

  const buyBuilding = useCallback((buildingType: string, cost: number) => {
    setGameState(prev => {
      if (prev.coins < cost) return prev;

      const newState = { 
        ...prev, 
        coins: prev.coins - cost,
        statistics: {
          ...prev.statistics,
          totalBuildingsBuilt: prev.statistics.totalBuildingsBuilt + 1,
        },
      };

      switch (buildingType) {
        case 'coinMine':
          newState.buildings.coinMines += 1;
          break;
        case 'gemFactory':
          newState.buildings.gemFactories += 1;
          break;
        case 'energyPlant':
          newState.buildings.energyPlants += 1;
          break;
        case 'researchLab':
          newState.buildings.researchLabs += 1;
          break;
        case 'quantumComputer':
          newState.buildings.quantumComputers += 1;
          break;
        case 'spaceStation':
          newState.buildings.spaceStations += 1;
          break;
        case 'timeMachine':
          newState.buildings.timeMachines += 1;
          break;
        case 'dimensionalRift':
          newState.buildings.dimensionalRifts += 1;
          break;
        default:
          return prev;
      }

      toast.success(`Bâtiment construit: ${buildingType}!`);
      return newState;
    });
  }, []);

  const prestige = useCallback(() => {
    if (gameState.totalCoins < 1000000) return;

    const prestigePoints = Math.floor(Math.sqrt(gameState.totalCoins / 1000000));
    
    setGameState(prev => ({
      ...initialGameState,
      prestige: {
        level: prev.prestige.level + 1,
        points: prev.prestige.points + prestigePoints,
        multiplier: 1 + (prev.prestige.points + prestigePoints) * 0.1,
        tokens: prev.prestige.tokens + Math.floor(prestigePoints / 10),
      },
      achievements: prev.achievements,
      player: prev.player,
      guild: prev.guild,
      leaderboard: prev.leaderboard,
      socialFeatures: prev.socialFeatures,
      battlePass: prev.battlePass,
      tournaments: prev.tournaments,
      pets: prev.pets,
      artifacts: prev.artifacts,
      worldEvents: prev.worldEvents,
      statistics: {
        ...prev.statistics,
        prestigeCount: prev.statistics.prestigeCount + 1,
      },
      settings: prev.settings,
      notifications: prev.notifications,
    }));

    toast.success(`Prestige accompli! +${prestigePoints} points de prestige!`);
  }, [gameState.totalCoins]);

  const resetGame = useCallback(() => {
    setGameState(initialGameState);
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(LAST_SAVE_KEY);
    toast.success('Jeu réinitialisé!');
  }, []);

  // PET FUNCTIONS
  const summonPet = useCallback(() => {
    setGameState(prev => {
      if (prev.gems < 100) {
        toast.error('Pas assez de gemmes! (100 requis)');
        return prev;
      }

      const petTypes = ['dragon', 'phoenix', 'unicorn', 'wolf', 'cat', 'robot', 'crystal', 'ghost'];
      const rarities = ['common', 'rare', 'epic', 'legendary', 'mythic'];
      const rarityWeights = [50, 30, 15, 4, 1];
      
      let randomValue = Math.random() * 100;
      let selectedRarity = 'common';
      let cumulativeWeight = 0;
      
      for (let i = 0; i < rarities.length; i++) {
        cumulativeWeight += rarityWeights[i];
        if (randomValue <= cumulativeWeight) {
          selectedRarity = rarities[i];
          break;
        }
      }

      const newPet: Pet = {
        id: 'pet-' + Date.now(),
        name: `${petTypes[Math.floor(Math.random() * petTypes.length)]} ${Math.floor(Math.random() * 1000)}`,
        type: petTypes[Math.floor(Math.random() * petTypes.length)],
        level: 1,
        experience: 0,
        rarity: selectedRarity as any,
        abilities: [
          {
            id: 'ability-1',
            name: 'Coin Boost',
            description: 'Augmente les gains de pièces de 50% pendant 30s',
            cooldown: 300000,
            lastUsed: 0,
          }
        ],
        isActive: prev.pets.length === 0,
        happiness: 100,
        lastFed: Date.now(),
      };

      toast.success(`Nouveau pet invoqué: ${newPet.name} (${selectedRarity})!`);

      return {
        ...prev,
        gems: prev.gems - 100,
        pets: [...prev.pets, newPet],
      };
    });
  }, []);

  const feedPet = useCallback((petId: string) => {
    setGameState(prev => {
      if (prev.coins < 1000) {
        toast.error('Pas assez de pièces! (1000 requis)');
        return prev;
      }

      const updatedPets = prev.pets.map(pet => {
        if (pet.id === petId) {
          const newHappiness = Math.min(100, pet.happiness + 20);
          const newExperience = pet.experience + 50;
          let newLevel = pet.level;
          
          if (newExperience >= pet.level * 100) {
            newLevel += 1;
            toast.success(`${pet.name} a monté de niveau! Niveau ${newLevel}`);
          }

          return {
            ...pet,
            happiness: newHappiness,
            experience: newExperience,
            level: newLevel,
            lastFed: Date.now(),
          };
        }
        return pet;
      });

      toast.success('Pet nourri! +20 bonheur, +50 XP');

      return {
        ...prev,
        coins: prev.coins - 1000,
        pets: updatedPets,
      };
    });
  }, []);

  const activatePet = useCallback((petId: string) => {
    setGameState(prev => {
      const updatedPets = prev.pets.map(pet => ({
        ...pet,
        isActive: pet.id === petId,
      }));

      const activatedPet = updatedPets.find(pet => pet.id === petId);
      toast.success(`${activatedPet?.name} est maintenant actif!`);

      return {
        ...prev,
        pets: updatedPets,
      };
    });
  }, []);

  const usePetAbility = useCallback((petId: string, abilityId: string) => {
    setGameState(prev => {
      const pet = prev.pets.find(p => p.id === petId);
      const ability = pet?.abilities.find(a => a.id === abilityId);
      
      if (!pet || !ability) return prev;

      const now = Date.now();
      if (now - ability.lastUsed < ability.cooldown) {
        toast.error('Capacité en cooldown!');
        return prev;
      }

      const updatedPets = prev.pets.map(p => {
        if (p.id === petId) {
          return {
            ...p,
            abilities: p.abilities.map(a => 
              a.id === abilityId ? { ...a, lastUsed: now } : a
            ),
          };
        }
        return p;
      });

      toast.success(`Capacité utilisée: ${ability.name}!`);

      return {
        ...prev,
        pets: updatedPets,
      };
    });
  }, []);

  // GUILD FUNCTIONS
  const joinGuild = useCallback((guildId: string) => {
    setGameState(prev => {
      const mockGuild = {
        id: guildId,
        name: 'Les Clickers Légendaires',
        description: 'Une guilde pour les meilleurs clickers!',
        level: 5,
        members: [
          {
            playerId: prev.player.id,
            username: prev.player.username,
            role: 'member' as const,
            contribution: 0,
            joinDate: Date.now(),
            lastActive: Date.now(),
          },
          {
            playerId: 'leader-1',
            username: 'GuildMaster',
            role: 'leader' as const,
            contribution: 1000000,
            joinDate: Date.now() - 86400000,
            lastActive: Date.now(),
          },
        ],
        maxMembers: 50,
        totalPower: 5000000,
        perks: [],
        wars: [],
        treasury: 100000,
        createdAt: Date.now() - 86400000,
        isPublic: true,
        requirements: {
          minLevel: 1,
          minPower: 0,
        },
      };

      toast.success(`Rejoint la guilde: ${mockGuild.name}!`);

      return {
        ...prev,
        guild: mockGuild,
      };
    });
  }, []);

  const createGuild = useCallback((name: string, description: string) => {
    setGameState(prev => {
      if (prev.gems < 1000) {
        toast.error('Pas assez de gemmes! (1000 requis)');
        return prev;
      }

      const newGuild = {
        id: 'guild-' + Date.now(),
        name,
        description,
        level: 1,
        members: [
          {
            playerId: prev.player.id,
            username: prev.player.username,
            role: 'leader' as const,
            contribution: 0,
            joinDate: Date.now(),
            lastActive: Date.now(),
          },
        ],
        maxMembers: 20,
        totalPower: prev.player.totalPower,
        perks: [],
        wars: [],
        treasury: 0,
        createdAt: Date.now(),
        isPublic: true,
        requirements: {
          minLevel: 1,
          minPower: 0,
        },
      };

      toast.success(`Guilde créée: ${name}!`);

      return {
        ...prev,
        gems: prev.gems - 1000,
        guild: newGuild,
      };
    });
  }, []);

  // TOURNAMENT FUNCTIONS
  const joinTournament = useCallback((tournamentId: string) => {
    setGameState(prev => {
      const tournament = prev.tournaments.find(t => t.id === tournamentId);
      if (!tournament) return prev;

      if (prev.gems < tournament.entryFee) {
        toast.error(`Pas assez de gemmes! (${tournament.entryFee} requis)`);
        return prev;
      }

      const updatedTournaments = prev.tournaments.map(t => {
        if (t.id === tournamentId) {
          return {
            ...t,
            participants: [
              ...t.participants,
              {
                playerId: prev.player.id,
                username: prev.player.username,
                score: 0,
                rank: t.participants.length + 1,
              },
            ],
          };
        }
        return t;
      });

      toast.success(`Rejoint le tournoi: ${tournament.name}!`);

      return {
        ...prev,
        gems: prev.gems - tournament.entryFee,
        tournaments: updatedTournaments,
      };
    });
  }, []);

  // SOCIAL FUNCTIONS
  const sendGift = useCallback((playerId: string, giftType: string) => {
    setGameState(prev => {
      if (prev.socialFeatures.giftsSent >= 10) {
        toast.error('Limite de cadeaux quotidiens atteinte!');
        return prev;
      }

      let cost = 0;
      let giftName = '';

      switch (giftType) {
        case 'energy':
          cost = 100;
          giftName = 'Énergie';
          break;
        case 'coins':
          cost = 1000;
          giftName = 'Pièces';
          break;
        case 'gems':
          cost = 10;
          giftName = 'Gemmes';
          break;
      }

      if (prev.coins < cost) {
        toast.error(`Pas assez de pièces! (${cost} requis)`);
        return prev;
      }

      toast.success(`Cadeau envoyé: ${giftName}!`);

      return {
        ...prev,
        coins: prev.coins - cost,
        socialFeatures: {
          ...prev.socialFeatures,
          giftsSent: prev.socialFeatures.giftsSent + 1,
          socialPoints: prev.socialFeatures.socialPoints + 10,
        },
      };
    });
  }, []);

  // BATTLE PASS FUNCTIONS
  const claimBattlePassReward = useCallback((rewardId: string) => {
    setGameState(prev => {
      const reward = prev.battlePass.rewards.find(r => r.id === rewardId);
      if (!reward || reward.claimed || prev.battlePass.level < reward.level) {
        toast.error('Récompense non disponible!');
        return prev;
      }

      if (reward.type === 'premium' && !prev.battlePass.isPremium) {
        toast.error('Battle Pass Premium requis!');
        return prev;
      }

      const updatedRewards = prev.battlePass.rewards.map(r =>
        r.id === rewardId ? { ...r, claimed: true } : r
      );

      let newCoins = prev.coins;
      let newGems = prev.gems;

      if (reward.reward.type === 'coins' && reward.reward.amount) {
        newCoins += reward.reward.amount;
      } else if (reward.reward.type === 'gems' && reward.reward.amount) {
        newGems += reward.reward.amount;
      }

      toast.success(`Récompense réclamée: ${reward.reward.amount} ${reward.reward.type}!`);

      return {
        ...prev,
        coins: newCoins,
        gems: newGems,
        battlePass: {
          ...prev.battlePass,
          rewards: updatedRewards,
          claimedRewards: [...prev.battlePass.claimedRewards, rewardId],
        },
      };
    });
  }, []);

  const upgradeToPremium = useCallback(() => {
    setGameState(prev => {
      if (prev.gems < 2000) {
        toast.error('Pas assez de gemmes! (2000 requis)');
        return prev;
      }

      toast.success('Battle Pass Premium activé!');

      return {
        ...prev,
        gems: prev.gems - 2000,
        battlePass: {
          ...prev.battlePass,
          isPremium: true,
        },
      };
    });
  }, []);

  // WORLD EVENTS FUNCTIONS
  const participateWorldEvent = useCallback((eventId: string) => {
    setGameState(prev => {
      const event = prev.worldEvents.find(e => e.id === eventId);
      if (!event || !event.isActive) {
        toast.error('Événement non disponible!');
        return prev;
      }

      const contribution = Math.floor(prev.clickPower * 100);
      
      const updatedEvents = prev.worldEvents.map(e => {
        if (e.id === eventId) {
          return {
            ...e,
            globalProgress: e.globalProgress + contribution,
            playerProgress: e.playerProgress + contribution,
          };
        }
        return e;
      });

      toast.success(`Contribution: ${contribution} à l'événement!`);

      return {
        ...prev,
        worldEvents: updatedEvents,
      };
    });
  }, []);

  const claimWorldEventReward = useCallback((eventId: string, rewardId: string) => {
    setGameState(prev => {
      const event = prev.worldEvents.find(e => e.id === eventId);
      if (!event) return prev;

      const rewardIndex = parseInt(rewardId);
      const reward = event.rewards[rewardIndex];
      
      if (!reward || reward.claimed || event.globalProgress < reward.threshold) {
        toast.error('Récompense non disponible!');
        return prev;
      }

      const updatedEvents = prev.worldEvents.map(e => {
        if (e.id === eventId) {
          const updatedRewards = [...e.rewards];
          updatedRewards[rewardIndex] = { ...reward, claimed: true };
          return { ...e, rewards: updatedRewards };
        }
        return e;
      });

      toast.success(`Récompense réclamée: ${reward.coins} pièces, ${reward.gems} gemmes!`);

      return {
        ...prev,
        coins: prev.coins + reward.coins,
        gems: prev.gems + reward.gems,
        worldEvents: updatedEvents,
      };
    });
  }, []);

  // ARTIFACT FUNCTIONS
  const forgeArtifact = useCallback(() => {
    setGameState(prev => {
      if (prev.gems < 500) {
        toast.error('Pas assez de gemmes! (500 requis)');
        return prev;
      }

      const artifactTypes = ['weapon', 'armor', 'accessory', 'relic'];
      const rarities = ['common', 'rare', 'epic', 'legendary', 'mythic'];
      const rarityWeights = [50, 30, 15, 4, 1];
      
      let randomValue = Math.random() * 100;
      let selectedRarity = 'common';
      let cumulativeWeight = 0;
      
      for (let i = 0; i < rarities.length; i++) {
        cumulativeWeight += rarityWeights[i];
        if (randomValue <= cumulativeWeight) {
          selectedRarity = rarities[i];
          break;
        }
      }

      const newArtifact: Artifact = {
        id: 'artifact-' + Date.now(),
        name: `${selectedRarity} ${artifactTypes[Math.floor(Math.random() * artifactTypes.length)]}`,
        description: 'Un artefact mystérieux avec des pouvoirs anciens',
        type: artifactTypes[Math.floor(Math.random() * artifactTypes.length)] as any,
        rarity: selectedRarity as any,
        level: 1,
        stats: [
          {
            type: 'clickPower',
            value: Math.floor(Math.random() * 50) + 10,
            percentage: false,
          },
          {
            type: 'coinMultiplier',
            value: Math.floor(Math.random() * 20) + 5,
            percentage: true,
          },
        ],
        isEquipped: false,
      };

      toast.success(`Artefact forgé: ${newArtifact.name} (${selectedRarity})!`);

      return {
        ...prev,
        gems: prev.gems - 500,
        artifacts: [...prev.artifacts, newArtifact],
      };
    });
  }, []);

  const equipArtifact = useCallback((artifactId: string) => {
    setGameState(prev => {
      const updatedArtifacts = prev.artifacts.map(artifact => ({
        ...artifact,
        isEquipped: artifact.id === artifactId ? !artifact.isEquipped : artifact.isEquipped,
      }));

      const artifact = updatedArtifacts.find(a => a.id === artifactId);
      toast.success(`${artifact?.isEquipped ? 'Équipé' : 'Déséquipé'}: ${artifact?.name}!`);

      return {
        ...prev,
        artifacts: updatedArtifacts,
      };
    });
  }, []);

  const upgradeArtifact = useCallback((artifactId: string) => {
    setGameState(prev => {
      const artifact = prev.artifacts.find(a => a.id === artifactId);
      if (!artifact) return prev;

      const cost = artifact.level * 100;
      if (prev.gems < cost) {
        toast.error(`Pas assez de gemmes! (${cost} requis)`);
        return prev;
      }

      const updatedArtifacts = prev.artifacts.map(a => {
        if (a.id === artifactId) {
          return {
            ...a,
            level: a.level + 1,
            stats: a.stats.map(stat => ({
              ...stat,
              value: Math.floor(stat.value * 1.1),
            })),
          };
        }
        return a;
      });

      toast.success(`Artefact amélioré: ${artifact.name} niveau ${artifact.level + 1}!`);

      return {
        ...prev,
        gems: prev.gems - cost,
        artifacts: updatedArtifacts,
      };
    });
  }, []);

  return {
    gameState,
    handleClick,
    buyUpgrade,
    buyBuilding,
    prestige,
    resetGame,
    // Pet functions
    summonPet,
    feedPet,
    activatePet,
    usePetAbility,
    // Guild functions
    joinGuild,
    createGuild,
    // Tournament functions
    joinTournament,
    // Social functions
    sendGift,
    // Battle Pass functions
    claimBattlePassReward,
    upgradeToPremium,
    // World Events functions
    participateWorldEvent,
    claimWorldEventReward,
    // Artifact functions
    forgeArtifact,
    equipArtifact,
    upgradeArtifact,
  };
};

// Helper functions
function mergeAchievements(saved: Achievement[], defaults: Achievement[]): Achievement[] {
  const savedMap = new Map(saved.map(a => [a.id, a]));
  return defaults.map(defaultAchievement => 
    savedMap.get(defaultAchievement.id) || defaultAchievement
  );
}

function mergeChallenges(saved: Challenge[], defaults: Challenge[]): Challenge[] {
  const savedMap = new Map(saved.map(c => [c.id, c]));
  return defaults.map(defaultChallenge => 
    savedMap.get(defaultChallenge.id) || defaultChallenge
  );
}

function checkAchievements(gameState: GameState, context: any): Achievement[] {
  return gameState.achievements.map(achievement => {
    if (achievement.completed) return achievement;

    let progress = 0;
    let shouldComplete = false;

    switch (achievement.id) {
      case 'first-click':
        progress = context.totalClicks;
        shouldComplete = context.totalClicks >= 1;
        break;
      case 'hundred-clicks':
        progress = context.totalClicks;
        shouldComplete = context.totalClicks >= 100;
        break;
      case 'thousand-clicks':
        progress = context.totalClicks;
        shouldComplete = context.totalClicks >= 1000;
        break;
      case 'ten-thousand-clicks':
        progress = context.totalClicks;
        shouldComplete = context.totalClicks >= 10000;
        break;
      case 'hundred-thousand-clicks':
        progress = context.totalClicks;
        shouldComplete = context.totalClicks >= 100000;
        break;
      case 'million-clicks':
        progress = context.totalClicks;
        shouldComplete = context.totalClicks >= 1000000;
        break;
      case 'hundred-coins':
      case 'thousand-coins':
      case 'million-coins':
      case 'billion-coins':
      case 'trillion-coins':
        progress = context.totalCoins;
        shouldComplete = context.totalCoins >= achievement.target;
        break;
      case 'first-gem':
      case 'hundred-gems':
      case 'thousand-gems':
        progress = context.totalGems;
        shouldComplete = context.totalGems >= achievement.target;
        break;
      case 'speed-demon':
        if (context.clickStreak >= 100) {
          shouldComplete = true;
        }
        break;
      default:
        break;
    }

    return {
      ...achievement,
      progress,
      completed: shouldComplete,
    };
  });
}