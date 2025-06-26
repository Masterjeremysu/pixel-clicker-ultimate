import React from 'react';
import { Factory, Gem, Zap, FlaskConical, Cpu, Rocket, Clock, Atom } from 'lucide-react';

interface BuildingsPanelProps {
  coins: number;
  buildings: any;
  onBuyBuilding: (buildingType: string, cost: number) => void;
}

export const BuildingsPanel: React.FC<BuildingsPanelProps> = ({ coins, buildings, onBuyBuilding }) => {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  const buildingData = [
    {
      id: 'coinMine',
      name: 'Coin Mine',
      description: 'Generates 1 coin/sec',
      icon: Factory,
      baseCost: 100,
      owned: buildings.coinMines,
      color: 'from-yellow-500 to-orange-500',
      borderColor: 'border-yellow-500/30',
    },
    {
      id: 'gemFactory',
      name: 'Gem Factory',
      description: 'Produces 0.1 gems/sec',
      icon: Gem,
      baseCost: 1000,
      owned: buildings.gemFactories,
      color: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-500/30',
    },
    {
      id: 'energyPlant',
      name: 'Energy Plant',
      description: 'Generates 2 energy/sec',
      icon: Zap,
      baseCost: 5000,
      owned: buildings.energyPlants,
      color: 'from-cyan-500 to-blue-500',
      borderColor: 'border-cyan-500/30',
    },
    {
      id: 'researchLab',
      name: 'Research Lab',
      description: 'Boosts all production by 10%',
      icon: FlaskConical,
      baseCost: 50000,
      owned: buildings.researchLabs,
      color: 'from-green-500 to-emerald-500',
      borderColor: 'border-green-500/30',
    },
    {
      id: 'quantumComputer',
      name: 'Quantum Computer',
      description: 'Exponential production boost',
      icon: Cpu,
      baseCost: 1000000,
      owned: buildings.quantumComputers,
      color: 'from-indigo-500 to-purple-500',
      borderColor: 'border-indigo-500/30',
    },
    {
      id: 'spaceStation',
      name: 'Space Station',
      description: 'Orbital coin collection (100/sec)',
      icon: Rocket,
      baseCost: 10000000,
      owned: buildings.spaceStations || 0,
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-500/30',
    },
    {
      id: 'timeMachine',
      name: 'Time Machine',
      description: 'Future coin harvesting (1K/sec)',
      icon: Clock,
      baseCost: 100000000,
      owned: buildings.timeMachines || 0,
      color: 'from-orange-500 to-red-500',
      borderColor: 'border-orange-500/30',
    },
    {
      id: 'dimensionalRift',
      name: 'Dimensional Rift',
      description: 'Parallel universe wealth (10K/sec)',
      icon: Atom,
      baseCost: 1000000000,
      owned: buildings.dimensionalRifts || 0,
      color: 'from-pink-500 to-rose-500',
      borderColor: 'border-pink-500/30',
    },
  ];

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
      <h2 className="text-xl font-mono font-bold text-white mb-4 flex items-center gap-2">
        <Factory className="w-5 h-5 text-cyan-400" />
        Buildings
      </h2>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {buildingData.map((building) => {
          const cost = Math.floor(building.baseCost * Math.pow(1.15, building.owned));
          const canAfford = coins >= cost;
          const Icon = building.icon;
          
          return (
            <button
              key={building.id}
              onClick={() => canAfford && onBuyBuilding(building.id, cost)}
              disabled={!canAfford}
              className={`
                w-full p-4 rounded-xl border transition-all duration-200
                ${canAfford 
                  ? `bg-gradient-to-r ${building.color}/20 ${building.borderColor} hover:${building.color}/30 hover:scale-105` 
                  : 'bg-gray-800/50 border-gray-600/30 opacity-50 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${building.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono font-bold text-white">{building.name}</h3>
                    {building.owned > 0 && (
                      <span className="px-2 py-1 bg-gray-700 rounded-full text-xs font-mono text-gray-300">
                        {building.owned}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm font-mono">{building.description}</p>
                  <p className="text-yellow-400 font-mono font-bold mt-1">
                    {formatNumber(cost)} coins
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};