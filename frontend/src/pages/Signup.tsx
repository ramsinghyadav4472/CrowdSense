import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { Lock, User, Mail } from 'lucide-react';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [successful, setSuccessful] = useState(false);

    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setSuccessful(false);
        setLoading(true);

        try {
            await AuthService.register(username, email, password);
            setSuccessful(true);
            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error: any) {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            setMessage(resMessage);
            setSuccessful(false);
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 backdrop-blur-lg shadow-2xl border border-white/20">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-indigo-100">Join the crowd tracking network</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-indigo-200" />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-lg bg-white/20 border border-white/10 py-3 pl-10 pr-4 text-white placeholder-indigo-200 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-200"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-indigo-200" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg bg-white/20 border border-white/10 py-3 pl-10 pr-4 text-white placeholder-indigo-200 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-200"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-indigo-200" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg bg-white/20 border border-white/10 py-3 pl-10 pr-4 text-white placeholder-indigo-200 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-200"
                            required
                        />
                    </div>

                    {message && (
                        <div className={`rounded-lg p-3 text-sm text-center ${successful ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-white py-3 font-semibold text-indigo-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-indigo-600 transition-all transform hover:scale-[1.02] disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center text-indigo-100">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-white hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
