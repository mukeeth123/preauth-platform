import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Spinner } from './common/Spinner';
import { UserRole } from '../types';

// Healthcare 2025 Design System Colors
const colors = {
  primary: '#2C5F8D',
  primaryLight: '#4A90E2',
  success: '#28A745',
  error: '#DC3545',
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',
};

interface LoginPageProps {
  onLoginSuccess: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('testuser@healthai.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserRole>('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    // Simulate network delay for a realistic feel
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, you'd validate credentials here.
    // For this dummy page, any non-empty input is successful.
    setIsLoading(false);
    onLoginSuccess(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center items-center p-4" style={{ fontFamily: "'Inter', 'Roboto', 'Open Sans', system-ui, sans-serif" }}>
      {/* Logo and Title */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontSize: '28px', lineHeight: '1.3' }}>
            AI Preauthorization Platform
          </h1>
        </div>
        <p className="text-gray-600 text-center" style={{ fontSize: '16px', lineHeight: '1.5' }}>
          Streamline your healthcare authorization workflow
        </p>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md shadow-xl border-2 border-gray-200">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontSize: '24px', lineHeight: '1.4' }}>
              Welcome Back
            </h2>
            <p className="text-gray-600" style={{ fontSize: '15px' }}>
              Sign in to access your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div 
                className="flex items-start space-x-3 border-2 rounded-lg p-4" 
                style={{ backgroundColor: colors.errorBg, borderColor: colors.errorBorder }}
                role="alert"
              >
                <svg className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: colors.error }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium" style={{ color: colors.error, fontSize: '15px', lineHeight: '1.5' }}>
                  {error}
                </span>
              </div>
            )}
            {/* User Role */}
            <div>
              <label htmlFor="role" className="block font-semibold text-gray-900 mb-2" style={{ fontSize: '15px' }}>
                User Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
                  style={{ fontSize: '16px', minHeight: '48px' }}
                >
                  <option value="standard">User</option>
                  <option value="admin">Admin</option>
                </select>
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block font-semibold text-gray-900 mb-2" style={{ fontSize: '15px' }}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="you@example.com"
                  style={{ fontSize: '16px', minHeight: '48px' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block font-semibold text-gray-900 mb-2" style={{ fontSize: '15px' }}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                  style={{ fontSize: '16px', minHeight: '48px' }}
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label htmlFor="remember-me" className="flex items-center cursor-pointer group" style={{ minHeight: '44px' }}>
                <input 
                  id="remember-me" 
                  name="remember-me" 
                  type="checkbox" 
                  className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 border-2 border-gray-300 rounded transition-all" 
                />
                <span className="ml-3 text-gray-700 font-medium group-hover:text-gray-900" style={{ fontSize: '15px' }}>
                  Remember me
                </span>
              </label>
              <a 
                href="#" 
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                style={{ fontSize: '15px', minHeight: '44px', display: 'flex', alignItems: 'center' }}
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
              style={{ fontSize: '17px', minHeight: '56px' }}
            >
              {isLoading ? (
                <>
                  <Spinner size="6" color="white"/>
                  <span className="ml-3">Signing in...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </>
              )}
            </button>

            {/* Security Notice */}
            <div className="flex items-center justify-center space-x-2 pt-2">
              <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-gray-600 font-medium">Secure HIPAA-compliant login</span>
            </div>
          </form>
        </div>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center space-y-2">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Health AI Corp. All rights reserved.
        </p>
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
          <span>•</span>
          <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
        </div>
      </div>
    </div>
  );
};
