import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Loader2, AlertCircle, Trash2, Edit2, Eye, 
  X, Save, Search, Calendar, Clock, Languages 
} from "lucide-react";
import { useTranslation } from "react-i18next";
import * as api from "../lib/api";

export default function TranscriptsPage() {
  const { t } = useTranslation();
  const [transcripts, setTranscripts] = useState([]);
  const [filteredTranscripts, setFilteredTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    fetchTranscripts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTranscripts(transcripts);
    } else {
      const filtered = transcripts.filter((t) =>
        t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTranscripts(filtered);
    }
  }, [searchQuery, transcripts]);

  const fetchTranscripts = async () => {
    try {
      setLoading(true);
      const data = await api.getTranscripts();
      if (Array.isArray(data)) {
        setTranscripts(data);
        setFilteredTranscripts(data);
        setError("");
      } else {
        setTranscripts([]);
        setFilteredTranscripts([]);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setError("Failed to load transcripts");
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (transcript) => {
    try {
      const fullTranscript = await api.getTranscript(transcript.id);
      setSelectedTranscript(fullTranscript);
      setEditedTitle(fullTranscript.title || "");
      setEditedContent(fullTranscript.content || "");
      setIsViewing(true);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to load transcript:", err);
      alert("Failed to load transcript details");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedTranscript) return;
    
    try {
      setSaveLoading(true);
      await api.updateTranscript(selectedTranscript.id, {
        title: editedTitle,
        content: editedContent,
      });
      await fetchTranscripts();
      setIsEditing(false);
      setIsViewing(false);
      setSelectedTranscript(null);
      alert("Transcript updated successfully!");
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Failed to save transcript");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transcript?")) {
      return;
    }
    
    try {
      await api.deleteTranscript(id);
      await fetchTranscripts();
      setIsViewing(false);
      setSelectedTranscript(null);
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("Failed to delete transcript");
    }
  };

  const closeModal = () => {
    setIsViewing(false);
    setIsEditing(false);
    setSelectedTranscript(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Unknown date";
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
          {t("transcripts.title", "Your Transcripts")}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Browse, view, edit, and manage all your transcriptions
        </p>
      </motion.div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search transcripts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
          <Loader2 className="animate-spin w-5 h-5" />
          <span>{t("loading", "Loading...")}</span>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      ) : filteredTranscripts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-500/10 mb-4">
            <FileText className="w-8 h-8 text-teal-500" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-2">
            {searchQuery ? "No matching transcripts" : t("transcripts.empty.title", "No Transcripts Yet")}
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            {searchQuery 
              ? "Try adjusting your search query"
              : t("transcripts.empty.description", "Your transcripts will appear here once you start using the transcription service.")}
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTranscripts.map((transcript, index) => (
            <motion.div
              key={transcript.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  <h3 className="font-semibold text-zinc-900 dark:text-white truncate">
                    {transcript.title || "Untitled Transcript"}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {transcript.duration && (
                  <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(transcript.duration)}</span>
                  </div>
                )}
                {transcript.language && (
                  <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <Languages className="w-4 h-4" />
                    <span>{transcript.language.toUpperCase()}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(transcript.created_at)}</span>
                </div>
              </div>

              {transcript.content && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4">
                  {transcript.content}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleView(transcript)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => handleDelete(transcript.id)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isViewing && selectedTranscript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-700">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {isEditing ? "Edit Transcript" : "View Transcript"}
                </h2>
                <div className="flex gap-2">
                  {!isEditing && (
                    <button
                      onClick={handleEdit}
                      className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                    </button>
                  )}
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Title
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                      {selectedTranscript.title || "Untitled"}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Duration</p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {formatDuration(selectedTranscript.duration)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Language</p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {selectedTranscript.language?.toUpperCase() || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Created</p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {formatDate(selectedTranscript.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Status</p>
                    <p className="text-sm font-medium text-teal-600 dark:text-teal-400">
                      {selectedTranscript.status || "completed"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Transcript Content
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      rows={15}
                      className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
                    />
                  ) : (
                    <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                      <p className="text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-mono text-sm">
                        {selectedTranscript.content || "No content available"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="p-6 border-t border-zinc-200 dark:border-zinc-700 flex gap-3 justify-end">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saveLoading}
                    className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {saveLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
