import { Achievement } from '../types/game';

export const achievementsData: Achievement[] = [
  // Clicking Achievements
  {
    id: 'first-click',
    name: 'First Steps',
    description: 'Make your first click',
    target: 1,
    completed: false,
    reward: 10,
    rewardType: 'coins',
    category: 'clicking',
    rarity: 'common',
    hidden: false,
  },
  {
    id: 'hundred-clicks',
    name: 'Click Enthusiast',
    description: 'Click 100 times',
    target: 100,
    completed: false,
    reward: 100,
    rewardType: 'coins',
    category: 'clicking',
    rarity: 'common',
    hidden: false,
  },
  {
    id: 'thousand-clicks',
    name: 'Click Master',
    description: 'Click 1,000 times',
    target: 1000,
    completed: false,
    reward: 500,
    rewardType: 'coins',
    category: 'clicking',
    rarity: 'rare',
    hidden: false,
  },
  {
    id: 'ten-thousand-clicks',
    name: 'Click Legend',
    description: 'Click 10,000 times',
    target: 10000,
    completed: false,
    reward: 50,
    rewardType: 'gems',
    category: 'clicking',
    rarity: 'epic',
    hidden: false,
  },
  {
    id: 'hundred-thousand-clicks',
    name: 'Click God',
    description: 'Click 100,000 times',
    target: 100000,
    completed: false,
    reward: 2,
    rewardType: 'multiplier',
    category: 'clicking',
    rarity: 'legendary',
    hidden: false,
  },
  {
    id: 'million-clicks',
    name: 'Transcendent Clicker',
    description: 'Click 1,000,000 times',
    target: 1000000,
    completed: false,
    reward: 1000,
    rewardType: 'prestige',
    category: 'clicking',
    rarity: 'mythic',
    hidden: false,
  },

  // Earning Achievements
  {
    id: 'hundred-coins',
    name: 'Coin Collector',
    description: 'Earn 100 coins',
    target: 100,
    completed: false,
    reward: 50,
    rewardType: 'coins',
    category: 'earning',
    rarity: 'common',
    hidden: false,
  },
  {
    id: 'thousand-coins',
    name: 'Wealthy',
    description: 'Earn 1,000 coins',
    target: 1000,
    completed: false,
    reward: 200,
    rewardType: 'coins',
    category: 'earning',
    rarity: 'common',
    hidden: false,
  },
  {
    id: 'million-coins',
    name: 'Millionaire',
    description: 'Earn 1,000,000 coins',
    target: 1000000,
    completed: false,
    reward: 100,
    rewardType: 'gems',
    category: 'earning',
    rarity: 'rare',
    hidden: false,
  },
  {
    id: 'billion-coins',
    name: 'Billionaire',
    description: 'Earn 1,000,000,000 coins',
    target: 1000000000,
    completed: false,
    reward: 500,
    rewardType: 'gems',
    category: 'earning',
    rarity: 'epic',
    hidden: false,
  },
  {
    id: 'trillion-coins',
    name: 'Trillionaire',
    description: 'Earn 1,000,000,000,000 coins',
    target: 1000000000000,
    completed: false,
    reward: 5,
    rewardType: 'multiplier',
    category: 'earning',
    rarity: 'legendary',
    hidden: false,
  },

  // Gem Achievements
  {
    id: 'first-gem',
    name: 'Gem Hunter',
    description: 'Find your first gem',
    target: 1,
    completed: false,
    reward: 100,
    rewardType: 'coins',
    category: 'earning',
    rarity: 'common',
    hidden: false,
  },
  {
    id: 'hundred-gems',
    name: 'Gem Collector',
    description: 'Collect 100 gems',
    target: 100,
    completed: false,
    reward: 1000,
    rewardType: 'coins',
    category: 'earning',
    rarity: 'rare',
    hidden: false,
  },
  {
    id: 'thousand-gems',
    name: 'Gem Master',
    description: 'Collect 1,000 gems',
    target: 1000,
    completed: false,
    reward: 3,
    rewardType: 'multiplier',
    category: 'earning',
    rarity: 'epic',
    hidden: false,
  },

  // Upgrade Achievements
  {
    id: 'first-upgrade',
    name: 'Upgrader',
    description: 'Buy your first upgrade',
    target: 1,
    completed: false,
    reward: 25,
    rewardType: 'coins',
    category: 'upgrading',
    rarity: 'common',
    hidden: false,
  },
  {
    id: 'ten-upgrades',
    name: 'Upgrade Enthusiast',
    description: 'Buy 10 upgrades',
    target: 10,
    completed: false,
    reward: 500,
    rewardType: 'coins',
    category: 'upgrading',
    rarity: 'common',
    hidden: false,
  },
  {
    id: 'hundred-upgrades',
    name: 'Upgrade Master',
    description: 'Buy 100 upgrades',
    target: 100,
    completed: false,
    reward: 100,
    rewardType: 'gems',
    category: 'upgrading',
    rarity: 'rare',
    hidden: false,
  },

  // Prestige Achievements
  {
    id: 'first-prestige',
    name: 'Ascension',
    description: 'Prestige for the first time',
    target: 1,
    completed: false,
    reward: 1000,
    rewardType: 'coins',
    category: 'prestige',
    rarity: 'rare',
    hidden: false,
  },
  {
    id: 'ten-prestiges',
    name: 'Reborn',
    description: 'Prestige 10 times',
    target: 10,
    completed: false,
    reward: 200,
    rewardType: 'gems',
    category: 'prestige',
    rarity: 'epic',
    hidden: false,
  },

  // Special Achievements
  {
    id: 'critical-master',
    name: 'Critical Master',
    description: 'Get 100 critical hits',
    target: 100,
    completed: false,
    reward: 50,
    rewardType: 'gems',
    category: 'special',
    rarity: 'rare',
    hidden: false,
  },
  {
    id: 'lucky-streak',
    name: 'Lucky Streak',
    description: 'Get 50 lucky clicks',
    target: 50,
    completed: false,
    reward: 25,
    rewardType: 'gems',
    category: 'special',
    rarity: 'rare',
    hidden: false,
  },
  {
    id: 'energy-efficient',
    name: 'Energy Efficient',
    description: 'Spend 10,000 energy',
    target: 10000,
    completed: false,
    reward: 100,
    rewardType: 'gems',
    category: 'special',
    rarity: 'epic',
    hidden: false,
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Click 100 times in 10 seconds',
    target: 100,
    completed: false,
    reward: 500,
    rewardType: 'coins',
    category: 'special',
    rarity: 'epic',
    hidden: false,
  },
  {
    id: 'idle-master',
    name: 'Idle Master',
    description: 'Earn 1M coins without clicking for 1 hour',
    target: 1000000,
    completed: false,
    reward: 200,
    rewardType: 'gems',
    category: 'special',
    rarity: 'legendary',
    hidden: false,
  },

  // Hidden Achievements
  {
    id: 'secret-combo',
    name: '???',
    description: 'Discover the secret combination',
    target: 1,
    completed: false,
    reward: 1000,
    rewardType: 'gems',
    category: 'special',
    rarity: 'mythic',
    hidden: true,
  },
  {
    id: 'time-traveler',
    name: 'Time Traveler',
    description: 'Play for 24 hours total',
    target: 86400000,
    completed: false,
    reward: 10,
    rewardType: 'multiplier',
    category: 'special',
    rarity: 'legendary',
    hidden: true,
  },
];