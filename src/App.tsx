import React, { useState, useEffect } from 'react';
import { Share2, RotateCcw, Volume2, VolumeX, Settings, Trophy, Target, Factory, Users, Crown, Heart, Globe, Sword } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Confetti from 'react-confetti';
import { useGameState } from './hooks/useGameState';
import { ClickButton } from './components/ClickButton';
import { StatsPanel } from './components/StatsPanel';
import { UpgradeShop } from './components/UpgradeShop';
import { BuildingsPanel } from './components/BuildingsPanel';
import { AchievementsPanel } from './components/AchievementsPanel';
import { ChallengesPanel } from './components/ChallengesPanel';
import { AchievementNotification } from './components/AchievementNotification';
import { ParticleSystem } from './components/ParticleSystem';
import { MultiplayerHub } from './components/MultiplayerHub';
import { BattlePassPanel } from './components/BattlePassPanel';
import { PetSystem } from './components/PetSystem';
import { WorldEventsPanel } from './components/WorldEventsPanel';
import { ArtifactSystem } from './components/ArtifactSystem';

function App() {
  const { 
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
  } = useGameState();

  const [newAchievement, setNewAchievement] = useState(null);
  const [clickTrigger, setClickTrigger] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check for new achievements
  useEffect(() => {
    const unnotifiedAchievement = gameState.achievements.find(
      achievement => achievement.completed && !achievement.id.includes('notified')
    );
    
    if (unnotifiedAchievement) {
      setNewAchievement(unnotifiedAchievement);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [gameState.achievements]);

  const handleMainClick = () => {
    handleClick();
    setClickTrigger(prev => !prev);
  };

  const handleShare = () => {
    const shareText = `🎮 I just reached Level ${gameState.level} with ${formatNumber(gameState.totalCoins)} total coins in Pixel Clicker! 💎 Can you beat my score?`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Pixel Clicker - My Progress',
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      alert('Share text copied to clipboard!');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  const canPrestige = gameState.totalCoins >= 1000000;
  const prestigePoints = Math.floor(Math.sqrt(gameState.totalCoins / 1000000));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white overflow-x-hidden">
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            fontFamily: 'monospace',
          },
        }}
      />

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative z-20 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            PIXEL CLICKER ULTIMATE
          </h1>
          <div className="flex items-center gap-4 text-sm font-mono text-gray-400">
            <span>Level {gameState.level} • {formatNumber(gameState.experience)}/{formatNumber(gameState.experienceToNext)} EXP</span>
            <span>•</span>
            <span className="text-cyan-400">{gameState.player?.username || 'Player'}</span>
            {gameState.guild && (
              <>
                <span>•</span>
                <span className="text-purple-400">[{gameState.guild.name}]</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-gray-800/50 rounded-lg border border-gray-600/30 hover:bg-gray-700/50 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          
          <button
            onClick={handleShare}
            className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>
          
          {canPrestige && (
            <motion.button
              onClick={prestige}
              className="px-3 py-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg hover:from-orange-500 hover:to-red-500 transition-all font-mono text-sm font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              PRESTIGE (+{prestigePoints})
            </motion.button>
          )}
          
          <button
            onClick={resetGame}
            className="p-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg hover:from-red-500 hover:to-orange-500 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="relative z-10 container mx-auto px-4 pb-8">
        {/* Currency Display */}
        <motion.div 
          className="flex justify-center gap-4 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-500/30">
            <p className="text-yellow-400 font-mono text-sm mb-1">Coins</p>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-yellow-300">
              {formatNumber(gameState.coins)}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-4 border border-purple-500/30">
            <p className="text-purple-400 font-mono text-sm mb-1">Gems</p>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-purple-300">
              {formatNumber(gameState.gems)}
            </p>
          </div>

          {gameState.prestige.level > 0 && (
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl p-4 border border-red-500/30">
              <p className="text-red-400 font-mono text-sm mb-1">Prestige</p>
              <p className="text-2xl sm:text-3xl font-mono font-bold text-red-300">
                {gameState.prestige.level}
              </p>
            </div>
          )}
        </motion.div>

        {/* Click Button */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ClickButton 
            onClick={handleMainClick} 
            clickPower={gameState.clickPower * gameState.prestige.multiplier}
            energy={gameState.energy}
            maxEnergy={gameState.maxEnergy}
          />
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-gray-800/50 rounded-2xl p-2 border border-gray-600/30 flex flex-wrap gap-1">
            {[
              { id: 'stats', label: 'Stats', icon: Settings },
              { id: 'upgrades', label: 'Upgrades', icon: Settings },
              { id: 'buildings', label: 'Buildings', icon: Factory },
              { id: 'achievements', label: 'Achievements', icon: Trophy },
              { id: 'challenges', label: 'Challenges', icon: Target },
              { id: 'multiplayer', label: 'Multiplayer', icon: Users },
              { id: 'battlepass', label: 'Battle Pass', icon: Crown },
              { id: 'pets', label: 'Pets', icon: Heart },
              { id: 'worldevents', label: 'Events', icon: Globe },
              { id: 'artifacts', label: 'Artifacts', icon: Sword },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-xl font-mono text-xs transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Game Panels */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <StatsPanel gameState={gameState} />
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
                  <h2 className="text-xl font-mono font-bold text-white mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab('upgrades')}
                      className="w-full p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30 transition-all text-left"
                    >
                      <p className="text-white font-mono font-bold">Upgrade Power</p>
                      <p className="text-gray-400 text-sm font-mono">Increase your clicking power and efficiency</p>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('multiplayer')}
                      className="w-full p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all text-left"
                    >
                      <p className="text-white font-mono font-bold">Join Multiplayer</p>
                      <p className="text-gray-400 text-sm font-mono">Compete with players worldwide</p>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('pets')}
                      className="w-full p-3 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-lg border border-pink-500/30 hover:from-pink-500/30 hover:to-rose-500/30 transition-all text-left"
                    >
                      <p className="text-white font-mono font-bold">Collect Pets</p>
                      <p className="text-gray-400 text-sm font-mono">Summon and train magical companions</p>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'upgrades' && (
              <motion.div
                key="upgrades"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <UpgradeShop
                  coins={gameState.coins}
                  gems={gameState.gems}
                  upgrades={gameState.upgrades}
                  onBuyUpgrade={buyUpgrade}
                />
              </motion.div>
            )}
            
            {activeTab === 'buildings' && (
              <motion.div
                key="buildings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <BuildingsPanel
                  coins={gameState.coins}
                  buildings={gameState.buildings}
                  onBuyBuilding={buyBuilding}
                />
              </motion.div>
            )}
            
            {activeTab === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AchievementsPanel achievements={gameState.achievements} />
              </motion.div>
            )}
            
            {activeTab === 'challenges' && (
              <motion.div
                key="challenges"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ChallengesPanel 
                  challenges={gameState.challenges}
                  onStartChallenge={(id) => console.log('Start challenge:', id)}
                />
              </motion.div>
            )}

            {activeTab === 'multiplayer' && (
              <motion.div
                key="multiplayer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <MultiplayerHub
                  gameState={gameState}
                  onJoinGuild={joinGuild}
                  onCreateGuild={createGuild}
                  onJoinTournament={joinTournament}
                  onSendGift={sendGift}
                />
              </motion.div>
            )}

            {activeTab === 'battlepass' && (
              <motion.div
                key="battlepass"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <BattlePassPanel
                  battlePass={gameState.battlePass}
                  onClaimReward={claimBattlePassReward}
                  onUpgradeToPremium={upgradeToPremium}
                />
              </motion.div>
            )}

            {activeTab === 'pets' && (
              <motion.div
                key="pets"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <PetSystem
                  pets={gameState.pets}
                  onFeedPet={feedPet}
                  onActivatePet={activatePet}
                  onUseAbility={usePetAbility}
                  onSummonPet={summonPet}
                />
              </motion.div>
            )}

            {activeTab === 'worldevents' && (
              <motion.div
                key="worldevents"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <WorldEventsPanel
                  worldEvents={gameState.worldEvents}
                  onParticipate={participateWorldEvent}
                  onClaimReward={claimWorldEventReward}
                />
              </motion.div>
            )}

            {activeTab === 'artifacts' && (
              <motion.div
                key="artifacts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ArtifactSystem
                  artifacts={gameState.artifacts}
                  onEquipArtifact={equipArtifact}
                  onUpgradeArtifact={upgradeArtifact}
                  onForgeArtifact={forgeArtifact}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Particle System */}
      <ParticleSystem 
        trigger={clickTrigger}
        centerX={window.innerWidth / 2}
        centerY={window.innerHeight / 2}
      />

      {/* Achievement Notification */}
      <AchievementNotification
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />
    </div>
  );
}

export default App;