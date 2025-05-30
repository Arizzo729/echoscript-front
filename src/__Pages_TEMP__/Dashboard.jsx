import React from 'react';
import { motion } from 'framer-motion';
import { UploadAndTranscribe } from '@/components/UploadAndTranscribe';
import { AutomationCard } from '@/components/AutomationCard';
import { StatusConsole } from '@/components/StatusConsole';
import { Sparkles, Bell, Sun, Moon, User } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { settings } from '@/lib/config';

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-zinc-950 shadow-md p-6 space-y-6 border-r border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 text-2xl font-bold text-blue-600 dark:text-blue-400">
          <Sparkles className="animate-pulse" /> EchoScript AI
        </div>
        <nav className="space-y-3">
          <a href="#automations" className="block text-zinc-600 dark:text-zinc-300 hover:text-blue-500">Automations</a>
          <a href="#upload" className="block text-zinc-600 dark:text-zinc-300 hover:text-blue-500">Upload</a>
          <a href="#logs" className="block text-zinc-600 dark:text-zinc-300 hover:text-blue-500">Logs</a>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="md:hidden text-xl font-semibold text-zinc-800 dark:text-zinc-200">EchoScript AI</div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun className="text-yellow-400" /> : <Moon className="text-zinc-700" />}
            </button>
            <button className="relative" aria-label="Notifications">
              <Bell className="text-zinc-500 dark:text-zinc-300" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            </button>
            <div className="relative group">
              <User className="text-zinc-500 dark:text-zinc-300 cursor-pointer" />
              <div className="absolute hidden group-hover:block right-0 mt-2 w-32 rounded-md bg-white dark:bg-zinc-800 shadow-md p-2 text-sm text-zinc-700 dark:text-zinc-200">
                <div>{settings.userEmail}</div>
                <button className="text-blue-500 hover:underline mt-2">Sign out</button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-all">
          <motion.div
            id="automations"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <AutomationCard
              title="Adaptive Automations"
              description="Run AI-powered data capture with Browse AI, Bardeen, Simplescraper, Octoparse"
              icon="🧠"
              actionLabel="Launch"
              route="/automator"
            />
          </motion.div>

          <motion.div
            id="upload"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <AutomationCard
              title="Upload & Transcribe"
              description="Upload files or connect cloud storage to transcribe with Whisper"
              icon="📄"
              actionLabel="Upload"
              component={<UploadAndTranscribe />}
            />
          </motion.div>

          <motion.div
            id="logs"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <AutomationCard
              title="Live Console"
              description="View backend processing, AI response logs and status feeds"
              icon="🖥️"
              actionLabel="Console"
              component={<StatusConsole />}
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
