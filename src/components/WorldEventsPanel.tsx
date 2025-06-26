import React, { useState, useEffect } from 'react';
import { Globe, Target, Clock, Users, Trophy, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { WorldEvent } from '../types/game';

interface WorldEventsPanelProps {
  worldEvents: WorldEvent[];
  onParticipate: (eventId: string) => void;
  onClaimReward: (eventId: string, rewardId: string) => void;
}

export const WorldEventsPanel: React.FC<WorldEventsPanelProps> = ({
  worldEvents,
  onParticipate,
  onClaimReward,
}) => {
  const [timeLeft, setTimeLeft] = useState<{ [eventId: string]: number }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newTimeLeft: { [eventId: string]: number } = {};
      
      worldEvents.forEach(event => {
        if (event.isActive) {
          newTimeLeft[event.id] = Math.max(0, event.endTime - now);
        }
      });
      
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [worldEvents]);

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

  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'boss_raid': return '👹';
      case 'double_rewards': return '💰';
      case 'special_shop': return '🏪';
      case 'community_goal': return '🎯';
      default: return '🌍';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'boss_raid': return 'from-red-500 to-orange-500';
      case 'double_rewards': return 'from-yellow-500 to-orange-500';
      case 'special_shop': return 'from-purple-500 to-pink-500';
      case 'community_goal': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const activeEvents = worldEvents.filter(event => event.isActive);
  const upcomingEvents = worldEvents.filter(event => !event.isActive && event.startTime > Date.now());
  const completedEvents = worldEvents.filter(event => !event.isActive && event.endTime < Date.now());

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
          <Globe className="w-6 h-6 text-cyan-400" />
          World Events
        </h2>
        <div className="flex items-center gap-2 text-sm font-mono">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400">{activeEvents.length} Active</span>
        </div>
      </div>

      {/* Active Events */}
      {activeEvents.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-mono font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Active Events
          </h3>
          <div className="space-y-4">
            {activeEvents.map((event, index) => {
              const progressPercentage = (event.globalProgress / event.globalTarget) * 100;
              const playerProgressPercentage = (event.playerProgress / event.globalTarget) * 100;
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border bg-gradient-to-r ${getEventColor(event.type)}/20 border-current`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{getEventIcon(event.type)}</div>
                      <div>
                        <h4 className="text-white font-mono font-bold">{event.name}</h4>
                        <p className="text-gray-300 font-mono text-sm">{event.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="px-3 py-1 bg-red-500 rounded-full text-white font-mono text-xs font-bold animate-pulse">
                        LIVE
                      </div>
                      <p className="text-gray-400 font-mono text-xs mt-1">
                        {formatTime(timeLeft[event.id] || 0)} left
                      </p>
                    </div>
                  </div>

                  {/* Global Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-mono text-sm">Global Progress</span>
                      <span className="text-cyan-400 font-mono text-sm">
                        {formatNumber(event.globalProgress)}/{formatNumber(event.globalTarget)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, progressPercentage)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Player Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-mono text-sm">Your Contribution</span>
                      <span className="text-purple-400 font-mono text-sm">
                        {formatNumber(event.playerProgress)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-pink-500 h-1 rounded-full transition-all"
                        style={{ width: `${Math.min(100, playerProgressPercentage)}%` }}
                      />
                    </div>
                  </div>

                  {/* Rewards */}
                  <div className="mb-4">
                    <h5 className="text-white font-mono font-bold text-sm mb-2">Rewards</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {event.rewards.map((reward, rewardIndex) => (
                        <div
                          key={rewardIndex}
                          className={`p-2 rounded-lg border text-center ${
                            event.globalProgress >= reward.threshold
                              ? reward.claimed
                                ? 'bg-green-500/20 border-green-500/30'
                                : 'bg-yellow-500/20 border-yellow-500/30'
                              : 'bg-gray-800/50 border-gray-600/30 opacity-50'
                          }`}
                        >
                          <p className="text-xs font-mono text-gray-400 mb-1">
                            {formatNumber(reward.threshold)} goal
                          </p>
                          <p className="text-white font-mono text-xs font-bold">
                            {reward.coins > 0 && `${formatNumber(reward.coins)} coins`}
                            {reward.gems > 0 && ` ${formatNumber(reward.gems)} gems`}
                          </p>
                          {event.globalProgress >= reward.threshold && !reward.claimed && (
                            <button
                              onClick={() => onClaimReward(event.id, rewardIndex.toString())}
                              className="mt-1 px-2 py-1 bg-yellow-500 rounded text-white font-mono text-xs"
                            >
                              Claim
                            </button>
                          )}
                          {reward.claimed && (
                            <div className="mt-1 text-green-400 font-mono text-xs">✓ Claimed</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onParticipate(event.id)}
                    className={`w-full px-4 py-2 rounded-lg font-mono font-bold transition-all bg-gradient-to-r ${getEventColor(event.type)} text-white hover:scale-105`}
                  >
                    Participate Now
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-mono font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {upcomingEvents.map(event => (
              <div key={event.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl opacity-50">{getEventIcon(event.type)}</div>
                    <div>
                      <h4 className="text-white font-mono font-bold text-sm">{event.name}</h4>
                      <p className="text-gray-400 font-mono text-xs">{event.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-400 font-mono text-xs">
                      Starts in {formatTime(event.startTime - Date.now())}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Events */}
      {activeEvents.length === 0 && upcomingEvents.length === 0 && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🌍</div>
          <h3 className="text-white font-mono font-bold mb-2">No Active Events</h3>
          <p className="text-gray-400 font-mono text-sm">
            Check back later for exciting world events!
          </p>
        </div>
      )}
    </div>
  );
};