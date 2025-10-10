import { useState } from 'react';
import { Mail, Lock, Chrome } from 'lucide-react';

interface LoginProps {
  onSwitchToSignup: () => void;
  onLoginSuccess?: () => void;
}

export default function Login({ onSwitchToSignup, onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-green-700">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center space-x-1 mb-6">
              <button className="text-white text-lg font-semibold border-b-2 border-white pb-1">
                Login
              </button>
              <span className="text-gray-400 text-lg mx-3">|</span>
              <button
                onClick={onSwitchToSignup}
                className="text-gray-400 text-lg font-medium hover:text-white transition-colors"
              >
                Signup
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="mb-6">
              <h2 className="text-white text-2xl font-bold mb-1">Welcome Back</h2>
              <p className="text-gray-300 text-sm">Amanda</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email"
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/25 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/25 transition-all"
                  />
                </div>
              </div>

              <div className="text-right">
                <button type="button" className="text-white text-sm hover:underline">
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                Log in
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
                onClick={handleGoogleLogin}
                className="w-full bg-white text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center space-x-2"
              >
                <Chrome className="w-5 h-5" />
                <span>Sign in with Google</span>
              </button>
            </form>

            <p className="text-center text-gray-300 text-sm mt-6">
              Don't have an account?{' '}
              <button onClick={onSwitchToSignup} className="text-white font-semibold hover:underline">
                Sign up!
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
