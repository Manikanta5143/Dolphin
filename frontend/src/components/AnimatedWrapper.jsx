import React from 'react';
import { motion } from 'framer-motion';
import { getAnimationVariants, prefersReducedMotion } from '../utils/animations';

const AnimatedWrapper = ({ 
  children, 
  animation = 'fadeIn',
  delay = 0,
  duration = 0.3,
  stagger = false,
  className = "",
  ...props 
}) => {
  const animations = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration, delay, ease: "easeOut" }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration, delay, ease: "easeOut" }
    },
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration, delay, ease: "easeOut" }
    },
    slideLeft: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration, delay, ease: "easeOut" }
    },
    slideRight: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration, delay, ease: "easeOut" }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration, delay, ease: "easeOut" }
    },
    bounceIn: {
      initial: { opacity: 0, scale: 0.3 },
      animate: { opacity: 1, scale: 1 },
      transition: { 
        duration, 
        delay, 
        type: "spring", 
        stiffness: 200, 
        damping: 15 
      }
    }
  };

  const selectedAnimation = animations[animation] || animations.fadeIn;
  const variants = getAnimationVariants(selectedAnimation);

  if (prefersReducedMotion()) {
    return <div className={className} {...props}>{children}</div>;
  }

  if (stagger) {
    return (
      <motion.div
        className={className}
        variants={{
          animate: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="initial"
        animate="animate"
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedWrapper;
