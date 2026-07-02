import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa'
import { motion } from 'framer-motion'

// Cache loaded images outside the component so they persist across unmounts/remounts
let globalImageCache = null;
let globalFramesLoaded = false;

const drawCover = (canvas, context, img) => {
  if (!img || img.naturalWidth === 0) return;
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

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const canvasRef = useRef(null)
  const totalFrames = 240

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let active = true;
    let animationFrameId = null;
    let resizeHandler = null;
    let currentProgress = 0;

    const cleanup = () => {
      active = false;
      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };

    const startAnimation = (loadedImages) => {
      if (!canvasRef.current || !active) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { alpha: false });

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Redraw if the animation is not actively running
        if (currentProgress >= 1) {
          ctx.globalAlpha = 1;
          drawCover(canvas, ctx, loadedImages[totalFrames - 1]);
        } else if (currentProgress > 0) {
          const exactFrame = currentProgress * (totalFrames - 1);
          const index1 = Math.floor(exactFrame);
          const index2 = Math.min(index1 + 1, totalFrames - 1);
          const blend = exactFrame - index1;
          const img1 = loadedImages[index1];
          const img2 = loadedImages[index2];

          if (img1 && img1.complete) {
            ctx.globalAlpha = 1;
            drawCover(canvas, ctx, img1);
          }
          if (blend > 0 && img2 && img2.complete) {
            ctx.globalAlpha = blend;
            drawCover(canvas, ctx, img2);
          }
        } else if (loadedImages[0]) {
          ctx.globalAlpha = 1;
          drawCover(canvas, ctx, loadedImages[0]);
        }
      };

      resizeHandler = resizeCanvas;
      window.addEventListener('resize', resizeHandler);
      resizeCanvas(); // Set initial size

      let startTime = performance.now();
      const duration = 8000; // 8 seconds

      const render = (time) => {
        if (!active) return;
        const elapsed = time - startTime;
        let progress = elapsed / duration;

        if (progress >= 1) {
          progress = 1;
        }

        currentProgress = progress;

        const exactFrame = progress * (totalFrames - 1);
        const index1 = Math.floor(exactFrame);
        const index2 = Math.min(index1 + 1, totalFrames - 1);
        const blend = exactFrame - index1;

        const img1 = loadedImages[index1];
        const img2 = loadedImages[index2];

        if (img1 && img1.complete && img1.naturalWidth > 0) {
          ctx.globalAlpha = 1;
          drawCover(canvas, ctx, img1);
        }

        if (blend > 0 && img2 && img2.complete && img2.naturalWidth > 0) {
          ctx.globalAlpha = blend;
          drawCover(canvas, ctx, img2);
        }

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(render);
        } else {
          if (loadedImages[totalFrames - 1] && loadedImages[totalFrames - 1].complete) {
            ctx.globalAlpha = 1;
            drawCover(canvas, ctx, loadedImages[totalFrames - 1]);
          }
        }
      };

      animationFrameId = requestAnimationFrame(render);
    };

    // Load images
    if (globalFramesLoaded && globalImageCache) {
      startAnimation(globalImageCache);
    } else {
      const urls = Array.from({ length: totalFrames }, (_, i) => {
        const paddedIndex = String(i + 1).padStart(3, '0');
        return `/bg-frames-final/ezgif-frame-${paddedIndex}.jpg`;
      });

      const loadImages = async () => {
        const loaded = new Array(urls.length);
        const concurrency = 6;
        let currentIndex = 0;

        const worker = async () => {
          while (currentIndex < urls.length && active) {
            const index = currentIndex++;
            const url = urls[index];

            const img = new Image();
            img.src = url;

            await new Promise((resolve) => {
              img.onload = () => {
                loaded[index] = img;

                // Draw the first frame immediately once loaded to avoid black screen
                if (index === 0 && canvasRef.current && active) {
                  const canvas = canvasRef.current;
                  const ctx = canvas.getContext('2d', { alpha: false });
                  canvas.width = window.innerWidth;
                  canvas.height = window.innerHeight;
                  ctx.globalAlpha = 1;
                  drawCover(canvas, ctx, img);
                }

                resolve();
              };
              img.onerror = () => {
                loaded[index] = null;
                resolve();
              };
            });
          }
        };

        const workers = Array.from({ length: concurrency }, worker);
        await Promise.all(workers);

        if (active) {
          globalImageCache = loaded;
          globalFramesLoaded = true;
          startAnimation(loaded);
        }
      };

      loadImages();
    }

    return cleanup;
  }, []);

  const from = location.state?.from?.pathname || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const result = await login(data.user_identifier, data.user_secret)
      if (result.success) {
        navigate(from, { replace: true })
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full block" />
        <div className="absolute inset-0 bg-[#020617]/30" />
      </div>

      <motion.div
        className="bg-white/5 max-w-md w-full p-8 rounded-3xl shadow-2xl border border-white/20 z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.01, ease: "easeOut", delay: 0 }}
        transition={{ duration: 2, delay: 5 }}
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants}>
            <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="text-white font-bold text-4xl transform -rotate-3">🐬</span>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-100 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-100">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-gray-400 hover:text-primary-500 transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </motion.div>

          <form autoComplete='off' className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <input type="text" name="fakeuser" style={{ display: "none" }} />
            <input type="password" name="fakepass" style={{ display: "none" }} />
            <motion.div className="space-y-5" variants={itemVariants}>
              <div>
                <label htmlFor="user_identifier" className="block text-sm font-medium text-white mb-1">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-500">
                    <FaEnvelope className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    id="user_identifier"
                    type="text"
                    autoComplete="off"
                    {...register('user_identifier', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className={`block w-full pl-10 pr-3 py-3 border ${errors.user_identifier ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'} rounded-xl text-gray-900 placeholder-gray focus:outline-none focus:ring-2 sm:text-sm transition-all duration-200 bg-transparent focus:bg-white`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.user_identifier && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 text-sm text-red-600">
                    {errors.user_identifier.message}
                  </motion.p>
                )}
              </div>

              <div>
                <label htmlFor="user_secret" className="block text-sm font-medium text-gray-100 mb-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    id="user_secret"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('user_secret', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    className={`block w-full pl-10 pr-10 py-3 border ${errors.user_secret ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-100 focus:ring-primary-500 focus:border-primary-500'} rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition-all duration-200 bg-transparent focus:bg-white`}
                    placeholder="Enter your password"
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
                {errors.user_secret && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 text-sm text-red-600">
                    {errors.user_secret.message}
                  </motion.p>
                )}
              </div>
            </motion.div>

            <motion.div className="flex items-center justify-between" variants={itemVariants}>
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-100">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-100 hover:text-primary-300 transition-colors">
                  Forgot your password?
                </a>
              </div>
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
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login
