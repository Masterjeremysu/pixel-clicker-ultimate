import React, { useEffect, useState } from 'react';
import { Trophy, X } from 'lucide-react';
import { Achievement } from '../types/game';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({ 
  achievement, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div className={`
      fixed top-4 right-4 z-50 transition-all duration-300 transform
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 shadow-2xl border border-purple-400/30 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="bg-yellow-500 rounded-lg p-2">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-mono font-bold text-white">Achievement Unlocked!</h3>
            <p className="font-mono text-purple-100 text-sm">{achievement.name}</p>
            <p className="font-mono text-purple-200 text-xs mt-1">{achievement.description}</p>
            <p className="font-mono text-yellow-300 text-xs mt-1">
              Reward: +{achievement.reward} coins
            </p>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};