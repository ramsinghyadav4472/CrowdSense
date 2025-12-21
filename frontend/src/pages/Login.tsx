import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Eye, EyeOff, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import AnimatedBackground from '../components/layout/AnimatedBackground';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        setIsSuccess(false);

        // Simulate minimum loading time for better UX (smoothness)
        const minTime = new Promise(resolve => setTimeout(resolve, 800));

        try {
            const [data] = await Promise.all([AuthService.login(username, password), minTime]);
            setIsSuccess(true);

            // Allow success animation to play before redirecting
            setTimeout(() => {
                login(data);
                navigate('/dashboard');
            }, 500);
        } catch (error: any) {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            setMessage(resMessage);
            setLoading(false);
        }
    };

    // Animation Variants
    const cardVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const inputVariants: Variants = {
        focus: { scale: 1.02, transition: { duration: 0.2 } },
        blur: { scale: 1 }
    };

    const shakeTransition = { type: "spring" as const, stiffness: 300, damping: 20 };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden text-slate-800 dark:text-gray-100">
            <AnimatedBackground />

            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                className="w-full max-w-md bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-4 opacity-50">
                    <div className="w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl" />
                </div>

                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-sm">Welcome Back</h2>
                        <p className="text-indigo-200 font-medium">CrowdSense Dashboard</p>
                    </motion.div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <motion.div
                        className="relative group"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="absolute left-4 top-3.5 text-indigo-300 group-focus-within:text-white transition-colors">
                            <User size={20} />
                        </div>
                        <motion.input
                            variants={inputVariants}
                            whileFocus="focus"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 transition-all peer"
                            id="username"
                            required
                        />
                        <label
                            htmlFor="username"
                            className="absolute left-12 top-[-22px] text-xs font-bold text-indigo-300 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-indigo-300/70 peer-placeholder-shown:top-3.5 peer-focus:top-[-22px] peer-focus:text-xs peer-focus:text-white cursor-text"
                        >
                            Username
                        </label>
                    </motion.div>

                    <motion.div
                        className="relative group"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="absolute left-4 top-3.5 text-indigo-300 group-focus-within:text-white transition-colors">
                            <Lock size={20} />
                        </div>
                        <motion.input
                            variants={inputVariants}
                            whileFocus="focus"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 transition-all peer"
                            id="password"
                            required
                        />
                        <label
                            htmlFor="password"
                            className="absolute left-12 top-[-22px] text-xs font-bold text-indigo-300 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-indigo-300/70 peer-placeholder-shown:top-3.5 peer-focus:top-[-22px] peer-focus:text-xs peer-focus:text-white cursor-text"
                        >
                            Password
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-3.5 text-indigo-300/50 hover:text-white transition-colors focus:outline-none"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </motion.div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: [-10, 10, -5, 5, 0] }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={shakeTransition}
                                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3 text-red-200 text-sm"
                            >
                                <AlertTriangle size={16} className="shrink-0" />
                                <span>{message}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        type="submit"
                        disabled={loading || isSuccess}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full rounded-xl py-4 font-bold text-lg relative overflow-hidden transition-all duration-300 
                            ${isSuccess
                                ? 'bg-green-500 text-white shadow-green-500/50 cursor-default'
                                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50'
                            } disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                        <div className="relative z-10 flex items-center justify-center gap-2">
                            {loading && !isSuccess ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Verifying...</span>
                                </>
                            ) : isSuccess ? (
                                <>
                                    <CheckCircle size={20} />
                                    <span>Success!</span>
                                </>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </div>
                        {/* Shimmer Effect */}
                        {!loading && !isSuccess && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 1 }}
                            />
                        )}
                    </motion.button>
                </form>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-center"
                >
                    <p className="text-indigo-200/60 text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-white font-semibold hover:text-indigo-400 transition-colors relative group">
                            Sign up
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-400 transition-all group-hover:w-full"></span>
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
