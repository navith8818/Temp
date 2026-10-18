import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Loader2, Check } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Successfully signed in. Welcome back!');
      setTimeout(() => {
        navigate('/');
      }, 700);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#09090c] text-white flex flex-col justify-between p-4 sm:p-6 font-sans selection:bg-[#e8702a]/30 selection:text-white">
      {/* Top Bar */}
      <div className="w-full max-w-[1200px] mx-auto flex items-center justify-between py-2">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-white/50 hover:text-white text-xs font-semibold transition-colors group cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to home</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">Don't have an account?</span>
          <Link
            to="/register"
            className="text-xs font-bold text-[#e8702a] hover:text-[#ff8f4d] transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Main Centered Card */}
      <div className="w-full max-w-[440px] mx-auto my-auto py-8">
        <div className="bg-[#111115] border border-white/10 rounded-3xl p-7 sm:p-9">
          
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-[#e8702a] flex items-center justify-center text-white">
                <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-white tracking-tight">Server Salad</span>
            </Link>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-xs text-white/50">
              Sign in to manage your servers, domains, and cloud services.
            </p>
          </div>

          {/* Google Login */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => { setIsLoading(false); navigate('/'); }, 800);
              }}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-[#16161c] border border-white/10 hover:border-white/20 text-white text-xs font-semibold transition-all hover:bg-[#1a1a22] cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.54 0 2.93.53 4.02 1.57l3.01-3.01C17.21 1.83 14.79 1 12 1 7.42 1 3.52 3.58 1.62 7.34l3.65 2.84C6.15 7.27 8.84 5 12 5z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.72 2.88c2.17-2 3.7-4.95 3.7-8.7z"/>
                <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.62 6.87C.59 8.93 0 11.23 0 13.68s.59 4.75 1.62 6.81l3.65-2.84z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.72-2.88c-1.07.72-2.45 1.16-4.21 1.16-3.16 0-5.85-2.27-6.73-5.18L1.62 16.03C3.52 19.79 7.42 22.37 12 22.37z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <span className="relative bg-[#111115] px-3 text-[11px] font-medium text-white/40 uppercase tracking-wider">
              Or continue with email
            </span>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3 rounded-xl bg-[#e8702a]/10 border border-[#e8702a]/30 text-[#e8702a] text-xs flex items-center gap-2">
              <Check size={14} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-white/60 block mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="w-full bg-[#0b0b0e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#e8702a] transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-white/60">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset instructions will be sent to your email.');
                  }}
                  className="text-[11px] text-[#e8702a] hover:text-[#ff8f4d] font-medium transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#0b0b0e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#e8702a] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-[#0b0b0e] border-white/20 text-[#e8702a] focus:ring-[#e8702a] accent-[#e8702a]"
                />
                <span className="text-[11px] text-white/50">Remember for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-[#e8702a] hover:bg-[#d2611f] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

        </div>

        {/* Card Footer Info */}
        <div className="text-center mt-6 text-xs text-white/40">
          Protected by enterprise reCAPTCHA and SSL encryption.
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="w-full max-w-[1200px] mx-auto py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-white/30 border-t border-white/5 gap-2">
        <span>© {new Date().getFullYear()} Server Salad Inc. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Security</a>
        </div>
      </div>
    </div>
  );
};
