import React, { useState } from 'react';
import { Lock, Mail, Sparkles, Leaf } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onLoginSuccess: () => void;
  isNightMode: boolean;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, isNightMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const themeBgCard = isNightMode ? 'bg-[#141E15]' : 'bg-[#F9F7F2]';
  const themeBorder = isNightMode ? 'border-[#FAF9F5]/10' : 'border-[#2C3E2E]/10';
  const themeTextMain = isNightMode ? 'text-[#FAF9F5]' : 'text-[#2C3E2E]';
  const themeTextMuted = isNightMode ? 'text-slate-400' : 'text-slate-600';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        return;
      }

      if (data.session) {
        onLoginSuccess();
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto rounded-full bg-[#2C3E2E] flex items-center justify-center border border-[#C18D5D]/20 shadow-lg"
          >
            <Leaf className="h-10 w-10 text-[#C18D5D]" />
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-extrabold text-[#C18D5D]">
              بيور غلو MH
            </h1>
            <p className="text-sm text-slate-500">
              تسجيل الدخول إلى لوحة التحكم
            </p>
          </div>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`${themeBgCard} p-8 rounded-xl border ${themeBorder} shadow-lg space-y-6`}
        >
          <div className="flex items-center gap-2 text-right mb-4">
            <Lock className="h-5 w-5 text-[#C18D5D]" />
            <h2 className="font-display text-lg font-bold text-[#2C3E2E] dark:text-[#FAF9F5]">
              الوصول الآمن
            </h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block text-right">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="samisami231182@gmail.com"
                  required
                  className="w-full pr-10 pl-4 py-3 text-sm rounded-lg border border-[#2C3E2E]/15 focus:border-[#C18D5D] bg-[#F9F7F2]/30 dark:bg-[#141E15]/30 focus:outline-none focus:ring-0 text-right"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block text-right">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pr-10 pl-4 py-3 text-sm rounded-lg border border-[#2C3E2E]/15 focus:border-[#C18D5D] bg-[#F9F7F2]/30 dark:bg-[#141E15]/30 focus:outline-none focus:ring-0 text-right"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/35 rounded-lg"
              >
                <p className="text-xs text-rose-600 dark:text-rose-400 text-right">
                  ⚠️ {error}
                </p>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2C3E2E] hover:bg-[#C18D5D] text-white text-sm font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>تسجيل الدخول</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="pt-4 border-t border-[#2C3E2E]/10 dark:border-[#FAF9F5]/10">
            <p className="text-[10px] text-slate-500 text-center">
              🔒 الوصول مقتصر على الإدارة المعتمدة فقط
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
