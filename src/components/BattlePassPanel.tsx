import React, { useState } from 'react';
import { Trophy, Star, Crown, Gem, Lock, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { BattlePass, BattlePassReward } from '../types/game';

interface BattlePassPanelProps {
  battlePass: BattlePass;
  onClaimReward: (rewardId: string) => void;
  onUpgradeToPremium: () => void;
}

export const BattlePassPanel: React.FC<BattlePassPanelProps> = ({
  battlePass,
  onClaimReward,
  onUpgradeToPremium,
}) => {
  const [selectedTier, setSelectedTier] = useState<'free' | 'premium'>('free');

  const getRewardIcon = (reward: BattlePassReward) => {
    switch (reward.reward.type) {
      case 'coins': return '🪙';
      case 'gems': return '💎';
      case 'cosmetic': return '👑';
      case 'boost': return '⚡';
      case 'pet': return '🐾';
      case 'artifact': return '⚔️';
      default: return '🎁';
    }
  };

  const getRewardColor = (reward: BattlePassReward) => {
    if (reward.type === 'premium') {
      return 'from-yellow-500 to-orange-500';
    }
    return 'from-gray-500 to-gray-600';
  };

  const canClaimReward = (reward: BattlePassReward) => {
    return battlePass.level >= reward.level && 
           !reward.claimed && 
           (reward.type === 'free' || battlePass.isPremium);
  };

  const progressPercentage = (battlePass.experience / battlePass.experienceToNext) * 100;

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Battle Pass
          </h2>
          <p className="text-gray-400 font-mono text-sm">Season {battlePass.season}</p>
        </div>
        
        {!battlePass.isPremium && (
          <button
            onClick={onUpgradeToPremium}
            className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-white font-mono font-bold hover:from-yellow-400 hover:to-orange-400 transition-all"
          >
            Upgrade to Premium
          </button>
        )}
      </div>

      {/* Level Progress */}
      <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-600/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-mono font-bold">Level {battlePass.level}</span>
          <span className="text-gray-400 font-mono text-sm">
            {battlePass.experience}/{battlePass.experienceToNext} XP
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <motion.div 
            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Tier Selection */}
      <div className="flex gap-2 mb-6 bg-gray-800/50 rounded-xl p-2">
        <button
          onClick={() => setSelectedTier('free')}
          className={`flex-1 px-4 py-2 rounded-lg font-mono text-sm transition-all flex items-center justify-center gap-2 ${
            selectedTier === 'free'
              ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <Star className="w-4 h-4" />
          Free Tier
        </button>
        <button
          onClick={() => setSelectedTier('premium')}
          className={`flex-1 px-4 py-2 rounded-lg font-mono text-sm transition-all flex items-center justify-center gap-2 ${
            selectedTier === 'premium'
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <Crown className="w-4 h-4" />
          Premium Tier
        </button>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-5 gap-3 max-h-96 overflow-y-auto">
        {battlePass.rewards
          .filter(reward => reward.type === selectedTier)
          .map((reward, index) => {
            const isUnlocked = battlePass.level >= reward.level;
            const isClaimed = reward.claimed;
            const canClaim = canClaimReward(reward);
            
            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`relative p-3 rounded-xl border transition-all ${
                  isClaimed
                    ? 'bg-green-500/20 border-green-500/30'
                    : canClaim
                    ? `bg-gradient-to-r ${getRewardColor(reward)}/20 border-current cursor-pointer hover:scale-105`
                    : 'bg-gray-800/50 border-gray-600/30 opacity-50'
                }`}
                onClick={() => canClaim && onClaimReward(reward.id)}
              >
                {/* Level Badge */}
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs font-mono text-white border-2 border-gray-600">
                  {reward.level}
                </div>

                {/* Reward Icon */}
                <div className="text-2xl mb-2 text-center">
                  {getRewardIcon(reward)}
                </div>

                {/* Reward Amount */}
                {reward.reward.amount && (
                  <p className="text-center font-mono text-xs text-white font-bold">
                    {reward.reward.amount}
                  </p>
                )}

                {/* Status Overlay */}
                {isClaimed && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-xl">
                    <Check className="w-6 h-6 text-green-400" />
                  </div>
                )}

                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-xl">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                )}

                {!battlePass.isPremium && reward.type === 'premium' && (
                  <div className="absolute -top-1 -right-1">
                    <Crown className="w-4 h-4 text-yellow-400" />
                  </div>
                )}
              </motion.div>
            );
          })}
      </div>

      {/* Premium Benefits */}
      {!battlePass.isPremium && (
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
          <h3 className="text-white font-mono font-bold mb-2 flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            Premium Benefits
          </h3>
          <ul className="space-y-1 text-sm font-mono text-gray-300">
            <li>• Unlock premium rewards</li>
            <li>• +50% Battle Pass XP</li>
            <li>• Exclusive cosmetics</li>
            <li>• Priority support</li>
          </ul>
        </div>
      )}
    </div>
  );
};