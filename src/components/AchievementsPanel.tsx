import React, { useState } from 'react';
import { Trophy, Star, Crown, Gem, Zap, Target } from 'lucide-react';
import { Achievement } from '../types/game';

interface AchievementsPanelProps {
  achievements: Achievement[];
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ achievements }) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-orange-500 to-red-600';
      case 'mythic': return 'from-pink-500 to-rose-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return Star;
      case 'rare': return Trophy;
      case 'epic': return Crown;
      case 'legendary': return Gem;
      case 'mythic': return Zap;
      default: return Star;
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (achievement.hidden && !achievement.completed) return false;
    
    if (filter === 'completed' && !achievement.completed) return false;
    if (filter === 'locked' && achievement.completed) return false;
    
    if (categoryFilter !== 'all' && achievement.category !== categoryFilter) return false;
    
    return true;
  });

  const categories = ['all', 'clicking', 'earning', 'upgrading', 'prestige', 'special', 'social'];
  const completedCount = achievements.filter(a => a.completed).length;

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-mono font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-cyan-400" />
          Achievements
        </h2>
        <span className="text-cyan-400 font-mono text-sm">
          {completedCount}/{achievements.length}
        </span>
      </div>

      {/* Filters */}
      <div className="mb-4 space-y-2">
        <div className="flex gap-2 flex-wrap">
          {['all', 'completed', 'locked'].map(filterType => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType as any)}
              className={`px-3 py-1 rounded-lg font-mono text-xs transition-colors ${
                filter === filterType
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                categoryFilter === category
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {filteredAchievements.map(achievement => {
          const Icon = getRarityIcon(achievement.rarity);
          const rarityColor = getRarityColor(achievement.rarity);
          
          return (
            <div
              key={achievement.id}
              className={`p-3 rounded-lg border transition-all ${
                achievement.completed
                  ? `bg-gradient-to-r ${rarityColor}/20 border-current`
                  : 'bg-gray-800/50 border-gray-600/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${rarityColor} flex-shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-mono font-bold text-sm text-white truncate">
                    {achievement.hidden && !achievement.completed ? '???' : achievement.name}
                  </h3>
                  <p className="text-gray-400 text-xs font-mono">
                    {achievement.hidden && !achievement.completed ? 'Hidden achievement' : achievement.description}
                  </p>
                  
                  {/* Progress Bar */}
                  {achievement.progress !== undefined && !achievement.completed && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-700 rounded-full h-1">
                        <div 
                          className="bg-cyan-400 h-1 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 font-mono mt-1">
                        {achievement.progress?.toLocaleString()}/{achievement.target.toLocaleString()}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-yellow-400 text-xs font-mono">
                      +{achievement.reward} {achievement.rewardType}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-mono capitalize ${
                        achievement.rarity === 'mythic' ? 'text-pink-400' :
                        achievement.rarity === 'legendary' ? 'text-orange-400' :
                        achievement.rarity === 'epic' ? 'text-purple-400' :
                        achievement.rarity === 'rare' ? 'text-blue-400' :
                        'text-gray-400'
                      }`}>
                        {achievement.rarity}
                      </span>
                      <span className={`text-xs font-mono ${achievement.completed ? 'text-green-400' : 'text-gray-500'}`}>
                        {achievement.completed ? '✓' : 'Locked'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};