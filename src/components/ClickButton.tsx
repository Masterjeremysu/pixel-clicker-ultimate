import React, { useState, useEffect } from 'react';
import { Zap, Star, Flame } from 'lucide-react';

interface ClickButtonProps {
  onClick: () => void;
  clickPower: number;
  energy: number;
  maxEnergy: number;
}

export const ClickButton: React.FC<ClickButtonProps> = ({ onClick, clickPower, energy, maxEnergy }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [clickStreak, setClickStreak] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showCritical, setShowCritical] = useState(false);
  const [showLucky, setShowLucky] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastClickTime > 1000) {
        setClickStreak(0);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [lastClickTime]);

  const handleClick = () => {
    const now = Date.now();
    
    if (now - lastClickTime < 1000) {
      setClickStreak(prev => prev + 1);
    } else {
      setClickStreak(1);
    }
    
    setLastClickTime(now);
    setIsClicked(true);
    onClick();

    // Random effects
    if (Math.random() < 0.05) {
      setShowCritical(true);
      setTimeout(() => setShowCritical(false), 1000);
    }
    
    if (Math.random() < 0.02) {
      setShowLucky(true);
      setTimeout(() => setShowLucky(false), 1000);
    }

    setTimeout(() => setIsClicked(false), 150);
  };

  const energyPercentage = (energy / maxEnergy) * 100;
  const canMegaClick = energy >= 10 && clickStreak >= 10;

  return (
    <div className="relative flex flex-col items-center">
      {/* Energy Bar */}
      <div className="mb-4 w-48 bg-gray-800 rounded-full h-3 border border-cyan-500/30">
        <div 
          className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${energyPercentage}%` }}
        />
        <div className="text-center text-xs text-cyan-400 font-mono mt-1">
          Energy: {energy}/{maxEnergy}
        </div>
      </div>

      {/* Click Streak Indicator */}
      {clickStreak > 1 && (
        <div className="absolute -top-8 bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 rounded-full text-white font-mono text-sm font-bold animate-pulse">
          {clickStreak}x STREAK!
        </div>
      )}

      {/* Main Click Button */}
      <button
        onClick={handleClick}
        className={`
          relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl
          ${canMegaClick 
            ? 'bg-gradient-to-br from-red-400 via-orange-500 to-yellow-600 animate-pulse' 
            : 'bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600'
          }
          hover:from-cyan-300 hover:via-blue-400 hover:to-purple-500
          active:scale-95 transition-all duration-150
          shadow-2xl hover:shadow-cyan-500/25
          border-4 border-white/20
          ${isClicked ? 'animate-pulse scale-110' : ''}
          ${canMegaClick ? 'shadow-orange-500/50' : ''}
        `}
      >
        <div className="absolute inset-3 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
        
        {canMegaClick ? (
          <Flame className="w-20 h-20 sm:w-24 sm:h-24 text-white drop-shadow-lg animate-bounce" />
        ) : (
          <Zap className="w-20 h-20 sm:w-24 sm:h-24 text-white drop-shadow-lg" />
        )}
        
        {/* Mega Click Indicator */}
        {canMegaClick && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-2 animate-spin">
            <Star className="w-4 h-4 text-white" />
          </div>
        )}
        
        {/* Click effect particles */}
        {isClicked && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-3 h-3 rounded-full animate-ping ${
                  canMegaClick ? 'bg-orange-400' : 'bg-yellow-400'
                }`}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 30}deg) translateY(-80px)`,
                  animationDelay: `${i * 50}ms`,
                }}
              />
            ))}
          </div>
        )}
      </button>
      
      {/* Stats Display */}
      <div className="mt-6 text-center space-y-2">
        <p className="text-white font-mono text-lg font-bold">
          Power: {clickPower.toLocaleString()}x
        </p>
        {clickStreak > 1 && (
          <p className="text-orange-400 font-mono text-sm">
            Streak: {clickStreak}
          </p>
        )}
        {canMegaClick && (
          <p className="text-red-400 font-mono text-sm font-bold animate-pulse">
            MEGA CLICK READY!
          </p>
        )}
      </div>

      {/* Effect Notifications */}
      {showCritical && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-400 font-mono font-bold text-2xl animate-bounce pointer-events-none">
          CRITICAL!
        </div>
      )}
      
      {showLucky && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-400 font-mono font-bold text-xl animate-pulse pointer-events-none">
          LUCKY!
        </div>
      )}
    </div>
  );
};