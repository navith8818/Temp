import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Loader2, Check } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-white/10' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-[#e8702a]' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the terms and conditions to proceed.');
      return;
    }

    setIsLoading(true);

    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 700);
    }, 1000);
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
          <span className="text-xs text-white/40">Already have an account?</span>
          <Link
            to="/login"
            className="text-xs font-bold text-[#e8702a] hover:text-[#ff8f4d] transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>

      {/* Main Centered Card */}
      <div className="w-full max-w-[460px] mx-auto my-auto py-8">
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
              Create your account
            </h1>
            <p className="text-xs text-white/50">
              Start building, hosting, and deploying in seconds.
            </p>
          </div>

          {/* Google Sign Up */}
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-white/60 block mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Jayawardena"
                required
                className="w-full bg-[#0b0b0e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#e8702a] transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-white/60 block mb-1.5">
                Work or personal email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@domain.com"
                required
                className="w-full bg-[#0b0b0e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#e8702a] transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-white/60 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
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

              {/* Password strength visual */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          step <= strength.score ? strength.color : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-white/40 block">
                    Strength: <span className="font-semibold text-white/70">{strength.label}</span>
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-white/60 block mb-1.5">
                Confirm password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                className="w-full bg-[#0b0b0e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#e8702a] transition-colors"
              />
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-3.5 h-3.5 mt-0.5 rounded bg-[#0b0b0e] border-white/20 text-[#e8702a] focus:ring-[#e8702a] accent-[#e8702a]"
                />
                <span className="text-[11px] text-white/50 leading-snug">
                  I agree to Server Salad's <a href="#" className="text-white/80 hover:text-[#e8702a] underline">Terms of Service</a> and <a href="#" className="text-white/80 hover:text-[#e8702a] underline">Privacy Policy</a>.
                </span>
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
                  <span>Creating your account...</span>
                </>
              ) : (
                <span>Create account</span>
              )}
            </button>
          </form>

        </div>

        {/* Card Footer Info */}
        <div className="text-center mt-6 text-xs text-white/40">
          Already a customer? <Link to="/login" className="text-[#e8702a] font-semibold hover:underline">Log in here</Link>
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
