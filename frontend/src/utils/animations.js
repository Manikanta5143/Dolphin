// Animation utilities for smooth transitions and effects

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, ease: "easeOut" }
};

export const slideInFromBottom = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export const slideInFromTop = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export const slideInFromLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: "easeOut" }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" }
};

// Hover animations
export const hoverScale = {
  whileHover: { scale: 1.05 },
  transition: { duration: 0.2, ease: "easeInOut" }
};

export const hoverLift = {
  whileHover: { y: -5 },
  transition: { duration: 0.2, ease: "easeInOut" }
};

export const hoverGlow = {
  whileHover: { 
    boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" 
  },
  transition: { duration: 0.2, ease: "easeInOut" }
};

// Loading animations
export const pulse = {
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const bounce = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const spin = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Page transitions
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

// Modal animations
export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2, ease: "easeInOut" }
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 20 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

// Notification animations
export const notificationSlideIn = {
  initial: { opacity: 0, x: 300 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 300 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

// Achievement unlock animation
export const achievementUnlock = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  transition: { 
    type: "spring", 
    stiffness: 200, 
    damping: 15,
    duration: 0.6 
  }
};

// Confetti animation
export const confetti = {
  initial: { scale: 0, rotate: 0 },
  animate: { 
    scale: [0, 1, 0],
    rotate: [0, 180, 360],
    y: [0, -100, 100]
  },
  transition: { 
    duration: 2,
    ease: "easeOut"
  }
};

// Progress bar animation
export const progressBar = {
  initial: { width: 0 },
  animate: { width: "100%" },
  transition: { duration: 0.8, ease: "easeOut" }
};

// Stagger animation for lists
export const staggerList = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

export const staggerListItem = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3, ease: "easeOut" }
};

// Shake animation for errors
export const shake = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5, ease: "easeInOut" }
  }
};

// Glow animation for important elements
export const glow = {
  animate: {
    boxShadow: [
      "0 0 5px rgba(59, 130, 246, 0.3)",
      "0 0 20px rgba(59, 130, 246, 0.6)",
      "0 0 5px rgba(59, 130, 246, 0.3)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Typing animation
export const typing = {
  animate: {
    opacity: [0, 1, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Utility function to check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};

// Utility function to get animation variants based on user preference
export const getAnimationVariants = (variants) => {
  if (prefersReducedMotion()) {
    // Return minimal animations for users who prefer reduced motion
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.1 }
    };
  }
  return variants;
};

// Utility function to create staggered animations
export const createStaggerAnimation = (delay = 0.1) => ({
  animate: {
    transition: {
      staggerChildren: delay
    }
  }
});

// Utility function to create hover animations
export const createHoverAnimation = (scale = 1.05, duration = 0.2) => ({
  whileHover: { scale },
  transition: { duration, ease: "easeInOut" }
});

// Utility function to create loading animations
export const createLoadingAnimation = (duration = 1.5) => ({
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      duration,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
});
