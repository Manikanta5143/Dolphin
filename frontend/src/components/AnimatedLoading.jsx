import React from 'react';
import { motion } from 'framer-motion';
import { pulse, spin, bounce } from '../utils/animations';

const AnimatedLoading = ({ 
  type = 'spinner',
  size = 'md',
  color = 'blue',
  text = '',
  className = ""
}) => {
  const getSizeClasses = (size) => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-12 h-12';
      default:
        return 'w-6 h-6';
    }
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'red':
        return 'text-red-500';
      case 'green':
        return 'text-green-500';
      case 'yellow':
        return 'text-yellow-500';
      case 'purple':
        return 'text-purple-500';
      default:
        return 'text-blue-500';
    }
  };

  const Spinner = () => (
    <motion.div
      className={`${getSizeClasses(size)} ${getColorClasses(color)} border-2 border-current border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );

  const Dots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`w-2 h-2 ${getColorClasses(color)} rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  const Pulse = () => (
    <motion.div
      className={`${getSizeClasses(size)} ${getColorClasses(color)} rounded-full`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.5, 1]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );

  const Bounce = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`w-2 h-2 ${getColorClasses(color)} rounded-full`}
          animate={{
            y: [0, -10, 0]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  const Wave = () => (
    <div className="flex space-x-1">
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className={`w-1 h-4 ${getColorClasses(color)} rounded-full`}
          animate={{
            scaleY: [1, 2, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return <Dots />;
      case 'pulse':
        return <Pulse />;
      case 'bounce':
        return <Bounce />;
      case 'wave':
        return <Wave />;
      default:
        return <Spinner />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      {renderLoader()}
      {text && (
        <motion.p
          className={`text-sm ${getColorClasses(color)}`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default AnimatedLoading;
