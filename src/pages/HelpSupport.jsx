import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  FileText, 
  Book, 
  ExternalLink,
  ChevronRight,
  LifeBuoy
} from "lucide-react";
import Button from "../components/ui/Button";

const categories = [
  {
    title: "Getting Started",
    icon: <Book className="w-5 h-5 text-teal-500" />,
    items: [
      { 
        title: "How to transcribe audio", 
        content: "To transcribe audio, go to the Upload page, select your file, and click 'Transcribe'. EchoScript supports auto-detection of languages and background noise removal." 
      },
      { 
        title: "Supported file formats", 
        content: "EchoScript supports MP3, WAV, FLAC, M4A, AAC, and OGG for audio, and MP4, MKV, and MOV for video." 
      },
      { 
        title: "Managing your account", 
        content: "You can manage your profile, subscription, and security settings in the 'Account' section found in the top-right user menu." 
      }
    ]
  },
  {
    title: "Billing & Plans",
    icon: <FileText className="w-5 h-5 text-blue-500" />,
    items: [
      { 
        title: "Upgrade your plan", 
        content: "Visit the 'Purchase' page to see available plans. Upgrading gives you more minutes, higher file size limits, and priority processing." 
      },
      { 
        title: "Payment methods", 
        content: "We accept all major credit cards and debit cards via Stripe's secure payment gateway." 
      },
      { 
        title: "Refund policy", 
        content: "Refunds are available within 7 days if you haven't used more than 10% of your allocated minutes. Contact support to initiate a request." 
      }
    ]
  },
  {
    title: "Features & Tools",
    icon: <HelpCircle className="w-5 h-5 text-purple-500" />,
    items: [
      { 
        title: "AI Summary guide", 
        content: "After transcribing, use the 'Summarize' button to get a concise version of your transcript powered by advanced AI models." 
      },
      { 
        title: "Speaker identification", 
        content: "Enable 'Speaker Diarization' in settings to automatically label different speakers in your audio files." 
      },
      { 
        title: "Exporting transcripts", 
        content: "You can export your transcripts in various formats including TXT, PDF, and DOCX using the export panel below the transcription view." 
      }
    ]
  }
];

export default function HelpSupport() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <motion.div 
      className="min-h-screen px-4 py-12 bg-zinc-950 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent" data-i18n="help.title">
            {t("help.title", "How can we help?")}
          </h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
            <input 
              type="text"
              placeholder={t("help.search_placeholder", "Search for articles, guides...")}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedArticle ? (
            <motion.div
              key="article"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6"
            >
              <button 
                onClick={() => setSelectedArticle(null)}
                className="text-teal-400 flex items-center gap-2 hover:text-teal-300 transition text-sm font-medium"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                {t("help.back_to_categories", "Back to categories")}
              </button>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white" data-i18n={`help.article_title.${selectedArticle.title.toLowerCase().replace(/ /g, '_')}`}>
                  {t(`help.article_title.${selectedArticle.title.toLowerCase().replace(/ /g, '_')}`, selectedArticle.title)}
                </h2>
                <div className="h-1 w-20 bg-teal-500 rounded-full" />
                <p className="text-zinc-300 leading-relaxed text-lg" data-i18n={`help.article_content.${selectedArticle.title.toLowerCase().replace(/ /g, '_')}`}>
                  {t(`help.article_content.${selectedArticle.title.toLowerCase().replace(/ /g, '_')}`, selectedArticle.content)}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {filteredCategories.map((cat, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition group">
                  <div className="flex items-center gap-3 mb-4">
                    {cat.icon}
                    <h2 className="font-semibold text-zinc-100" data-i18n={`help.category.${cat.title.toLowerCase().replace(/ /g, '_')}`}>{t(`help.category.${cat.title.toLowerCase().replace(/ /g, '_')}`, cat.title)}</h2>
                  </div>
                  <ul className="space-y-3">
                    {cat.items.map((item, idx) => (
                      <li key={idx}>
                        <button 
                          onClick={() => setSelectedArticle(item)}
                          className="text-sm text-zinc-400 hover:text-teal-400 flex items-center justify-between w-full group/item text-left"
                        >
                          <span data-i18n={`help.article_title.${item.title.toLowerCase().replace(/ /g, '_')}`}>
                            {t(`help.article_title.${item.title.toLowerCase().replace(/ /g, '_')}`, item.title)}
                          </span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover/item:opacity-100 transition" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold flex items-center gap-2 justify-center md:justify-start text-white" data-i18n="help.still_need_help">
              <MessageCircle className="w-6 h-6 text-teal-400" />
              {t("help.still_need_help", "Still need assistance?")}
            </h3>
            <p className="text-zinc-400 max-w-md" data-i18n="help.support_description">
              {t("help.support_description", "Our support team is available 24/7 to help you with any technical or account-related questions.")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Button variant="primary" icon={<LifeBuoy />} onClick={() => window.location.href='/contact'}>
              {t("help.contact_support", "Contact Support")}
            </Button>
            <Button variant="outline" icon={<ExternalLink />} onClick={() => window.location.href='/feedback'}>
              {t("help.submit_feedback", "Submit Feedback")}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
