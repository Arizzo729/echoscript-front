// ✅ EchoScript.AI — Success.jsx (Post-Payment Receipt Page)
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Home } from "lucide-react";

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/account");
    }, 7000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      className="max-w-md mx-auto px-6 py-12 text-center text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
      <h1 className="text-3xl font-bold mb-2">Payment Successful</h1>
      <p className="text-zinc-400 mb-6">
        Thank you for your purchase! Your receipt has been emailed to you. Your
        account has been upgraded.
      </p>

      <button
        onClick={() => navigate("/account")}
        className="inline-flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg text-white transition"
      >
        <Home className="w-4 h-4" /> Go to My Account
      </button>

      <p className="text-xs text-zinc-600 mt-6">
        You’ll be redirected shortly. If not, click the button above.
      </p>
    </motion.div>
  );
}
