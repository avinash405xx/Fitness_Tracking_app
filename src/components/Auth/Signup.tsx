import { useState } from 'react';
import { User, Mail, Lock, Chrome, AlertCircle, CheckCircle } from 'lucide-react';
import { signUp, signInWithGoogle } from '../../lib/auth';

interface SignupProps {
  onSwitchToLogin: () => void;
  onSignupSuccess?: () => void;
}

export default function Signup({ onSwitchToLogin, onSignupSuccess }: SignupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, name);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        if (onSignupSuccess) {
          onSignupSuccess();
        }
      }, 1500);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setError('');
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Google signup error:', err);
      setError(err.message || 'Failed to sign up with Google');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-900 via-teal-800 to-green-800">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/50 via-teal-800/50 to-green-800/50" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center space-x-1 mb-6">
              <button
                onClick={onSwitchToLogin}
                className="text-gray-400 text-lg font-medium hover:text-white transition-colors"
              >
                Login
              </button>
              <span className="text-gray-400 text-lg mx-3">|</span>
              <button className="text-white text-lg font-semibold border-b-2 border-white pb-1">
                Signup
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="mb-6">
              <h2 className="text-white text-2xl font-bold mb-1">Get in & at 3 Free</h2>
              <p className="text-gray-300 text-sm">Courses</p>
            </div>

            {error && (
              <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-xl p-3 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-200" />
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-500/20 border border-green-500/50 rounded-xl p-3 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-200" />
                <p className="text-green-100 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    required
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/25 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/25 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Password (min 6 characters)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/25 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-400"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-300">or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignup}
                className="w-full bg-white text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center space-x-2"
              >
                <Chrome className="w-5 h-5" />
                <span>Sign up with Google</span>
              </button>
            </form>

            <p className="text-center text-gray-300 text-sm mt-6">
              Already have an account?{' '}
              <button onClick={onSwitchToLogin} className="text-white font-semibold hover:underline">
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
