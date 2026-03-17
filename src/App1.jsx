import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

// Demo pages
function Home() {
  const { user, logout, isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  EchoScript.AI
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  The Best Listener - Audio & Video Transcription
                </p>
              </div>
              {isAuthenticated && (
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          {/* User Info */}
          {isAuthenticated && user && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome, {user.username || user.email}!
              </h2>
              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <p><strong>Email:</strong> {user.email}</p>
                {user.username && <p><strong>Username:</strong> {user.username}</p>}
                <p><strong>Status:</strong> <span className="text-green-600 dark:text-green-400">Authenticated</span></p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Quick Links
            </h2>
            <nav className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/"
                className="p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg border-2 border-blue-200 dark:border-blue-800 transition-colors"
              >
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Home</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">Dashboard</p>
              </Link>
              <Link
                to="/upload"
                className="p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg border-2 border-green-200 dark:border-green-800 transition-colors"
              >
                <h3 className="font-semibold text-green-900 dark:text-green-100">Upload</h3>
                <p className="text-sm text-green-700 dark:text-green-300">Transcribe files</p>
              </Link>
              <Link
                to="/purchase"
                className="p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg border-2 border-purple-200 dark:border-purple-800 transition-colors"
              >
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">Purchase</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">Buy credits</p>
              </Link>
            </nav>

            {!isAuthenticated && (
              <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200 mb-4">
                  Sign in to access all features and start transcribing!
                </p>
                <div className="flex gap-4">
                  <Link
                    to="/signin"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Upload() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Upload</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Upload your audio or video files for AI-powered transcription.
        </p>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">Upload feature coming soon...</p>
        </div>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function Purchase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Purchase</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Choose a plan and get started with transcription credits.
        </p>
        <div className="space-y-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Starter Plan</h3>
            <p className="text-gray-600 dark:text-gray-400">Perfect for individuals</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">$9.99/mo</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Pro Plan</h3>
            <p className="text-gray-600 dark:text-gray-400">For professionals</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">$29.99/mo</p>
          </div>
        </div>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// Main App wrapped with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected routes */}
        <Route path="/" element={<Home />} />
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/purchase" 
          element={
            <ProtectedRoute>
              <Purchase />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
