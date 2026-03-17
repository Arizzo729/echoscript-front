import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError(t("auth.fill_all_fields", "Please fill in all required fields"));
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError(t("auth.invalid_email", "Please enter a valid email address"));
      return false;
    }

    if (formData.password.length < 8) {
      setError(t("auth.password_too_short", "Password must be at least 8 characters long"));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.passwords_dont_match", "Passwords do not match"));
      return false;
    }

    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setError(t("auth.password_complexity", "Password must contain uppercase, lowercase, and numbers"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await signup(
        formData.email, 
        formData.password, 
        formData.username || undefined
      );
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 md:p-10">
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
            >
              {t("auth.create_account", "Create Account")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-gray-400 text-lg"
            >
              {t("auth.signup_subtitle", "Start transcribing with EchoScript")}
            </motion.p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                {t("auth.username", "Username")} <span className="text-gray-500 text-xs font-normal">({t("auth.optional", "optional")})</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl 
                         text-white placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent
                         transition-all duration-200 hover:bg-white/10"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                {t("auth.email_address", "Email Address")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl 
                         text-white placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent
                         transition-all duration-200 hover:bg-white/10"
                placeholder="[email protected]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                {t("auth.password", "Password")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl 
                         text-white placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent
                         transition-all duration-200 hover:bg-white/10"
                placeholder="••••••••"
              />
              <p className="mt-2 text-xs text-gray-500">
                {t("auth.password_requirements", "At least 8 characters with uppercase, lowercase, and numbers")}
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                {t("auth.confirm_password", "Confirm Password")}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl 
                         text-white placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent
                         transition-all duration-200 hover:bg-white/10"
                placeholder="••••••••"
              />
            </div>

            <div className="text-xs text-gray-500 bg-white/5 border border-white/10 rounded-xl p-4">
              {t("auth.agree_text", "By signing up, you agree to our")}{' '}
              <Link to="/terms" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                {t("auth.terms", "Terms of Service")}
              </Link>{' '}
              {t("auth.and", "and")}{' '}
              <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                {t("auth.privacy", "Privacy Policy")}
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 
                       text-white font-medium rounded-xl
                       hover:from-cyan-400 hover:to-blue-500
                       focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-gray-900
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-lg shadow-cyan-500/25"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t("auth.creating_account", "Creating account...")}
                </span>
              ) : (
                t("auth.create_account_btn", "Create Account")
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              {t("auth.already_have_account", "Already have an account?")}{' '}
              <Link 
                to="/signin" 
                className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {t("auth.sign_in_link", "Sign in")}
              </Link>
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center text-gray-500 text-sm"
        >
          <p>{t("auth.protected_encryption", "Protected by industry-standard encryption")}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
