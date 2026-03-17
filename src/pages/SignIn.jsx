import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function SignIn() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError(t("auth.fill_all_fields", "Please fill in all fields"));
      setLoading(false);
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError(t("auth.invalid_email", "Please enter a valid email address"));
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password, formData.remember);
      if (result.success) navigate('/');
      else setError(result.error || 'Login failed. Please try again.');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md px-6 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">{t("auth.welcome_back", "Welcome Back")}</h1>
        <p className="text-center text-gray-400 mb-10">EchoScript.AI</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-md text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">{t("auth.email", "Email")}</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
              placeholder={t("auth.email_placeholder", "Enter your email")}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">{t("auth.password", "Password")}</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
              placeholder={t("auth.password_placeholder", "Enter your password")}
            />
          </div>

          <div className="flex items-center justify-between text-sm mt-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="w-2.5 h-2.5 accent-teal-500 bg-gray-900 border-gray-700 rounded transition-all cursor-pointer"
                style={{ width: '10px', height: '10px' }}
              />
              <span className="text-gray-400">{t("auth.remember_me", "Remember me")}</span>
            </label>
            <Link to="/reset-password" className="text-gray-400 hover:text-white">
              {t("auth.forgot_password", "Forgot password?")}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gray-200 text-black font-semibold rounded-md hover:bg-white transition-all mt-4"
          >
            {loading ? t("auth.signing_in", "Signing in...") : t("auth.sign_in", "Sign In")}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          {t("auth.no_account", "Don’t have an account yet?")}{' '}
          <Link to="/signup" className="text-white underline">
            {t("auth.sign_up_link", "Sign up here")}
          </Link>
        </p>
      </div>
    </div>
  );
}
