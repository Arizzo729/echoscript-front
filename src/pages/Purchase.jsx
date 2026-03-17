import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BadgeCheck, Sparkles, GraduationCap, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SERVER_URL } from "../lib/api";

export default function PurchasePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isGuest = !user || !user.email;
  const [verifying, setVerifying] = React.useState(false);
  const [eduEmail, setEduEmail] = React.useState("");
  const [showEduVerify, setShowEduVerify] = React.useState(false);

  const plans = [
    {
      id: "guest",
      icon: <BadgeCheck className="w-6 h-6 text-lime-400" />,
      name: t("plans.guest.name", "Guest Plan"),
      price: t("plans.guest.price", "$0"),
      suggested: t("plans.guest.suggested", "Perfect for new users exploring EchoScript.AI"),
      features: [
        t("plans.guest.feature1", "60 minutes/month transcription"),
        t("plans.guest.feature2", "Ad-supported experience"),
        t("plans.guest.feature3", "Save up to 3 transcripts"),
        t("plans.guest.feature4", "Basic AI summaries"),
        t("plans.guest.feature5", "Community access"),
      ],
      bg: "from-zinc-800 to-zinc-900",
      border: "border-lime-400",
      checkout: false,
      link: "/upload",
    },
    {
      id: "pro",
      icon: <Sparkles className="w-6 h-6 text-yellow-400" />,
      name: t("plans.pro.name", "Pro Plan"),
      price: t("plans.pro.price", "$9.99"),
      suggested: t("plans.pro.suggested", "Ideal for professionals and content creators"),
      features: [
        t("plans.pro.feature1", "1,000 minutes/month transcription"),
        t("plans.pro.feature2", "Ad-free experience"),
        t("plans.pro.feature3", "Unlimited transcript storage"),
        t("plans.pro.feature4", "Advanced summaries & formatting"),
        t("plans.pro.feature5", "Priority support"),
      ],
      bg: "from-yellow-900 to-yellow-950",
      border: "border-yellow-400",
      checkout: true,
    },
    {
      id: "premium",
      icon: <Zap className="w-6 h-6 text-pink-500" />,
      name: t("plans.premium.name", "Premium Plan"),
      price: t("plans.premium.price", "$19.99"),
      suggested: t("plans.premium.suggested", "Best for power users and high-volume needs"),
      features: [
        t("plans.premium.feature1", "Unlimited transcription"),
        t("plans.premium.feature2", "Faster AI enhancements"),
        t("plans.premium.feature3", "Audio export tools"),
        t("plans.premium.feature4", "Usage analytics"),
        t("plans.premium.feature5", "Early access to new features"),
      ],
      bg: "from-pink-800 to-pink-950",
      border: "border-pink-500",
      checkout: true,
    },
    {
      id: "edu",
      icon: <GraduationCap className="w-6 h-6 text-sky-400" />,
      name: t("plans.edu.name", "EDU Plan"),
      price: t("plans.edu.price", "$4.99"),
      suggested: t("plans.edu.suggested", "Designed for students, educators, and researchers"),
      features: [
        t("plans.edu.feature1", "500 minutes/month"),
        t("plans.edu.feature2", "Note formatting tools"),
        t("plans.edu.feature3", "Group project support"),
        t("plans.edu.feature4", "Educational license"),
        t("plans.edu.feature5", "Faster turnaround"),
      ],
      bg: "from-sky-900 to-sky-950",
      border: "border-sky-400",
      checkout: true,
    },
    {
      id: "enterprise",
      icon: <Users className="w-6 h-6 text-blue-400" />,
      name: t("plans.enterprise.name", "Enterprise Plan"),
      price: t("plans.enterprise.price", "Click below for more details"),
      suggested: t("plans.enterprise.suggested", "For teams, businesses, and large-scale operations"),
      features: [
        t("plans.enterprise.feature1", "Unlimited transcription"),
        t("plans.enterprise.feature2", "Team collaboration tools"),
        t("plans.enterprise.feature3", "Dedicated onboarding & support"),
        t("plans.enterprise.feature4", "Private cloud or on-premise options"),
        t("plans.enterprise.feature5", "Priority API & compute access"),
      ],
      bg: "from-zinc-800 to-zinc-950",
      border: "border-blue-400",
      checkout: false,
      link: "/contact",
    },
  ];

  const handleSendEduVerify = async () => {
    if (!eduEmail.endsWith(".edu")) {
      alert(t("edu_verify.invalid_email", "Please enter a valid .edu email address."));
      return;
    }
    setVerifying(true);
    try {
      const res = await fetch(`${SERVER_URL}/api/v1/edu/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: eduEmail }),
      });
      if (res.ok) {
        alert(t("edu_verify.success", "Verification email sent! Please check your inbox and click the link to unlock the EDU plan."));
        setShowEduVerify(false);
      } else {
        const data = await res.json();
        alert(data.detail || t("edu_verify.error", "Failed to send verification email."));
      }
    } catch (err) {
      alert(t("edu_verify.error_network", "Error sending verification."));
    } finally {
      setVerifying(false);
    }
  };

  const handleCheckout = async (planId) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert(t("error_generic", "Something went wrong."));
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert(t("payment_error", "Payment error. Please try again."));
    }
  };

  return (
    <motion.div
      className="min-h-screen px-4 py-10 md:px-10 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold">🛒 {t("plans.title", "Choose the Perfect EchoScript Plan")}</h1>
          <p className="text-zinc-400 text-sm">
            {t("secure_checkout", "Secure checkout")} · {t("privacy_respect", "We respect your privacy")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-gradient-to-br ${plan.bg} border-l-4 ${plan.border} rounded-xl shadow-lg p-6 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {plan.icon}
                  <h2 className="text-xl font-semibold">{plan.name}</h2>
                </div>
                <p className={`${plan.id === "enterprise" ? "text-base font-medium text-blue-300" : "text-3xl font-bold text-white"} mb-1`}>
                  {plan.price}
                </p>
                <p className="text-sm text-zinc-400 italic mb-4">{plan.suggested}</p>
                <ul className="space-y-2 text-sm text-zinc-300">
                  {plan.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => {
                  if (plan.id === "guest") return navigate("/upload");
                  if (isGuest) return navigate("/signin");
                  
                  if (plan.id === "edu") {
                    setShowEduVerify(true);
                    return;
                  }

                  return plan.checkout ? handleCheckout(plan.id) : navigate(plan.link);
                }}
                className="mt-6 inline-flex items-center justify-center text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition"
              >
                {t("get_started", "Get Started")}
              </button>
            </div>
          ))}
        </div>

        {showEduVerify && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full space-y-6 shadow-2xl">
              <div className="text-center space-y-2">
                <GraduationCap className="w-12 h-12 text-sky-400 mx-auto" />
                <h2 className="text-2xl font-bold">{t("edu_verify.title", "Verify EDU Email")}</h2>
                <p className="text-zinc-400 text-sm">
                  {t("edu_verify.description", "The EDU plan is exclusive to students and teachers. Please verify your .edu email to unlock this plan.")}
                </p>
              </div>
              
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="yourname@university.edu"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  value={eduEmail}
                  onChange={(e) => setEduEmail(e.target.value)}
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEduVerify(false)}
                    className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition text-sm font-medium"
                  >
                    {t("cancel", "Cancel")}
                  </button>
                  <button
                    onClick={handleSendEduVerify}
                    disabled={verifying}
                    className="flex-1 px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg transition text-sm font-medium"
                  >
                    {verifying ? t("sending", "Sending...") : t("edu_verify.send", "Send Verification")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="w-full bg-zinc-800/70 border border-zinc-700 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 mt-12 shadow-inner">
          <button
            onClick={() => navigate("/purchase/minutes")}
            className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-6 py-3 rounded-lg"
          >
            {t("Buy More Minutes")}
          </button>
          <p className="text-sm text-zinc-400 text-center md:text-left">
            {t("need_help_choosing", "Need help choosing the right plan?")}{" "}
            <a href="/assistant" className="text-teal-400 underline">
              {t("help_choose_plan", "Ask our AI assistant →")}
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
