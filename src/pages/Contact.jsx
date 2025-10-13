<<<<<<< Updated upstream
// src/pages/Contact.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, Info, MapPin, ChevronDown, ChevronUp } from "lucide-react";
=======
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, Info, Phone, MapPin, ChevronDown, ChevronUp } from "lucide-react";
>>>>>>> Stashed changes
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();
<<<<<<< Updated upstream
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);
  const [showHours, setShowHours] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // honeypot to reduce spam
  const [hp, setHp] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
=======
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState(null);
  const [showHours, setShowHours] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
>>>>>>> Stashed changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
<<<<<<< Updated upstream
    setErrorMsg("");

    // Try multiple known server routes; succeed on the first that responds OK.
    const endpoints = ["/api/contact", "/api/v1/contact", "/api/feedback"];

    try {
      let lastText = "";
      for (const url of endpoints) {
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ ...formData, hp }),
          });

          if (res.ok) {
            setStatus("success");
            setFormData({ name: "", email: "", subject: "", message: "" });
            setHp("");
            return; // done!
          }

          // If it's a 404, try the next candidate endpoint.
          const txt = await res.text().catch(() => "");
          lastText = txt || lastText;
          if (res.status === 404) continue;

          // Any other error: stop trying and show it.
          setStatus("error");
          setErrorMsg(txt || `HTTP ${res.status}`);
          return;
        } catch (innerErr) {
          // Network/other error; try next endpoint
          lastText = String(innerErr?.message || innerErr) || lastText;
        }
      }

      // If we get here, all candidates failed (likely 404s)
      setStatus("error");
      setErrorMsg(lastText || "Endpoint not found");
    } catch (err) {
      setStatus("error");
      setErrorMsg(String(err?.message || err));
=======

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
>>>>>>> Stashed changes
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto px-6 py-16 text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold mb-6 text-teal-400">
        {t("contact.title", "Contact")}
      </h1>
      <p className="mb-8 text-zinc-400 text-lg">
        {t("contact.subtitle", "Reach out to us with any questions, feedback, or support needs.")}
      </p>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          id="name"
          type="text"
          name="name"
          placeholder={t("contact.name", "Name")}
          required
          className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white w-full"
          value={formData.name}
          onChange={handleChange}
        />
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        <input
          id="email"
          type="email"
          name="email"
          placeholder={t("contact.email", "Email")}
          required
          className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white w-full"
          value={formData.email}
          onChange={handleChange}
        />
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        <input
          id="subject"
          type="text"
          name="subject"
          placeholder={t("contact.subject", "Subject")}
          required
          className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white w-full"
          value={formData.subject}
          onChange={handleChange}
        />
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder={t("contact.message", "Message")}
          required
          className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white w-full"
          value={formData.message}
          onChange={handleChange}
        />

<<<<<<< Updated upstream
        {/* honeypot (hidden) */}
        <input
          type="text"
          name="hp"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

=======
>>>>>>> Stashed changes
        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-5 rounded-lg flex items-center gap-2 transition"
          disabled={status === "sending"}
        >
          <Send className="w-4 h-4" />
          {status === "sending" ? t("contact.sending", "Sending...") : t("contact.send", "Send")}
        </button>

        {status === "success" && (
          <p className="text-green-400 mt-2">
            {t("contact.success", "Message sent successfully!")}
          </p>
        )}
        {status === "error" && (
<<<<<<< Updated upstream
          <p className="text-red-400 mt-2 whitespace-pre-wrap">
            {t("contact.error", "Something went wrong. Please try again later.")}
            {errorMsg ? `\n${errorMsg}` : ""}
=======
          <p className="text-red-400 mt-2">
            {t("contact.error", "Something went wrong. Please try again later.")}
>>>>>>> Stashed changes
          </p>
        )}
      </form>

      <div className="mt-16 grid gap-4 text-sm text-zinc-300">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-teal-400" /> <span>support@echoscript.ai</span>
        </div>
<<<<<<< Updated upstream
=======
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-teal-400" /> <span>+1 (800) 555-9246</span>
        </div>
>>>>>>> Stashed changes

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShowHours(!showHours)}
            className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-lg border w-fit transition-all duration-200 ${
              showHours
                ? "bg-teal-700/10 border-teal-400 text-teal-300"
                : "border-zinc-600 text-zinc-100 hover:text-teal-200 hover:border-teal-400"
            }`}
          >
            <Info className="w-4 h-4 text-teal-400" />
            <span>{t("contact.hours", "Contact Hours")}</span>
<<<<<<< Updated upstream
            {showHours ? <ChevronUp className="w-3 h-3 text-teal-300" /> : <ChevronDown className="w-3 h-3 text-teal-300" />}
=======
            {showHours ? (
              <ChevronUp className="w-3 h-3 text-teal-300" />
            ) : (
              <ChevronDown className="w-3 h-3 text-teal-300" />
            )}
>>>>>>> Stashed changes
          </button>

          <AnimatePresence>
            {showHours && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-7 text-zinc-400"
              >
                {t(
                  "contact.hours_description",
                  "We are available to contact 24/7! However, our team is small right now, so we’ll respond as soon as possible. Thank you for choosing EchoScript.AI!"
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-teal-400" />
<<<<<<< Updated upstream
          <span>{t("contact.address", "United States (EST)")}</span>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-zinc-800 text-sm text-zinc-400 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <span>© {new Date().getFullYear()} EchoScript.AI</span>
        <div className="flex items-center gap-4">
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-teal-300 hover:text-teal-200 underline underline-offset-4">
            Privacy Policy
          </a>
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-teal-300 hover:text-teal-200 underline underline-offset-4">
            Terms of Service
          </a>
=======
          <span>{t("contact.address", "123 Echo Lane, Transcribe City, AI 12345")}</span>
>>>>>>> Stashed changes
        </div>
      </div>
    </motion.div>
  );
}
<<<<<<< Updated upstream
=======


>>>>>>> Stashed changes
