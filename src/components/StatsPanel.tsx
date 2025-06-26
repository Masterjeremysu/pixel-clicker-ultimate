import React from 'react';
import { Coins, TrendingUp, Target, Trophy, Zap, Gem, Clock, Star } from 'lucide-react';
import { GameState } from '../types/game';

interface StatsPanelProps {
  gameState: GameState;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ gameState }) => {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const completedAchievements = gameState.achievements.filter(a => a.completed).length;
  const coinsPerSecond = gameState.autoClickers * gameState.autoClickerPower * gameState.prestige.multiplier +
                        gameState.buildings.coinMines * 1 * gameState.prestige.multiplier;

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
      <h2 className="text-xl font-mono font-bold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-cyan-400" />
        Statistics
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Current Coins */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-mono text-sm">Coins</span>
          </div>
          <span className="text-yellow-400 font-mono font-bold text-sm">
            {formatNumber(gameState.coins)}
          </span>
        </div>

        {/* Gems */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
          <div className="flex items-center gap-2">
            <Gem className="w-4 h-4 text-purple-400" />
            <span className="text-white font-mono text-sm">Gems</span>
          </div>
          <span className="text-purple-400 font-mono font-bold text-sm">
            {formatNumber(gameState.gems)}
          </span>
        </div>

        {/* Level */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-green-400" />
            <span className="text-white font-mono text-sm">Level</span>
          </div>
          <span className="text-green-400 font-mono font-bold text-sm">
            {gameState.level}
          </span>
        </div>

        {/* Experience */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-white font-mono text-sm">EXP</span>
          </div>
          <span className="text-blue-400 font-mono font-bold text-sm">
            {gameState.experience}/{gameState.experienceToNext}
          </span>
        </div>

        {/* Total Coins */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-white font-mono text-sm">Total</span>
          </div>
          <span className="text-green-400 font-mono font-bold text-sm">
            {formatNumber(gameState.totalCoins)}
          </span>
        </div>

        {/* Coins per Second */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-mono text-sm">Per/Sec</span>
          </div>
          <span className="text-cyan-400 font-mono font-bold text-sm">
            {formatNumber(coinsPerSecond)}
          </span>
        </div>

        {/* Energy */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-white font-mono text-sm">Energy</span>
          </div>
          <span className="text-orange-400 font-mono font-bold text-sm">
            {gameState.energy}/{gameState.maxEnergy}
          </span>
        </div>

        {/* Achievements */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-purple-400" />
            <span className="text-white font-mono text-sm">Achievements</span>
          </div>
          <span className="text-purple-400 font-mono font-bold text-sm">
            {completedAchievements}/{gameState.achievements.length}
          </span>
        </div>

        {/* Play Time */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-500/30 sm:col-span-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span className="text-white font-mono text-sm">Play Time</span>
          </div>
          <span className="text-indigo-400 font-mono font-bold text-sm">
            {formatTime(gameState.statistics.totalTimePlayedMs)}
          </span>
        </div>

        {/* Prestige Info */}
        {gameState.prestige.level > 0 && (
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg border border-red-500/30 sm:col-span-2">
            <span className="text-white font-mono text-sm">Prestige Multiplier</span>
            <span className="text-red-400 font-mono font-bold text-sm">
              {gameState.prestige.multiplier.toFixed(1)}x
            </span>
          </div>
        )}
      </div>

      {/* Detailed Statistics */}
      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <h3 className="text-sm font-mono font-bold text-gray-300 mb-2">Detailed Stats</h3>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="text-gray-400">Total Clicks: <span className="text-white">{gameState.statistics.totalClicks.toLocaleString()}</span></div>
          <div className="text-gray-400">Critical Hits: <span className="text-red-400">{gameState.statistics.criticalHits.toLocaleString()}</span></div>
          <div className="text-gray-400">Lucky Clicks: <span className="text-yellow-400">{gameState.statistics.luckyClicks.toLocaleString()}</span></div>
          <div className="text-gray-400">Upgrades Bought: <span className="text-blue-400">{gameState.statistics.totalUpgradesPurchased.toLocaleString()}</span></div>
          <div className="text-gray-400">Buildings Built: <span className="text-green-400">{gameState.statistics.totalBuildingsBuilt.toLocaleString()}</span></div>
          <div className="text-gray-400">Prestiges: <span className="text-purple-400">{gameState.statistics.prestigeCount.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
};