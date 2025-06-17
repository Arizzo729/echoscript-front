import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  LogOut,
  Moon,
  Sun,
  BadgeCheck,
  FileText,
} from "lucide-react";
import Button from "../components/ui/Button";

export default function Account() {
  const [user, setUser] = useState({
    name: "Echo User",
    email: "user@example.com",
    plan: "Pro",
    minutesUsed: 227,
    sessions: 15,
    darkMode: false,
    avatar: "/default-avatar.png",
  });

  const [transcripts, setTranscripts] = useState([]);
  const [show2FA, setShow2FA] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    setTranscripts([
      {
        id: 1,
        title: "Podcast with John",
        date: "2025-05-25",
        summary: "Discussed AI, business, and startup trends.",
        format: "MP3",
        size: "24MB",
      },
      {
        id: 2,
        title: "Sales Meeting",
        date: "2025-05-22",
        summary: "Client call outlining sales roadmap.",
        format: "WAV",
        size: "13MB",
      },
    ]);
  }, []);

  useEffect(() => {
    fetch("/api/security/2fa-status")
      .then((res) => res.json())
      .then((data) => setTwoFactorEnabled(data.enabled))
      .catch(console.error);
  }, []);

  const toggleDarkMode = () => {
    const nextMode = !user.darkMode;
    setUser((prev) => ({ ...prev, darkMode: nextMode }));
    document.documentElement.classList.toggle("dark", nextMode);
  };

  return (
    <motion.div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-br from-teal-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
          👤 Your Account
        </h1>
        <div className="flex gap-3">
          <Button
            onClick={toggleDarkMode}
            size="sm"
            variant="ghost"
            icon={user.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          >
            {user.darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
          <Button size="sm" variant="danger" icon={<LogOut className="w-4 h-4" />}>
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card title="👤 Profile">
          <div className="flex items-center gap-4 mb-3">
            <img
              src={user.avatar}
              alt="avatar"
              className="w-16 h-16 rounded-full border border-zinc-400 dark:border-zinc-600 object-cover"
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm text-teal-500 hover:underline cursor-pointer">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setUser((prev) => ({ ...prev, avatar: reader.result }));
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="hidden"
                />
              </label>
              <Button size="xs" variant="outline" onClick={() => setShowAvatarPicker(true)}>
                Choose Avatar
              </Button>
            </div>
          </div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p className="flex items-center gap-2">
            <strong>Plan:</strong>
            <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-teal-600 text-white">
              <BadgeCheck className="w-3 h-3 mr-1" />
              {user.plan}
            </span>
          </p>
          <Button size="xs" variant="outline" className="mt-3 hover:border-teal-400 hover:text-teal-400">
            Manage Plan
          </Button>
        </Card>

        <Card title="📊 Usage">
          <p><strong>Minutes Used:</strong> {user.minutesUsed}</p>
          <p><strong>Sessions:</strong> {user.sessions}</p>
          <div className="mt-4">
            <label className="text-sm text-zinc-500 dark:text-zinc-400">Monthly Usage</label>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-3 rounded-full mt-1">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-teal-400 to-blue-500"
                style={{ width: `${Math.min((user.minutesUsed / 500) * 100, 100)}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-zinc-800 dark:text-white">
          <FileText className="w-5 h-5 text-blue-500" />
          Saved Transcripts
        </h2>
        {transcripts.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">You haven’t saved any transcripts yet.</p>
        ) : (
          <div className="space-y-4">
            {transcripts.map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-start bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded-xl p-4 hover:shadow-md"
              >
                <div className="flex-1">
                  <p className="font-medium text-zinc-900 dark:text-white">{t.title}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {t.date} • {t.format} • {t.size}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">{t.summary}</p>
                  <div className="flex gap-3 mt-2">
                    <Button variant="ghost" size="xs">Copy</Button>
                    <Button variant="ghost" size="xs">Summarize</Button>
                  </div>
                </div>
                <Button variant="ghost" size="xs" icon={<Download className="w-4 h-4" />}>
                  Download
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12">
        <Card title="🔒 Security & Privacy">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Add extra security via email or authenticator app.
                </p>
              </div>
              <Button size="xs" variant="outline" onClick={() => setShow2FA(true)}>
                {twoFactorEnabled ? "Manage" : "Enable"}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <AnimatePresence>
        {show2FA && (
          <Modal title="Two-Factor Authentication" onClose={() => setShow2FA(false)}>
            <p className="text-sm mb-2">
              2FA is currently {twoFactorEnabled ? "enabled" : "disabled"}.
            </p>
            <Button
              onClick={async () => {
                const next = !twoFactorEnabled;
                try {
                  const res = await fetch("/api/security/2fa-toggle", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ enable: next }),
                  });
                  const result = await res.json();
                  if (result.status === "success") {
                    setTwoFactorEnabled(next);
                    setShow2FA(false);
                  } else {
                    alert("Error updating 2FA.");
                  }
                } catch {
                  alert("Failed to update 2FA status.");
                }
              }}
            >
              {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
            </Button>
          </Modal>
        )}

        {showAvatarPicker && (
          <Modal title="Choose Avatar" onClose={() => setShowAvatarPicker(false)}>
            <div className="grid grid-cols-4 gap-3">
              {["avatar1.jpg", "avatar2.jpg", "avatar3.jpg"].map((img) => (
                <img
                  key={img}
                  src={`/avatars/${img}`}
                  alt="avatar"
                  className="w-16 h-16 rounded-full cursor-pointer hover:ring-2 ring-teal-400"
                  onClick={() => {
                    setUser((prev) => ({ ...prev, avatar: `/avatars/${img}` }));
                    setShowAvatarPicker(false);
                  }}
                />
              ))}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border dark:border-zinc-700 shadow-md space-y-2">
      <h3 className="text-lg font-semibold mb-2 bg-gradient-to-br from-teal-400 to-blue-500 bg-clip-text text-transparent">
        {title}
      </h3>
      <div className="text-sm text-zinc-700 dark:text-zinc-300 space-y-1">{children}</div>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-md shadow-xl space-y-4"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-sm text-red-500 hover:underline">Close</button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

