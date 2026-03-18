import React, { useState, useEffect } from 'react';
import { FaCoins, FaTrophy, FaMedal } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const PointsCounter = ({ size = 'medium', showLevel = true }) => {
  const { user } = useAuth();
  const [displayPoints, setDisplayPoints] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (user?.points !== undefined) {
      const targetPoints = user.points;
      const currentPoints = displayPoints;
      
      if (targetPoints !== currentPoints) {
        setIsAnimating(true);
        
        const increment = (targetPoints - currentPoints) / 20;
        const timer = setInterval(() => {
          setDisplayPoints(prev => {
            const newPoints = prev + increment;
            if (newPoints >= targetPoints) {
              setDisplayPoints(targetPoints);
              setIsAnimating(false);
              clearInterval(timer);
              return targetPoints;
            }
            return newPoints;
          });
        }, 50);

        return () => clearInterval(timer);
      }
    }
  }, [user?.points, displayPoints]);

  const getLevelIcon = (level) => {
    switch (level) {
      case 'Legend':
        return <FaTrophy className="text-yellow-500" />;
      case 'Champion':
        return <FaMedal className="text-purple-500" />;
      default:
        return <FaCoins className="text-blue-500" />;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Legend':
        return 'text-yellow-600';
      case 'Champion':
        return 'text-purple-600';
      case 'Expert':
        return 'text-blue-600';
      case 'Enthusiast':
        return 'text-green-600';
      case 'Explorer':
        return 'text-indigo-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'small':
        return {
          container: 'px-2 py-1',
          icon: 'h-3 w-3',
          points: 'text-xs',
          level: 'text-xs'
        };
      case 'large':
        return {
          container: 'px-6 py-3',
          icon: 'h-6 w-6',
          points: 'text-2xl',
          level: 'text-sm'
        };
      default:
        return {
          container: 'px-4 py-2',
          icon: 'h-4 w-4',
          points: 'text-lg',
          level: 'text-sm'
        };
    }
  };

  const sizeClasses = getSizeClasses(size);

  if (!user) return null;

  return (
    <div className={`
      flex items-center space-x-2 bg-white rounded-lg shadow-sm border border-gray-200
      ${sizeClasses.container}
      ${isAnimating ? 'animate-pulse' : ''}
    `}>
      {/* Points Icon */}
      <FaCoins className={`${sizeClasses.icon} text-yellow-500`} />
      
      {/* Points */}
      <div className="flex flex-col">
        <span className={`font-bold text-gray-900 ${sizeClasses.points}`}>
          {Math.round(displayPoints).toLocaleString()}
        </span>
        <span className="text-xs text-gray-500">points</span>
      </div>

      {/* Level */}
      {showLevel && (
        <div className="flex items-center space-x-1 pl-2 border-l border-gray-200">
          {getLevelIcon(user.level)}
          <span className={`font-medium ${getLevelColor(user.level)} ${sizeClasses.level}`}>
            {user.level}
          </span>
        </div>
      )}
    </div>
  );
};

export default PointsCounter;
