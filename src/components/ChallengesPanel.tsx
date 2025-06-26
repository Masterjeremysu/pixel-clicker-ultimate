import React from 'react';
import { Target, Clock, Zap, TrendingUp } from 'lucide-react';
import { Challenge } from '../types/game';

interface ChallengesPanelProps {
  challenges: Challenge[];
  onStartChallenge: (challengeId: string) => void;
}

export const ChallengesPanel: React.FC<ChallengesPanelProps> = ({ challenges, onStartChallenge }) => {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-500 to-emerald-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'hard': return 'from-red-500 to-pink-500';
      case 'extreme': return 'from-purple-500 to-indigo-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'clicks': return Zap;
      case 'coins': return TrendingUp;
      case 'time': return Clock;
      case 'efficiency': return Target;
      default: return Target;
    }
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
      <h2 className="text-xl font-mono font-bold text-white mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-cyan-400" />
        Challenges
      </h2>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {challenges.map(challenge => {
          const Icon = getTypeIcon(challenge.type);
          const difficultyColor = getDifficultyColor(challenge.difficulty);
          const progressPercentage = (challenge.progress / challenge.target) * 100;
          
          return (
            <div
              key={challenge.id}
              className={`p-4 rounded-xl border transition-all ${
                challenge.completed
                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30'
                  : challenge.active
                  ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30'
                  : 'bg-gray-800/50 border-gray-600/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${difficultyColor}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-mono font-bold text-white">{challenge.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-mono ${
                      challenge.difficulty === 'extreme' ? 'bg-purple-500/20 text-purple-400' :
                      challenge.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' :
                      challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {challenge.difficulty.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm font-mono mb-2">{challenge.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${difficultyColor} h-2 rounded-full transition-all`}
                        style={{ width: `${Math.min(100, progressPercentage)}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-400 font-mono">
                        {challenge.progress.toLocaleString()}/{challenge.target.toLocaleString()}
                      </span>
                      {challenge.timeLimit && (
                        <span className="text-xs text-gray-400 font-mono">
                          {formatTime(challenge.timeLimit)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 text-sm font-mono font-bold">
                      +{challenge.reward} {challenge.rewardType}
                    </span>
                    
                    {!challenge.completed && !challenge.active && (
                      <button
                        onClick={() => onStartChallenge(challenge.id)}
                        className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-mono text-xs hover:from-cyan-400 hover:to-blue-400 transition-all"
                      >
                        Start
                      </button>
                    )}
                    
                    {challenge.active && (
                      <span className="text-blue-400 font-mono text-xs animate-pulse">
                        ACTIVE
                      </span>
                    )}
                    
                    {challenge.completed && (
                      <span className="text-green-400 font-mono text-xs">
                        ✓ COMPLETED
                      </span>
                    )}
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