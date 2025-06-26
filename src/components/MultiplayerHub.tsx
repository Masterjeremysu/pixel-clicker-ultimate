import React, { useState, useEffect } from 'react';
import { Users, Trophy, Sword, Gift, MessageCircle, Crown, Star, Zap, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState, LeaderboardEntry, GuildInfo, Tournament } from '../types/game';

interface MultiplayerHubProps {
  gameState: GameState;
  onJoinGuild: (guildId: string) => void;
  onCreateGuild: (name: string, description: string) => void;
  onJoinTournament: (tournamentId: string) => void;
  onSendGift: (playerId: string, giftType: string) => void;
}

export const MultiplayerHub: React.FC<MultiplayerHubProps> = ({
  gameState,
  onJoinGuild,
  onCreateGuild,
  onJoinTournament,
  onSendGift,
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'guild' | 'tournaments' | 'social'>('leaderboard');
  const [showCreateGuild, setShowCreateGuild] = useState(false);
  const [guildName, setGuildName] = useState('');
  const [guildDescription, setGuildDescription] = useState('');

  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-orange-400';
    if (rank <= 10) return 'text-purple-400';
    if (rank <= 100) return 'text-blue-400';
    return 'text-gray-400';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const handleCreateGuild = () => {
    if (guildName.trim() && guildDescription.trim()) {
      onCreateGuild(guildName.trim(), guildDescription.trim());
      setShowCreateGuild(false);
      setGuildName('');
      setGuildDescription('');
    }
  };

  const handleAcceptFriendRequest = (requestId: string) => {
    // Implementation would update the friend request status
    console.log('Accept friend request:', requestId);
  };

  const handleDeclineFriendRequest = (requestId: string) => {
    // Implementation would update the friend request status
    console.log('Decline friend request:', requestId);
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-cyan-400" />
          Multiplayer Hub
        </h2>
        <div className="flex items-center gap-2 text-sm font-mono">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400">Online: 47,392</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 bg-gray-800/50 rounded-xl p-2">
        {[
          { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
          { id: 'guild', label: 'Guild', icon: Crown },
          { id: 'tournaments', label: 'Tournaments', icon: Sword },
          { id: 'social', label: 'Social', icon: MessageCircle },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-2 rounded-lg font-mono text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-mono font-bold text-white">Global Leaderboard</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-cyan-500/20 rounded-lg text-cyan-400 font-mono text-xs">
                  Daily
                </button>
                <button className="px-3 py-1 bg-gray-700 rounded-lg text-gray-400 font-mono text-xs">
                  Weekly
                </button>
                <button className="px-3 py-1 bg-gray-700 rounded-lg text-gray-400 font-mono text-xs">
                  All Time
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {gameState.leaderboard.slice(0, 20).map((entry, index) => (
                <motion.div
                  key={entry.playerId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-lg border transition-all hover:scale-105 cursor-pointer ${
                    entry.playerId === gameState.player.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30'
                      : 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`text-2xl font-mono font-bold ${getRankColor(entry.rank)}`}>
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {entry.username.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono font-bold">{entry.username}</span>
                        {entry.guild && (
                          <span className="px-2 py-1 bg-purple-500/20 rounded text-xs text-purple-400 font-mono">
                            [{entry.guild}]
                          </span>
                        )}
                        <span className="text-xs">{entry.country}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-yellow-400 font-mono">{formatNumber(entry.score)} coins</span>
                        {entry.change !== 0 && (
                          <span className={`font-mono text-xs ${
                            entry.change > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {entry.change > 0 ? '+' : ''}{entry.change}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {entry.playerId !== gameState.player.id && (
                      <button
                        onClick={() => onSendGift(entry.playerId, 'energy')}
                        className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg hover:from-pink-400 hover:to-rose-400 transition-all"
                      >
                        <Gift className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'guild' && (
          <motion.div
            key="guild"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {gameState.guild ? (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-mono font-bold text-white">{gameState.guild.name}</h3>
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-mono">Lv.{gameState.guild.level}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 font-mono text-sm mb-3">{gameState.guild.description}</p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-cyan-400 font-mono text-lg font-bold">{gameState.guild.members.length}</p>
                      <p className="text-gray-400 font-mono text-xs">Members</p>
                    </div>
                    <div>
                      <p className="text-purple-400 font-mono text-lg font-bold">{formatNumber(gameState.guild.totalPower)}</p>
                      <p className="text-gray-400 font-mono text-xs">Total Power</p>
                    </div>
                    <div>
                      <p className="text-yellow-400 font-mono text-lg font-bold">{formatNumber(gameState.guild.treasury)}</p>
                      <p className="text-gray-400 font-mono text-xs">Treasury</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-white font-mono font-bold">Guild Members</h4>
                  {gameState.guild.members.map(member => (
                    <div key={member.playerId} className="p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                            {member.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-mono">{member.username}</span>
                              {member.role === 'leader' && <Crown className="w-4 h-4 text-yellow-400" />}
                              {member.role === 'officer' && <Star className="w-4 h-4 text-blue-400" />}
                            </div>
                            <p className="text-gray-400 font-mono text-xs">
                              Contribution: {formatNumber(member.contribution)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 font-mono text-xs">
                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="p-8 bg-gray-800/50 rounded-xl border border-gray-600/30">
                  <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-mono font-bold text-white mb-2">Join a Guild</h3>
                  <p className="text-gray-400 font-mono text-sm mb-6">
                    Team up with other players to unlock exclusive rewards and compete in guild wars!
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setShowCreateGuild(true)}
                      className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-mono font-bold hover:from-purple-400 hover:to-pink-400 transition-all"
                    >
                      Create Guild
                    </button>
                    <button 
                      onClick={() => onJoinGuild('mock-guild-1')}
                      className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-mono font-bold hover:from-cyan-400 hover:to-blue-400 transition-all"
                    >
                      Browse Guilds
                    </button>
                  </div>
                </div>

                {/* Available Guilds */}
                <div className="space-y-2">
                  <h4 className="text-white font-mono font-bold text-left">Available Guilds</h4>
                  {[
                    { id: 'guild-1', name: 'Les Clickers Légendaires', members: 45, level: 8, power: 15000000 },
                    { id: 'guild-2', name: 'Pixel Warriors', members: 32, level: 6, power: 8500000 },
                    { id: 'guild-3', name: 'Gem Hunters', members: 28, level: 5, power: 6200000 },
                  ].map(guild => (
                    <div key={guild.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-white font-mono font-bold">{guild.name}</h5>
                          <p className="text-gray-400 font-mono text-xs">
                            {guild.members}/50 members • Level {guild.level} • {formatNumber(guild.power)} power
                          </p>
                        </div>
                        <button
                          onClick={() => onJoinGuild(guild.id)}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white font-mono text-sm font-bold hover:from-green-400 hover:to-emerald-400 transition-all"
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'tournaments' && (
          <motion.div
            key="tournaments"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-mono font-bold text-white">Active Tournaments</h3>
              <div className="flex items-center gap-2 text-sm font-mono text-cyan-400">
                <Zap className="w-4 h-4" />
                <span>Live Events</span>
              </div>
            </div>

            <div className="space-y-3">
              {gameState.tournaments.map(tournament => (
                <div key={tournament.id} className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-white font-mono font-bold">{tournament.name}</h4>
                      <p className="text-gray-300 font-mono text-sm">{tournament.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="px-3 py-1 bg-orange-500 rounded-full text-white font-mono text-xs font-bold">
                        {tournament.status.toUpperCase()}
                      </div>
                      <p className="text-gray-400 font-mono text-xs mt-1">
                        {tournament.participants.length}/{tournament.maxParticipants} players
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm font-mono">
                      <span className="text-yellow-400">Entry: {tournament.entryFee} gems</span>
                      <span className="text-purple-400">Type: {tournament.type}</span>
                    </div>
                    <button
                      onClick={() => onJoinTournament(tournament.id)}
                      disabled={tournament.status !== 'upcoming'}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-mono font-bold hover:from-orange-400 hover:to-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {tournament.status === 'upcoming' ? 'Join' : tournament.status === 'active' ? 'Active' : 'Ended'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'social' && (
          <motion.div
            key="social"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-5 h-5 text-green-400" />
                  <span className="text-white font-mono font-bold">Daily Gifts</span>
                </div>
                <p className="text-green-400 font-mono text-2xl font-bold">{gameState.socialFeatures.giftsSent}</p>
                <p className="text-gray-400 font-mono text-xs">Sent today</p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-mono font-bold">Friends</span>
                </div>
                <p className="text-blue-400 font-mono text-2xl font-bold">{gameState.player.friends.length}</p>
                <p className="text-gray-400 font-mono text-xs">Online friends</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-mono font-bold">Friend Requests</h4>
              {gameState.socialFeatures.friendRequests.length === 0 ? (
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600/30 text-center">
                  <p className="text-gray-400 font-mono text-sm">No pending friend requests</p>
                </div>
              ) : (
                gameState.socialFeatures.friendRequests.map(request => (
                  <div key={request.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                          {request.fromUsername.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-mono">{request.fromUsername}</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAcceptFriendRequest(request.id)}
                          className="px-3 py-1 bg-green-500 rounded text-white font-mono text-xs hover:bg-green-400 transition-colors"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleDeclineFriendRequest(request.id)}
                          className="px-3 py-1 bg-red-500 rounded text-white font-mono text-xs hover:bg-red-400 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Guild Modal */}
      {showCreateGuild && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-2xl p-6 border border-cyan-500/20 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-mono font-bold text-white">Create Guild</h3>
              <button
                onClick={() => setShowCreateGuild(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-mono text-sm mb-2">Guild Name</label>
                <input
                  type="text"
                  value={guildName}
                  onChange={(e) => setGuildName(e.target.value)}
                  className="w-full p-3 bg-gray-800 rounded-lg border border-gray-600 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  placeholder="Enter guild name..."
                  maxLength={30}
                />
              </div>
              
              <div>
                <label className="block text-white font-mono text-sm mb-2">Description</label>
                <textarea
                  value={guildDescription}
                  onChange={(e) => setGuildDescription(e.target.value)}
                  className="w-full p-3 bg-gray-800 rounded-lg border border-gray-600 text-white font-mono focus:border-cyan-500 focus:outline-none resize-none"
                  placeholder="Enter guild description..."
                  rows={3}
                  maxLength={100}
                />
              </div>
              
              <div className="p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                <p className="text-yellow-400 font-mono text-sm">
                  Cost: 1000 gems
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateGuild(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 rounded-lg text-white font-mono hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGuild}
                  disabled={!guildName.trim() || !guildDescription.trim()}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-mono font-bold hover:from-purple-400 hover:to-pink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};