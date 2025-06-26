import React, { useState } from 'react';
import { Heart, Star, Zap, Gift, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pet, PetAbility } from '../types/game';

interface PetSystemProps {
  pets: Pet[];
  onFeedPet: (petId: string) => void;
  onActivatePet: (petId: string) => void;
  onUseAbility: (petId: string, abilityId: string) => void;
  onSummonPet: () => void;
}

export const PetSystem: React.FC<PetSystemProps> = ({
  pets,
  onFeedPet,
  onActivatePet,
  onUseAbility,
  onSummonPet,
}) => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(pets.find(p => p.isActive) || pets[0] || null);

  const getPetEmoji = (type: string) => {
    const petEmojis: { [key: string]: string } = {
      dragon: '🐉',
      phoenix: '🔥',
      unicorn: '🦄',
      wolf: '🐺',
      cat: '🐱',
      robot: '🤖',
      crystal: '💎',
      ghost: '👻',
    };
    return petEmojis[type] || '🐾';
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

  const getHappinessColor = (happiness: number) => {
    if (happiness >= 80) return 'text-green-400';
    if (happiness >= 60) return 'text-yellow-400';
    if (happiness >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const canUseAbility = (pet: Pet, ability: PetAbility) => {
    const now = Date.now();
    return now - ability.lastUsed >= ability.cooldown;
  };

  const formatCooldown = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-mono font-bold text-white flex items-center gap-2">
          <Heart className="w-6 h-6 text-pink-400" />
          Pet Collection
        </h2>
        <button
          onClick={onSummonPet}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-mono font-bold hover:from-purple-400 hover:to-pink-400 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Summon Pet
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pet Collection */}
        <div className="space-y-4">
          <h3 className="text-lg font-mono font-bold text-white">Your Pets ({pets.length}/10)</h3>
          
          {pets.length === 0 ? (
            <div className="p-8 bg-gray-800/50 rounded-xl border border-gray-600/30 text-center">
              <div className="text-6xl mb-4">🥚</div>
              <h4 className="text-white font-mono font-bold mb-2">No Pets Yet</h4>
              <p className="text-gray-400 font-mono text-sm mb-4">
                Summon your first pet to start your collection!
              </p>
              <button
                onClick={onSummonPet}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-mono font-bold hover:from-purple-400 hover:to-pink-400 transition-all"
              >
                Summon First Pet
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {pets.map((pet, index) => (
                <motion.div
                  key={pet.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedPet(pet)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all hover:scale-105 ${
                    selectedPet?.id === pet.id
                      ? `bg-gradient-to-r ${getRarityColor(pet.rarity)}/20 border-current`
                      : 'bg-gray-800/50 border-gray-600/30 hover:bg-gray-700/50'
                  } ${pet.isActive ? 'ring-2 ring-cyan-400' : ''}`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{getPetEmoji(pet.type)}</div>
                    <h4 className="text-white font-mono font-bold text-sm">{pet.name}</h4>
                    <p className="text-gray-400 font-mono text-xs">Lv.{pet.level}</p>
                    
                    {/* Happiness Bar */}
                    <div className="mt-2">
                      <div className="w-full bg-gray-700 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full transition-all ${
                            pet.happiness >= 80 ? 'bg-green-400' :
                            pet.happiness >= 60 ? 'bg-yellow-400' :
                            pet.happiness >= 40 ? 'bg-orange-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${pet.happiness}%` }}
                        />
                      </div>
                      <p className={`text-xs font-mono mt-1 ${getHappinessColor(pet.happiness)}`}>
                        {pet.happiness}% Happy
                      </p>
                    </div>

                    {pet.isActive && (
                      <div className="mt-2 px-2 py-1 bg-cyan-500/20 rounded text-xs text-cyan-400 font-mono">
                        ACTIVE
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Pet Details */}
        {selectedPet && (
          <motion.div
            key={selectedPet.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className={`p-4 rounded-xl border bg-gradient-to-r ${getRarityColor(selectedPet.rarity)}/20 border-current`}>
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">{getPetEmoji(selectedPet.type)}</div>
                <h3 className="text-xl font-mono font-bold text-white">{selectedPet.name}</h3>
                <p className="text-gray-300 font-mono text-sm capitalize">{selectedPet.rarity} {selectedPet.type}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-cyan-400 font-mono text-lg font-bold">{selectedPet.level}</p>
                  <p className="text-gray-400 font-mono text-xs">Level</p>
                </div>
                <div className="text-center">
                  <p className="text-purple-400 font-mono text-lg font-bold">{selectedPet.experience}</p>
                  <p className="text-gray-400 font-mono text-xs">Experience</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onFeedPet(selectedPet.id)}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white font-mono text-sm font-bold hover:from-green-400 hover:to-emerald-400 transition-all"
                >
                  Feed Pet
                </button>
                {!selectedPet.isActive && (
                  <button
                    onClick={() => onActivatePet(selectedPet.id)}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-mono text-sm font-bold hover:from-cyan-400 hover:to-blue-400 transition-all"
                  >
                    Activate
                  </button>
                )}
              </div>
            </div>

            {/* Pet Abilities */}
            <div className="space-y-2">
              <h4 className="text-white font-mono font-bold">Abilities</h4>
              {selectedPet.abilities.map(ability => {
                const canUse = canUseAbility(selectedPet, ability);
                const cooldownRemaining = ability.cooldown - (Date.now() - ability.lastUsed);
                
                return (
                  <div key={ability.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="text-white font-mono font-bold text-sm">{ability.name}</h5>
                        <p className="text-gray-400 font-mono text-xs">{ability.description}</p>
                      </div>
                      <button
                        onClick={() => canUse && onUseAbility(selectedPet.id, ability.id)}
                        disabled={!canUse}
                        className={`px-3 py-1 rounded font-mono text-xs font-bold transition-all ${
                          canUse
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-400 hover:to-orange-400'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {canUse ? 'Use' : formatCooldown(cooldownRemaining)}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};