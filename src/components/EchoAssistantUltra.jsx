<<<<<<< Updated upstream
// File: src/assistantClient.js
import OpenAI from 'openai';

/**
 * AssistantClient handles conversation with OpenAI, streaming responses,
 * integrates RAG, sentiment analysis, and dynamic prompt tuning.
 */
export default class AssistantClient {
  constructor({ apiKey, model = 'gpt-4o-mini', memory, analytics }) {
    this.openai = new OpenAI({ apiKey });
    this.model = model;
    this.memory = memory;
    this.analytics = analytics;
  }

  /**
   * Send a user message, apply dynamic tuning, stream the assistant reply.
   */
  async *sendMessageStream({ context, transcript, history, userMessage }) {
    // 1. Retrieve top-K collective and personal memories
    const [personal, collective] = await Promise.all([
      this.memory.queryPersonal(userMessage, 5),
      this.memory.queryCollective(userMessage, 5)
    ]);
    const memPrompt = ["## Personal Memory:", ...personal.map(m=>m.content),
                       "## Collective Memory:", ...collective.map(m=>m.content)].join('\n') || '';

    // 2. Sentiment analysis on userMessage
    const sentimentRes = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role:'system', content: 'Rate sentiment: positive, neutral, or negative.' },
                 { role:'user', content: userMessage }]
    });
    const sentiment = sentimentRes.choices[0].message.content.trim().toLowerCase();
    this.analytics.trackSentiment(userMessage, sentiment);

    // 3. Dynamic prompt tuning based on sentiment and past performance
    const temperature = sentiment === 'positive' ? 0.7 : sentiment === 'negative' ? 0.5 : 0.6;
    const systemPrompt =
      `You are Echo, an empathetic AI assistant. Tone: ${sentiment}. ` +
      `Memory:\n${memPrompt}\nContext:\n${context}\nTranscript:\n${transcript}`;

    // 4. Build messages
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: userMessage }
    ];

    // 5. Stream response
    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages,
      temperature,
      stream: true,
    });

    let aggregated = '';
    for await (const part of response) {
      const token = part.choices?.[0].delta?.content;
      if (token) {
        aggregated += token;
        yield token;
      }
    }

    // 6. Save to both memories and analytics
    await Promise.all([
      this.memory.savePersonal({ userMessage, response: aggregated }),
      this.memory.saveCollective({ userMessage, response: aggregated }),
      this.analytics.trackExchange({ userMessage, response: aggregated, sentiment })
    ]);
  }

  async sendMessage(opts) {
    const chunks = [];
    for await (const token of this.sendMessageStream(opts)) chunks.push(token);
    return chunks.join('');
  }
}


// File: src/vectorMemory.js
import OpenAI from 'openai';
import { PineconeClient } from '@pinecone-database/pinecone';

/**
 * VectorMemory supports personal and collective RAG stores.
 */
export default class VectorMemory {
  constructor({ openaiApiKey, pineconeApiKey, pineconeEnv, personalIndex, collectiveIndex }) {
    this.openai = new OpenAI({ apiKey: openaiApiKey });
    const pinecone = new PineconeClient();
    pinecone.init({ apiKey: pineconeApiKey, environment: pineconeEnv });
    this.personalIdx = pinecone.Index(personalIndex);
    this.collectiveIdx = pinecone.Index(collectiveIndex);
  }

  async embed(text) {
    const res = await this.openai.embeddings.create({ model:'text-embedding-ada-002', input:text });
    return res.data[0].embedding;
  }

  async queryIdx(idx, text, topK) {
    const vec = await this.embed(text);
    const { matches } = await idx.query({ vector:vec, topK, includeMetadata:true });
    return matches.map(m=>m.metadata);
  }

  async queryPersonal(text, topK) { return this.queryIdx(this.personalIdx, text, topK); }
  async queryCollective(text, topK) { return this.queryIdx(this.collectiveIdx, text, topK); }

  async saveIdx(idx, { userMessage, response }) {
    const content = `${userMessage}\n${response}`;
    const vec = await this.embed(content);
    const id = `${Date.now()}`;
    await idx.upsert({ vectors:[{ id, values: vec, metadata:{ content, timestamp:new Date().toISOString() } }] });
  }
  async savePersonal(opts) { return this.saveIdx(this.personalIdx, opts); }
  async saveCollective(opts) { return this.saveIdx(this.collectiveIdx, opts); }
}


// File: src/analytics.js
/**
 * Analytics tracks sentiment and exchanges for tuning and dashboards.
 */
export default class Analytics {
  constructor(reportEndpoint) {
    this.endpoint = reportEndpoint;
  }

  async trackSentiment(message, sentiment) {
    await fetch(this.endpoint + '/sentiment', { method:'POST', body:JSON.stringify({ message, sentiment }) });
  }

  async trackExchange(data) {
    await fetch(this.endpoint + '/exchange', { method:'POST', body:JSON.stringify(data) });
  }
}


// File: src/hooks/useEchoAssistant.js
import { useState, useEffect, useRef } from 'react';
import AssistantClient from '../assistantClient';
import VectorMemory from '../vectorMemory';
import Analytics from '../analytics';

export default function useEchoAssistant({ context, transcript, userId, keys, indices, analyticsEndpoint, model }) {
  const memoryRef = useRef(new VectorMemory({
    openaiApiKey: keys.openai,
    pineconeApiKey: keys.pinecone,
    pineconeEnv: keys.env,
    personalIndex: indices.personal,
    collectiveIndex: indices.collective
  }));
  const analyticsRef = useRef(new Analytics(analyticsEndpoint));
  const clientRef = useRef(new AssistantClient({
    apiKey: keys.openai,
    model,
    memory: memoryRef.current,
    analytics: analyticsRef.current
  }));

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`echo_conv_${userId}`);
    if (stored) setHistory(JSON.parse(stored));
  }, [userId]);

  useEffect(() => { localStorage.setItem(`echo_conv_${userId}`, JSON.stringify(history)); }, [history]);

  const sendMessage = async (msg) => {
    setLoading(true); setTyping(true);
    setHistory(h => [...h, { role:'user', content:msg }]);
    try {
      let text = '';
      for await (const token of clientRef.current.sendMessageStream({ context, transcript, history, userMessage: msg })) {
        text += token;
        setHistory(h=>[...h.slice(0,-1), { role:'assistant', content:text }]);
      }
    } catch (e) {
      setHistory(h=>[...h, { role:'assistant', content:'Error occurred.' }]);
    } finally {
      setTyping(false); setLoading(false);
    }
  };

  return { history, sendMessage, loading, typing };
}


// File: src/components/EchoAssistantUltra.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Loader2, Wand2, Smile, Meh, Frown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import useEchoAssistant from '../hooks/useEchoAssistant';

export default function EchoAssistantUltra({ user, context, transcript, config }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef();
  const { history, sendMessage, loading, typing } = useEchoAssistant({
    context, transcript, userId: user.id,
    keys: config.keys, indices: config.indices,
    analyticsEndpoint: config.analyticsEndpoint,
    model: config.model
  });
  const [sentiment, setSentiment] = useState('neutral');

  // update sentiment icon based on last analysis
  useEffect(() => {
    if (history.length > 0) {
      const last = history[history.length-1];
      if (last.role==='assistant') setSentiment(last.sentiment || 'neutral');
    }
  }, [history]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior:'smooth' }); }, [history]);

  const handleSend = e => { e.preventDefault(); if (!input.trim()) return; sendMessage(input.trim()); setInput(''); };

  const sentimentIcon = {
    positive: <Smile className="text-green-500"/>,
    negative: <Frown className="text-red-500"/>,
    neutral: <Meh className="text-yellow-500"/>
  }[sentiment];

  return (
    <>
      <motion.button onClick={()=>setOpen(o=>!o)}
        className="fixed bottom-6 right-6 p-3 bg-gradient-to-tr from-teal-600 to-teal-400 rounded-full">
        <Wand2 className="w-5 h-5 text-white" />
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed bottom-20 right-6 w-80 max-h-[70vh] bg-white border rounded-xl z-50 flex flex-col"
            initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:20 }}>
            <div className="flex items-center justify-between p-2 border-b">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-teal-500" /> <span>Echo</span> {sentimentIcon}
              </div>
              <button onClick={()=>setOpen(false)}><X/></button>
            </div>
            <div className="flex-1 overflow-auto p-2 space-y-2">
              {history.map((m,i)=>(
                <div key={i} className={`flex ${m.role==='user'?'justify-end':''}`}>...
              ))}
              <div ref={scrollRef}/>
            </div>
            <form onSubmit={handleSend} className="flex p-2 border-t">
              <input className="flex-1 p-2 rounded" value={input} onChange={e=>setInput(e.target.value)} disabled={loading}/>
              <button className="ml-2 p-2 bg-teal-600 text-white rounded" disabled={loading}><Send size={16}/></button>
=======
// ✅ EchoAssistantUltra.jsx — Enhanced, Optimized, and Advanced
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Loader2, Wand2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

const persona = {
  name: "Echo",
  greeting:
    "Hi, I'm Echo — your smart assistant. Try commands like `/summarize`, `/clarify`, `/lookup`, `/export`, or `/feedback`.",
};

const suggestions = [
  { label: "Summarize Transcript", command: "/summarize" },
  { label: "Clarify a Section", command: "/clarify" },
  { label: "Look Up Topic", command: "/lookup AI models" },
  { label: "Export Content", command: "/export" },
];

const fuzzyMatch = (input) => {
  const clean = input.toLowerCase().trim();
  if (clean.startsWith("/sum")) return { command: "summarize" };
  if (clean.startsWith("/clar")) return { command: "clarify" };
  if (clean.startsWith("/look")) return { command: "lookup", arg: clean.split(" ").slice(1).join(" ") };
  if (clean.startsWith("/feed")) return { command: "feedback" };
  if (clean.startsWith("/exp")) return { command: "export" };
  if (clean.match(/help|tools|suggest/i)) return { command: "suggest" };
  return null;
};

export default function EchoAssistantUltra({
  user = { name: "User", plan: "Free", id: "anon" },
  context = "Dashboard",
  transcript = "",
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([{ role: "assistant", content: persona.greeting }]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const toggle = () => setOpen(!open);

  useEffect(() => {
    const handler = (e) => e.shiftKey && e.key === "A" && toggle();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const sendRequest = async (msg, cmd) => {
    setLoading(true);

    const systemPrompt = `You are Echo, a helpful and intuitive assistant. Context: ${context}. Transcript: ${transcript}. Assist clearly and professionally.`;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/assistant/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_prompt: systemPrompt,
          transcript,
          question: msg,
          history,
          user_id: user.id,
          mode: "auto",
          tone: "friendly",
          voice: "coach",
        }),
      });
      const data = await res.json();
      const reply = data?.response?.trim();

      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: reply || "🤔 I'm not sure I understood that—could you rephrase?" },
      ]);
    } catch {
      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ An error occurred. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const msg = input.trim();
    setInput("");
    setHistory((prev) => [...prev, { role: "user", content: msg }]);

    const cmd = fuzzyMatch(msg);

    if (cmd?.command === "lookup") {
      setHistory((prev) => [...prev, { role: "assistant", content: `🔍 Looking up **${cmd.arg}**...` }]);
      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          { role: "assistant", content: "📘 Real-time lookup is coming soon!" },
        ]);
        setLoading(false);
      }, 1200);
      return;
    }

    if (cmd?.command === "suggest") {
      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: suggestions.map((s) => `- \`${s.command}\`: ${s.label}`).join("\n") },
      ]);
      setLoading(false);
      return;
    }

    sendRequest(msg, cmd);
  };

  return (
    <>
      <motion.button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-tr from-teal-600 to-teal-400 hover:from-teal-700 hover:to-teal-500 text-white rounded-full shadow-xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        aria-label="Toggle Echo Assistant"
      >
        <Wand2 className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-20 right-6 w-80 max-h-[70vh] bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded-xl shadow-xl z-50 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {/* Header and messages UI remains the same, trimmed for brevity */}

            <form onSubmit={handleSend} className="flex p-2 border-t dark:border-zinc-700">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Echo anything..."
                className="flex-1 p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-sm"
              />
              <button className="ml-2 bg-teal-600 hover:bg-teal-700 rounded text-white p-2" disabled={loading}>
                <Send size={16} />
              </button>
>>>>>>> Stashed changes
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

<<<<<<< Updated upstream

// File: src/scripts/conversation.js
import dotenv from 'dotenv'; dotenv.config();
import AssistantClient from '../src/assistantClient';
import VectorMemory from '../src/vectorMemory';
import Analytics from '../src/analytics';

(async()=>{
  const memory = new VectorMemory({
    openaiApiKey: process.env.OPENAI_API_KEY,
    pineconeApiKey: process.env.PINECONE_API_KEY,
    pineconeEnv: process.env.PINECONE_ENV,
    personalIndex: process.env.PINECONE_PERSONAL,
    collectiveIndex: process.env.PINECONE_COLLECTIVE
  });
  const analytics = new Analytics(process.env.ANALYTICS_URL);
  const client = new AssistantClient({ apiKey:process.env.OPENAI_API_KEY, memory, analytics });
  const history = [];
  for(const msg of ['Hello','How do you handle errors?','Summarize our chat so far.']){
    console.log('User>',msg);
    let out=''; for await(const t of client.sendMessageStream({ context:'App', transcript:'', history, userMessage:msg })){ process.stdout.write(t); out+=t; }
    console.log('\nAssistant>',out);
    history.push({ role:'user', content:msg },{ role:'assistant', content:out });
  }
})();
=======
>>>>>>> Stashed changes
