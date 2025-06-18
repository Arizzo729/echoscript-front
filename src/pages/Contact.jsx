// pages/Contact.jsx — EchoScript.AI Contact Us Page (Advanced, Future-Proof)

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Info, Phone } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto px-6 py-16 text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <p className="mb-6 text-zinc-400">
        Have a question, bug report, or feedback? Fill out the form below or reach us directly.
      </p>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          required
          className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
          value={formData.subject}
          onChange={handleChange}
        />
        <textarea
          name="message"
          rows={5}
          placeholder="Your Message"
          required
          className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
          value={formData.message}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-5 rounded-lg flex items-center gap-2"
          disabled={status === "sending"}
        >
          <Send className="w-4 h-4" />
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>

        {status === "success" && (
          <p className="text-green-400 mt-2">✅ Message sent successfully!</p>
        )}
        {status === "error" && (
          <p className="text-red-400 mt-2">❌ Something went wrong. Please try again.</p>
        )}
      </form>

      <div className="mt-12 space-y-3 text-sm text-zinc-400">
        <p className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-teal-400" /> support@echoscript.ai
        </p>
        <p className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-teal-400" /> +1 (800) 555-9246
        </p>
        <p className="flex items-center gap-2">
          <Info className="w-4 h-4 text-teal-400" /> Mon–Fri, 9am–5pm EST
        </p>
      </div>
    </motion.div>
  );
}