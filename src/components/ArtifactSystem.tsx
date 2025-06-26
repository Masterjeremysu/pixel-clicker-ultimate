import React, { useState } from 'react';
import { Sword, Shield, Gem, Star, Plus, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Artifact, ArtifactStat } from '../types/game';

interface ArtifactSystemProps {
  artifacts: Artifact[];
  onEquipArtifact: (artifactId: string) => void;
  onUpgradeArtifact: (artifactId: string) => void;
  onForgeArtifact: () => void;
}

export const ArtifactSystem: React.FC<ArtifactSystemProps> = ({
  artifacts,
  onEquipArtifact,
  onUpgradeArtifact,
  onForgeArtifact,
}) => {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(artifacts[0] || null);
  const [filter, setFilter] = useState<'all' | 'weapon' | 'armor' | 'accessory' | 'relic'>('all');

  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'weapon': return Sword;
      case 'armor': return Shield;
      case 'accessory': return Gem;
      case 'relic': return Star;
      default: return Zap;
    }
  };

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

  const getStatIcon = (statType: string) => {
    switch (statType) {
      case 'clickPower': return '👆';
      case 'coinMultiplier': return '💰';
      case 'gemChance': return '💎';
      case 'energyRegen': return '⚡';
      case 'criticalChance': return '💥';
      default: return '📊';
    }
  };

  const formatStatValue = (stat: ArtifactStat) => {
    return stat.percentage ? `+${stat.value}%` : `+${stat.value}`;
  };

  const filteredArtifacts = artifacts.filter(artifact => 
    filter === 'all' || artifact.type === filter
  );

  const equippedArtifacts = artifacts.filter(artifact => artifact.isEquipped);
  const totalPower = artifacts.reduce((sum, artifact) => 
    artifact.isEquipped ? sum + artifact.level * 10 : sum, 0
  );

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
            <Sword className="w-6 h-6 text-cyan-400" />
            Artifacts
          </h2>
          <p className="text-gray-400 font-mono text-sm">
            Total Power: {totalPower} | Equipped: {equippedArtifacts.length}/6
          </p>
        </div>
        <button
          onClick={onForgeArtifact}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-mono font-bold hover:from-orange-400 hover:to-red-400 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Forge
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Artifact Collection */}
        <div className="space-y-4">
          {/* Filter Tabs */}
          <div className="flex gap-2 bg-gray-800/50 rounded-xl p-2">
            {['all', 'weapon', 'armor', 'accessory', 'relic'].map(filterType => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType as any)}
                className={`px-3 py-1 rounded-lg font-mono text-xs transition-colors ${
                  filter === filterType
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>

          {/* Artifacts Grid */}
          {filteredArtifacts.length === 0 ? (
            <div className="p-8 bg-gray-800/50 rounded-xl border border-gray-600/30 text-center">
              <div className="text-6xl mb-4">⚔️</div>
              <h4 className="text-white font-mono font-bold mb-2">No Artifacts</h4>
              <p className="text-gray-400 font-mono text-sm mb-4">
                Forge your first artifact to begin your collection!
              </p>
              <button
                onClick={onForgeArtifact}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-mono font-bold hover:from-orange-400 hover:to-red-400 transition-all"
              >
                Forge Artifact
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {filteredArtifacts.map((artifact, index) => {
                const Icon = getArtifactIcon(artifact.type);
                const rarityColor = getRarityColor(artifact.rarity);
                
                return (
                  <motion.div
                    key={artifact.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedArtifact(artifact)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all hover:scale-105 ${
                      selectedArtifact?.id === artifact.id
                        ? `bg-gradient-to-r ${rarityColor}/20 border-current`
                        : 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50'
                    } ${artifact.isEquipped ? 'ring-2 ring-cyan-400' : ''}`}
                  >
                    <div className="text-center">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${rarityColor} inline-block mb-2`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-white font-mono font-bold text-sm truncate">{artifact.name}</h4>
                      <p className="text-gray-400 font-mono text-xs capitalize">{artifact.rarity}</p>
                      <p className="text-cyan-400 font-mono text-xs">Lv.{artifact.level}</p>
                      
                      {artifact.isEquipped && (
                        <div className="mt-2 px-2 py-1 bg-cyan-500/20 rounded text-xs text-cyan-400 font-mono">
                          EQUIPPED
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Artifact Details */}
        {selectedArtifact && (
          <motion.div
            key={selectedArtifact.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className={`p-4 rounded-xl border bg-gradient-to-r ${getRarityColor(selectedArtifact.rarity)}/20 border-current`}>
              <div className="text-center mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${getRarityColor(selectedArtifact.rarity)} inline-block mb-3`}>
                  {React.createElement(getArtifactIcon(selectedArtifact.type), { className: "w-8 h-8 text-white" })}
                </div>
                <h3 className="text-xl font-mono font-bold text-white">{selectedArtifact.name}</h3>
                <p className="text-gray-300 font-mono text-sm capitalize">
                  {selectedArtifact.rarity} {selectedArtifact.type}
                </p>
                <p className="text-cyan-400 font-mono text-sm">Level {selectedArtifact.level}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-300 font-mono text-sm">{selectedArtifact.description}</p>
              </div>

              {/* Stats */}
              <div className="space-y-2 mb-4">
                <h4 className="text-white font-mono font-bold text-sm">Stats</h4>
                {selectedArtifact.stats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getStatIcon(stat.type)}</span>
                      <span className="text-white font-mono text-sm capitalize">
                        {stat.type.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <span className="text-cyan-400 font-mono font-bold text-sm">
                      {formatStatValue(stat)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Set Bonus */}
              {selectedArtifact.setBonus && (
                <div className="mb-4 p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                  <h5 className="text-purple-400 font-mono font-bold text-xs mb-1">Set Bonus</h5>
                  <p className="text-purple-300 font-mono text-xs">{selectedArtifact.setBonus}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {!selectedArtifact.isEquipped ? (
                  <button
                    onClick={() => onEquipArtifact(selectedArtifact.id)}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-mono text-sm font-bold hover:from-cyan-400 hover:to-blue-400 transition-all"
                  >
                    Equip
                  </button>
                ) : (
                  <button
                    onClick={() => onEquipArtifact(selectedArtifact.id)}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg text-white font-mono text-sm font-bold hover:from-gray-400 hover:to-gray-500 transition-all"
                  >
                    Unequip
                  </button>
                )}
                <button
                  onClick={() => onUpgradeArtifact(selectedArtifact.id)}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-mono text-sm font-bold hover:from-orange-400 hover:to-red-400 transition-all"
                >
                  Upgrade
                </button>
              </div>
            </div>

            {/* Upgrade Preview */}
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
              <h4 className="text-white font-mono font-bold text-sm mb-2">Upgrade Preview</h4>
              <div className="space-y-1">
                {selectedArtifact.stats.map((stat, index) => (
                  <div key={index} className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400 capitalize">
                      {stat.type.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-green-400">
                      {formatStatValue(stat)} → {formatStatValue({
                        ...stat,
                        value: Math.floor(stat.value * 1.1)
                      })}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-yellow-400 font-mono text-xs mt-2">
                Cost: {selectedArtifact.level * 100} gems
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};