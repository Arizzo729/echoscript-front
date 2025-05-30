import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

export function UploadAndTranscribe() {
  const [file, setFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [sentiment, setSentiment] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Start microphone recording
  const startRecording = async () => {
    setError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Microphone not supported on this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await uploadAndTranscribe(audioBlob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      setError('Could not access microphone.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // Handle file upload
  const handleFileChange = async (e) => {
    setError(null);
    if (e.target.files.length === 0) return;
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    await uploadAndTranscribe(selectedFile);
  };

  // Upload file/audio and call backend to transcribe & analyze
  const uploadAndTranscribe = async (inputFile) => {
    setLoading(true);
    setTranscript('');
    setSummary('');
    setSentiment(null);
    setKeywords([]);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', inputFile);

      // Assuming /api/transcribe-enhanced is your advanced AI backend endpoint
      const response = await fetch('/api/transcribe-enhanced', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to transcribe.');

      const result = await response.json();

      // Expected result: { transcript, summary, sentiment, keywords }
      setTranscript(result.transcript);
      setSummary(result.summary);
      setSentiment(result.sentiment);
      setKeywords(result.keywords);
    } catch (err) {
      setError(err.message || 'An error occurred during transcription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-lg max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col gap-4">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Upload audio/video file or record live:
        </label>

        <input
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileChange}
          disabled={loading || recording}
          className="block w-full text-sm text-zinc-600 dark:text-zinc-400 file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0 file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        <div className="flex gap-4 items-center">
          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold
            ${recording ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
            aria-label={recording ? 'Stop recording' : 'Start recording'}
          >
            <Mic size={18} />
            {recording ? 'Stop Recording' : 'Record Live'}
          </button>

          {loading && <div className="text-sm text-zinc-500 dark:text-zinc-400 italic">Processing...</div>}
          {error && (
            <div className="text-sm text-red-500 flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {!loading && !error && transcript && (
            <div className="text-sm text-green-600 flex items-center gap-2">
              <CheckCircle size={16} /> Transcription ready
            </div>
          )}
        </div>

        {/* Transcript output */}
        {transcript && (
          <section className="mt-6 bg-zinc-100 dark:bg-zinc-900 p-4 rounded-md max-h-64 overflow-y-auto text-zinc-900 dark:text-zinc-100">
            <h3 className="font-semibold mb-2">Transcript</h3>
            <p className="whitespace-pre-wrap">{transcript}</p>
          </section>
        )}

        {/* AI Summary */}
        {summary && (
          <section className="mt-4 bg-blue-50 dark:bg-blue-900 p-4 rounded-md text-blue-800 dark:text-blue-300">
            <h4 className="font-semibold mb-1">Summary</h4>
            <p className="italic">{summary}</p>
          </section>
        )}

        {/* Sentiment */}
        {sentiment && (
          <section className="mt-4 p-4 rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
            <h4 className="font-semibold mb-1">Sentiment Analysis</h4>
            <p>{sentiment}</p>
          </section>
        )}

        {/* Keywords */}
        {keywords.length > 0 && (
          <section className="mt-4 p-4 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100">
            <h4 className="font-semibold mb-2">Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="bg-blue-300 dark:bg-blue-600 px-3 py-1 rounded-full text-xs font-medium cursor-default select-none"
                >
                  {kw}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
}
