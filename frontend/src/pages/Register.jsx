import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [framesLoaded, setFramesLoaded] = useState(false)
  const [images, setImages] = useState([])
  const canvasRef = useRef(null)
  const totalFrames = 240

  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const loadPromises = [];
    const loadedImages = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(3, '0');
      img.src = `/bg-frames-new/ezgif-frame-${paddedIndex}.jpg`;

      const p = new Promise((resolve) => {
        img.onload = () => {
          loadedImages[i - 1] = img;
          resolve();
        };
        img.onerror = () => {
          loadedImages[i - 1] = img;
          resolve();
        };
      });
      loadPromises.push(p);
    }

    Promise.all(loadPromises).then(() => {
      setImages(loadedImages);
      setFramesLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!framesLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false }); // optimization

    const drawCover = (context, img) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;
      let sx = 0, sy = 0, sWidth = img.naturalWidth, sHeight = img.naturalHeight;

      if (imgRatio > canvasRatio) {
        sWidth = img.naturalHeight * canvasRatio;
        sx = (img.naturalWidth - sWidth) / 2;
      } else {
        sHeight = img.naturalWidth / canvasRatio;
        sy = (img.naturalHeight - sHeight) / 2;
      }

      context.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, cw, ch);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Set initial size

    let startTime = performance.now();
    const duration = 8000; // 8 seconds
    let animationFrameId;

    const render = (time) => {
      const elapsed = time - startTime;
      let progress = elapsed / duration;

      if (progress >= 1) {
        progress = 1;
      }

      const exactFrame = progress * (totalFrames - 1);
      const index1 = Math.floor(exactFrame);
      const index2 = Math.min(index1 + 1, totalFrames - 1);
      const blend = exactFrame - index1;

      const img1 = images[index1];
      const img2 = images[index2];

      if (img1 && img1.complete && img1.naturalWidth > 0) {
        ctx.globalAlpha = 1;
        drawCover(ctx, img1);
      }

      if (blend > 0 && img2 && img2.complete && img2.naturalWidth > 0) {
        ctx.globalAlpha = blend;
        drawCover(ctx, img2);
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        if (images[totalFrames - 1] && images[totalFrames - 1].complete) {
          ctx.globalAlpha = 1;
          drawCover(ctx, images[totalFrames - 1]);
        }
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [framesLoaded, images]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    mode: 'onChange'
  })

  const password = watch('password')
  const name = watch('name')
  const email = watch('email')
  const confirmPassword = watch('confirmPassword')
  const terms = watch('terms')

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const result = await registerUser(data.name, data.email, data.password)
      if (result.success) {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate Progress
  const calculateProgress = () => {
    let count = 0
    if (name?.length > 1) count++
    if (email && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) count++
    if (password && password.length >= 6) count++
    if (confirmPassword && confirmPassword === password) count++
    if (terms) count++
    return (count / 5) * 100
  }

  // Password Strength
  const getPasswordStrength = (pass) => {
    if (!pass) return -1
    let strength = 0
    if (pass.length >= 6) strength += 1
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength += 1
    if (pass.match(/\d/)) strength += 1
    if (pass.match(/[^a-zA-Z\d]/)) strength += 1
    return Math.min(strength, 4)
  }

  const strengthScore = getPasswordStrength(password)
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-600']

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  }

  const progress = calculateProgress()

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#020617]">
      {/* Animated Canvas Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full block" />
        {/* Subtle Theme overlay to maintain dark navy look without killing clarity */}
        <div className="absolute inset-0 bg-[#020617]/30" />
      </div>

      <motion.div
        className="bg-white/5  max-w-md w-full p-8 rounded-3xl shadow-2xl border border-white/20 z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.01, ease: "easeOut", delay: 0 }}
        transition={{ duration: 1, delay: 3 }}
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants}>
            <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="text-white font-bold text-4xl transform -rotate-3">🐬</span>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-100 tracking-tight">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-100">
              Or{' '}
              <Link
                to="/login"
                className="font-medium text-blue-400 hover:text-gray-500 transition-colors"
              >
                Login to your existing account
              </Link>
            </p>
          </motion.div>

          {/* Gamified Progress Bar */}
          <motion.div className="mt-6" variants={itemVariants}>
            <div className="flex justify-between text-xs text-gray-500 mb-1 font-medium">
              <span>Setup Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <motion.div className="space-y-4" variants={itemVariants}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-100 mb-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-500">
                    <FaUser className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    {...register('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                    className={`block w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'} rounded-xl text-gray-400 placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition-all duration-200 bg-transparent focus:bg-white`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </motion.p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-100 mb-1">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-500">
                    <FaEnvelope className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'} rounded-xl text-gray-400 placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition-all duration-200 bg-transparent focus:bg-white`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-100 mb-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-500">
                    <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                      }
                    })}
                    className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'} rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition-all duration-200 bg-transparent focus:bg-white`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                <AnimatePresence>
                  {password && password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-500">Password strength</span>
                        <span className={`text-xs font-medium ${strengthScore > -1 ? strengthColors[strengthScore].replace('bg-', 'text-') : ''}`}>
                          {strengthScore > -1 ? strengthLabels[strengthScore] : ''}
                        </span>
                      </div>
                      <div className="flex gap-1 h-1.5">
                        {[0, 1, 2, 3, 4].map((index) => (
                          <div
                            key={index}
                            className={`flex-1 rounded-full transition-colors duration-300 ${index <= strengthScore ? strengthColors[strengthScore] : 'bg-gray-200'
                              }`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {errors.password && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-100 mb-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-500">
                    <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value => value === password || 'Passwords do not match'
                    })}
                    className={`block w-full pl-10 pr-3 py-3 border ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'} rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition-all duration-200 bg-transparent focus:bg-white`}
                    placeholder="Confirm your password"
                  />
                  {/* Real-time match feedback */}
                  <AnimatePresence>
                    {confirmPassword && confirmPassword === password && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                      >
                        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {errors.confirmPassword && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </motion.p>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-1">
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  {...register('terms', {
                    required: 'You must accept the terms and conditions'
                  })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-100">
                  I agree to the{' '}
                  <a href="#" className="text-blue-100 hover: text-gray-100 transition-colors font-medium">
                    Terms and Conditions
                  </a>
                </label>
              </div>
              {errors.terms && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-sm text-red-600">
                  {errors.terms.message}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Register
