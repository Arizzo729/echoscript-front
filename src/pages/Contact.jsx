import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Info, Phone, MapPin } from "lucide-react";

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
      className="max-w-4xl mx-auto px-6 py-16 text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold mb-6 text-teal-400">Contact Us</h1>

      <p className="mb-8 text-zinc-400 text-lg">
        Have a question, bug report, or feedback? Fill out the form below or reach out through one of our official channels.
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

      <div className="mt-16 grid gap-4 text-sm text-zinc-400">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-teal-400" /> <span>support@echoscript.ai</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-teal-400" /> <span>+1 (800) 555-9246</span>
        </div>
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-teal-400" /> <span>Mon–Fri, 9am–5pm EST</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-teal-400" /> <span>123 Echo Lane, Tech City, CA 90000</span>
        </div>
      </div>
    </motion.div>
  );
}