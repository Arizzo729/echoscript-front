// src/components/TranscriptEditor.jsx
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

export default function TranscriptEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerText) {
      editorRef.current.innerText = value;
    }
  }, [value]);

  const handleInput = () => {
    if (onChange) {
      onChange(editorRef.current.innerText);
    }
  };

  const highlightSearch = () => {
    const editor = editorRef.current;
    if (!editor || !searchTerm) return;

    const text = value;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    const highlighted = text.replace(regex, "<mark>$1</mark>");

    editor.innerHTML = highlighted;
  };

  useEffect(() => {
    if (searchTerm) highlightSearch();
    else if (editorRef.current) editorRef.current.innerText = value;
  }, [searchTerm]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 shadow-inner relative space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Editable Transcript
        </h3>
        <button
          onClick={() => {
            setShowSearch((prev) => !prev);
            setSearchTerm("");
            if (editorRef.current) editorRef.current.innerText = value;
          }}
          className="text-sm flex items-center gap-1 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300"
        >
          <Search size={16} />
          {showSearch ? "Close" : "Search"}
        </button>
      </div>

      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transcript..."
              className="w-full mt-2 px-3 py-2 bg-zinc-800 text-white rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="min-h-[300px] whitespace-pre-wrap focus:outline-none text-base leading-7 text-zinc-200 font-sans tracking-normal overflow-auto max-h-[400px]"
        spellCheck={true}
      />

      <p className="text-sm text-zinc-400 mt-2">
        Tip: Use <strong>Ctrl+Z</strong> to undo, <strong>Ctrl+Y</strong> to redo, and copy/paste freely.
      </p>
    </motion.div>
  );
}

