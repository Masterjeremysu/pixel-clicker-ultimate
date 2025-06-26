import React from 'react';
import { ShoppingCart, Zap, Bot, Sparkles, Battery, Gem, Target, Flame, Cpu, Atom } from 'lucide-react';

interface UpgradeShopProps {
  coins: number;
  gems: number;
  upgrades: any;
  onBuyUpgrade: (upgradeType: string, cost: number, costType?: 'coins' | 'gems') => void;
}

export const UpgradeShop: React.FC<UpgradeShopProps> = ({ coins, gems, upgrades, onBuyUpgrade }) => {
  const formatNumber = (num: number) => {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  const upgradeData = [
    {
      id: 'clickPower',
      name: 'Click Power',
      description: 'Double your click power',
      icon: Zap,
      cost: Math.floor(50 * Math.pow(2, upgrades.clickPowerLevel)),
      costType: 'coins' as const,
      level: upgrades.clickPowerLevel,
      color: 'from-yellow-500 to-orange-500',
      borderColor: 'border-yellow-500/30',
    },
    {
      id: 'autoClicker',
      name: 'Auto Clicker',
      description: 'Add 1 auto clicker',
      icon: Bot,
      cost: Math.floor(100 * Math.pow(1.5, upgrades.autoClickerLevel)),
      costType: 'coins' as const,
      level: upgrades.autoClickerLevel,
      color: 'from-cyan-500 to-blue-500',
      borderColor: 'border-cyan-500/30',
    },
    {
      id: 'multiplier',
      name: 'Multiplier',
      description: '+0.5x multiplier to all gains',
      icon: Sparkles,
      cost: Math.floor(1000 * Math.pow(3, upgrades.multiplierLevel)),
      costType: 'coins' as const,
      level: upgrades.multiplierLevel,
      color: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-500/30',
    },
    {
      id: 'energy',
      name: 'Energy Boost',
      description: '+50 max energy, +0.5 regen/sec',
      icon: Battery,
      cost: Math.floor(5000 * Math.pow(2.5, upgrades.energyLevel)),
      costType: 'coins' as const,
      level: upgrades.energyLevel,
      color: 'from-green-500 to-emerald-500',
      borderColor: 'border-green-500/30',
    },
    {
      id: 'gemMiner',
      name: 'Gem Miner',
      description: '+1% chance to find gems',
      icon: Gem,
      cost: 10 + upgrades.gemMinerLevel * 5,
      costType: 'gems' as const,
      level: upgrades.gemMinerLevel,
      color: 'from-purple-600 to-indigo-600',
      borderColor: 'border-purple-600/30',
    },
    {
      id: 'luckyClick',
      name: 'Lucky Click',
      description: '+1% lucky click chance',
      icon: Target,
      cost: 25 + upgrades.luckyClickLevel * 15,
      costType: 'gems' as const,
      level: upgrades.luckyClickLevel,
      color: 'from-yellow-600 to-orange-600',
      borderColor: 'border-yellow-600/30',
    },
    {
      id: 'criticalHit',
      name: 'Critical Hit',
      description: '+2% critical hit chance',
      icon: Flame,
      cost: 50 + upgrades.criticalHitLevel * 25,
      costType: 'gems' as const,
      level: upgrades.criticalHitLevel,
      color: 'from-red-500 to-orange-500',
      borderColor: 'border-red-500/30',
    },
    {
      id: 'energyEfficiency',
      name: 'Energy Efficiency',
      description: 'Reduce energy costs by 10%',
      icon: Cpu,
      cost: 100 + upgrades.energyEfficiencyLevel * 50,
      costType: 'gems' as const,
      level: upgrades.energyEfficiencyLevel,
      color: 'from-teal-500 to-cyan-500',
      borderColor: 'border-teal-500/30',
    },
    {
      id: 'megaClick',
      name: 'Mega Click',
      description: 'Improve mega click power',
      icon: Atom,
      cost: 200 + upgrades.megaClickLevel * 100,
      costType: 'gems' as const,
      level: upgrades.megaClickLevel,
      color: 'from-indigo-500 to-purple-500',
      borderColor: 'border-indigo-500/30',
    },
    {
      id: 'quantumBoost',
      name: 'Quantum Boost',
      description: 'Exponential power increase',
      icon: Sparkles,
      cost: 500 + upgrades.quantumBoostLevel * 250,
      costType: 'gems' as const,
      level: upgrades.quantumBoostLevel,
      color: 'from-pink-500 to-rose-500',
      borderColor: 'border-pink-500/30',
    },
  ];

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
      <h2 className="text-xl font-mono font-bold text-white mb-4 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5 text-cyan-400" />
        Upgrades
      </h2>
      
      {/* Currency Display */}
      <div className="flex gap-4 mb-4 p-3 bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400 font-mono font-bold">{formatNumber(coins)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Gem className="w-4 h-4 text-purple-400" />
          <span className="text-purple-400 font-mono font-bold">{formatNumber(gems)}</span>
        </div>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {upgradeData.map((upgrade) => {
          const canAfford = upgrade.costType === 'coins' ? coins >= upgrade.cost : gems >= upgrade.cost;
          const Icon = upgrade.icon;
          
          return (
            <button
              key={upgrade.id}
              onClick={() => canAfford && onBuyUpgrade(upgrade.id, upgrade.cost, upgrade.costType)}
              disabled={!canAfford}
              className={`
                w-full p-3 rounded-xl border transition-all duration-200
                ${canAfford 
                  ? `bg-gradient-to-r ${upgrade.color}/20 ${upgrade.borderColor} hover:${upgrade.color}/30 hover:scale-105` 
                  : 'bg-gray-800/50 border-gray-600/30 opacity-50 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${upgrade.color} flex-shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono font-bold text-white text-sm truncate">{upgrade.name}</h3>
                    {upgrade.level > 0 && (
                      <span className="px-2 py-1 bg-gray-700 rounded-full text-xs font-mono text-gray-300 flex-shrink-0">
                        Lv.{upgrade.level}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs font-mono">{upgrade.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {upgrade.costType === 'coins' ? (
                      <Zap className="w-3 h-3 text-yellow-400" />
                    ) : (
                      <Gem className="w-3 h-3 text-purple-400" />
                    )}
                    <p className={`font-mono font-bold text-xs ${
                      upgrade.costType === 'coins' ? 'text-yellow-400' : 'text-purple-400'
                    }`}>
                      {formatNumber(upgrade.cost)}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};