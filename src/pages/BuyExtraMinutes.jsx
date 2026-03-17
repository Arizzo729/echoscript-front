import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Trash2, Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import * as api from '../lib/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/ui/Card';
import { useTranslation } from "react-i18next";
import { useSound } from "../context/SoundContext";

const bundles = [
  { id: 1, price: 0.99, minutes: 5, bonus: 0 },
  { id: 2, price: 3.99, minutes: 25, bonus: 15 },
  { id: 3, price: 7.49, minutes: 50, bonus: 30 },
  { id: 4, price: 14.99, minutes: 100, bonus: 60 },
  { id: 5, price: 29.99, minutes: 200, bonus: 120 },
  { id: 6, price: 59.99, minutes: 500, bonus: 240 },
];

export default function BuyExtraMinutes() {
  const { t } = useTranslation();
  const [cart, setCart] = useState({});
  const [gifting, setGifting] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const { playClick } = useSound();
  const navigate = useNavigate();

  const addToCart = (id) => {
    if (playClick) playClick();
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const changeQuantity = (id, delta) => {
    if (playClick) playClick();
    setCart((prev) => {
      const current = prev[id] || 0;
      const updatedQty = current + delta;
      if (updatedQty <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: updatedQty };
    });
  };

  const emptyCart = () => setCart({});

  const handleCheckout = async () => {
    if (Object.keys(cart).length === 0) return;
    
    setIsCheckingOut(true);
    setCheckoutError('');
    
    try {
      const items = Object.entries(cart).map(([id, qty]) => {
        const bundle = bundles.find(b => b.id === Number(id));
        return {
          bundle_id: bundle.id,
          quantity: qty,
          minutes: bundle.minutes + bundle.bonus,
          price: bundle.price
        };
      });

      const response = await fetch(`${api.SERVER_URL}/api/v1/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          mode: 'payment',
          metadata: {
            type: 'extra_minutes',
            items: JSON.stringify(items),
            is_gift: gifting,
            recipient_email: recipient
          }
        }),
      });

      if (!response.ok) {
        let errorDetail = 'Checkout failed';
        try {
          const errorData = await response.json();
          errorDetail = errorData.detail || errorData.message || 'Unknown error';
        } catch (e) {
          // Response is not JSON
          errorDetail = `Server error (${response.status}): ${response.statusText}`;
        }
        setCheckoutError(errorDetail);
        setIsCheckingOut(false);
        return;
      }

      const data = await response.json();
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        setCheckoutError(data.detail || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutError(error.message || 'An error occurred during checkout. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const total = Object.entries(cart).reduce(
    (acc, [id, qty]) => {
      const b = bundles.find((x) => x.id === +id);
      return {
        price: acc.price + b.price * qty,
        minutes: acc.minutes + (b.minutes + b.bonus) * qty,
      };
    },
    { price: 0, minutes: 0 }
  );

  const suggestedId =
    Object.keys(cart).length === 1
      ? Math.min(...Object.keys(cart).map((i) => +i)) + 1
      : null;

  return (
    <div className="flex flex-col-reverse lg:flex-row max-w-5xl mx-auto px-2 sm:px-4 py-6 gap-7">
      <aside className="w-full lg:w-80 flex-shrink-0 sticky lg:top-24 self-start mb-6 lg:mb-0">
        <Card className="bg-zinc-900 border border-teal-500 rounded-2xl shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-teal-400 font-bold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                {t("checkout.cart", "Cart")}
              </CardTitle>
              <span className="text-zinc-500 text-sm">{total.minutes} min</span>
            </div>
            <CardDescription className="text-sm text-zinc-400">
              {Object.keys(cart).length
                ? `${Object.values(cart).reduce((a, b) => a + b, 0)} ${t("item_s", "item(s)")}`
                : t("checkout.cart_empty_title", "Cart is empty")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence>
              {Object.keys(cart).length === 0 ? (
                <p className="text-sm text-zinc-400">{t("checkout.cart_empty_desc", "Your cart is empty.")}</p>
              ) : (
                Object.entries(cart).map(([id, qty]) => {
                  const item = bundles.find((b) => b.id === +id);
                  const minutes = (item.minutes + item.bonus) * qty;
                  const cost = item.price * qty;

                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex justify-between items-center bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-teal-400">
                          <ShoppingCart className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-base text-white font-semibold">
                            {minutes} min
                          </p>
                          <p className="text-xs text-zinc-400">${cost.toFixed(2)}</p>
                          <div className="flex gap-2 mt-1 items-center">
                            <Button
                              variant="ghost"
                              className="p-1 h-auto"
                              onClick={() => changeQuantity(item.id, -1)}
                              aria-label="Decrease"
                            >
                              <Minus className="w-4 h-4 text-teal-300" />
                            </Button>
                            <span className="text-base text-white">{qty}</span>
                            <Button
                              variant="ghost"
                              className="p-1 h-auto"
                              onClick={() => changeQuantity(item.id, 1)}
                              aria-label="Increase"
                            >
                              <Plus className="w-4 h-4 text-teal-300" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-400/10 rounded-lg"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
            <div className="pt-3 border-t border-zinc-700 text-base text-white space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-400">{t("checkout.total_minutes", "Total Minutes:")}</span>
                <span className="font-bold text-white">{total.minutes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">{t("checkout.total_cost", "Total Cost:")}</span>
                <span className="font-bold text-white">${total.price.toFixed(2)}</span>
              </div>
            </div>
            {suggestedId && suggestedId <= bundles.length && (
              <p className="mt-2 text-xs text-teal-400 italic">
                {t("consider_upgrade", "Consider upgrading for more value!")}
              </p>
            )}
            <div className="flex items-center gap-2 pt-2">
              <input
                id="gift"
                type="checkbox"
                checked={gifting}
                onChange={() => setGifting(!gifting)}
                className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-teal-500 focus:ring-teal-500"
              />
              <label htmlFor="gift" className="text-sm text-zinc-300 flex items-center gap-2 cursor-pointer">
                <Gift className="w-4 h-4 text-teal-400" />
                {t("checkout.gift_option", "Gift")}
              </label>
            </div>
            {gifting && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <input
                    type="email"
                    placeholder="Recipient email"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="mt-2 w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-500"
                  />
                </motion.div>
              </AnimatePresence>
            )}
            {checkoutError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-sm text-red-300"
              >
                {checkoutError}
              </motion.div>
            )}
            <Button
              size="lg"
              className="w-full bg-teal-600 hover:bg-teal-500 mt-4 text-base font-bold rounded-2xl transition-all shadow-lg shadow-teal-900/20"
              onClick={handleCheckout}
              disabled={Object.keys(cart).length === 0 || isCheckingOut}
            >
              {isCheckingOut ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  {t("checkout.processing", "Processing...")}
                </span>
              ) : (
                t("checkout.checkout_btn", "Checkout")
              )}
            </Button>
            {Object.keys(cart).length > 0 && (
              <button
                onClick={emptyCart}
                className="mt-3 text-xs text-zinc-400 hover:text-teal-300 underline transition-colors"
              >
                {t("empty_cart", "Empty Cart")}
              </button>
            )}
          </CardContent>
        </Card>
      </aside>

      <div className="flex-1 flex flex-col">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-zinc-400 hover:text-teal-300 transition-colors mb-5 w-max"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("Return", "Return")}
          </button>

        <section className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4">
          {bundles.map((bundle) => (
            <motion.div
              key={bundle.id}
              whileHover={{ scale: 1.02 }}
              className="transition-transform h-full"
            >
              <Card className={`h-full flex flex-col justify-between bg-zinc-900 border-2 rounded-2xl shadow hover:border-teal-500 transition-colors ${bundle.id === 5 ? 'border-teal-500 bg-teal-500/5' : 'border-zinc-800'}`}>
                <CardHeader className="p-6 flex flex-col items-center text-center space-y-2">
                  <div className="text-2xl font-bold text-white">
                    ${bundle.price.toFixed(2)}
                  </div>
                  <div className="text-teal-400 font-medium">
                    {bundle.minutes + bundle.bonus} min
                    {bundle.bonus > 0 && (
                      <span className="text-zinc-500 text-xs ml-1">
                        ({bundle.minutes}+{bundle.bonus})
                      </span>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-teal-500 hover:text-teal-400 hover:bg-teal-400/10 rounded-full mt-2"
                    onClick={() => addToCart(bundle.id)}
                    aria-label="Add bundle"
                  >
                    <Plus className="w-6 h-6" />
                  </Button>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </section>
      </div>
    </div>
  );
}
