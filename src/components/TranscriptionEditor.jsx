// src/components/TranscriptEditor.jsx
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function TranscriptEditor({ value, onChange }) {
  const editorRef = useRef(null);

  // Keep the contentEditable div in sync with `value`
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerText) {
      editorRef.current.innerText = value;
    }
  }, [value]);

  const handleInput = () => {
    onChange?.(editorRef.current.innerText);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 shadow-inner"
    >
      <h3 className="text-lg font-semibold text-white mb-2">
        Editable Transcript
      </h3>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="min-h-[300px] whitespace-pre-wrap focus:outline-none text-base leading-7 text-zinc-200 font-sans tracking-normal"
        spellCheck
      />
      <p className="text-sm text-zinc-400 mt-2">
        Tip: Use <strong>Ctrl+Z</strong> to undo, <strong>Ctrl+Y</strong> to redo,
        and copy/paste freely.
      </p>
    </motion.div>
  );
}
