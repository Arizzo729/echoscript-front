import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Trash2, Plus, Minus, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/ui/Card';
import { useSound } from '../context/SoundContext';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const bundles = [
  { id: 1, price: 0.99, minutes: 5, bonus: 0, label: '5 min' },
  { id: 2, price: 3.99, minutes: 25, bonus: 15, label: '40 min' },
  { id: 3, price: 7.49, minutes: 50, bonus: 30, label: '80 min' },
  { id: 4, price: 14.99, minutes: 100, bonus: 60, label: '160 min' },
  { id: 5, price: 29.99, minutes: 200, bonus: 120, label: '320 min' },
  { id: 6, price: 59.99, minutes: 500, bonus: 240, label: '740 min' },
];

/**
 * IMPORTANT:
 * These should match BACKEND / STRIPE one-time prices for extra minutes.
 * If Mahafuzar has only created subscription prices, checkout with mode "payment" will fail.
 */
const bundlePriceKeys = {
  1: 'STRIPE_PRICE_MINUTES_5',
  2: 'STRIPE_PRICE_MINUTES_40',
  3: 'STRIPE_PRICE_MINUTES_80',
  4: 'STRIPE_PRICE_MINUTES_160',
  5: 'STRIPE_PRICE_MINUTES_320',
  6: 'STRIPE_PRICE_MINUTES_740',
};

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function BuyExtraMinutes() {
  const [cart, setCart] = useState({});
  const [gifting, setGifting] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState('');

  const { playClick } = useSound();
  const navigate = useNavigate();

  const addToCart = (id) => {
    playClick?.();
    setError('');
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id) => {
    setError('');
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const changeQuantity = (id, delta) => {
    playClick?.();
    setError('');

    setCart((prev) => {
      const current = prev[id] || 0;
      const nextQty = current + delta;

      if (nextQty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }

      return { ...prev, [id]: nextQty };
    });
  };

  const emptyCart = () => {
    setError('');
    setCart({});
  };

  const total = useMemo(() => {
    return Object.entries(cart).reduce(
      (acc, [id, qty]) => {
        const bundle = bundles.find((b) => b.id === Number(id));
        if (!bundle) return acc;

        return {
          price: acc.price + bundle.price * qty,
          minutes: acc.minutes + (bundle.minutes + bundle.bonus) * qty,
          items: acc.items + qty,
        };
      },
      { price: 0, minutes: 0, items: 0 }
    );
  }, [cart]);

  const canCheckout = total.items > 0 && !checkoutLoading;

  const startCheckout = async () => {
    try {
      setCheckoutLoading(true);
      setError('');

      if (!total.items) {
        setError('Your cart is empty.');
        return;
      }

      if (gifting && !isValidEmail(recipient.trim())) {
        setError('Please enter a valid recipient email.');
        return;
      }

      const cartEntries = Object.entries(cart).map(([id, quantity]) => ({
        bundle_id: Number(id),
        quantity: Number(quantity),
        price_key: bundlePriceKeys[Number(id)],
      }));

      /**
       * TEMPORARY SAFE FRONTEND APPROACH:
       * Your current backend appears to create only ONE Stripe line item.
       * So we use the first/largest selected item as the main price and pass the rest in metadata.
       *
       * Mahafuzar should update backend to support multiple line_items.
       */
      const sortedIds = Object.keys(cart)
        .map(Number)
        .sort((a, b) => b - a);

      const primaryBundleId = sortedIds[0];
      const primaryQty = Number(cart[primaryBundleId] || 1);
      const endpoint = `${API_BASE_URL}/api/stripe/checkout/create`;

      const payload = {
        /**
         * DO NOT send mode: "payment" unless the backend uses one-time prices.
         * Since your screenshot shows a recurring price error, let backend decide mode
         * OR explicitly use subscription temporarily until backend fixes one-time minute prices.
         *
         * For extra minutes, backend should ultimately use one-time prices and payment mode.
         */
        price_key: bundlePriceKeys[primaryBundleId],
        quantity: primaryQty,
        success_url: `${window.location.origin}/thank-you`,
        cancel_url: `${window.location.origin}/purchase`,
        metadata: {
          purchase_type: 'extra_minutes',
          gifting: gifting ? 'true' : 'false',
          recipient: gifting ? recipient.trim() : '',
          total_minutes: String(total.minutes),
          total_price: total.price.toFixed(2),
          cart_json: JSON.stringify(cartEntries),
        },
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.detail || data?.message || 'Checkout failed.');
      }

      if (!data?.url) {
        throw new Error('Checkout URL was not returned by the server.');
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err?.message || 'Unable to start checkout.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row max-w-6xl mx-auto px-3 sm:px-4 py-6 gap-7">
      <aside className="w-full lg:w-80 flex-shrink-0 sticky lg:top-24 self-start mb-6 lg:mb-0">
        <Card className="bg-zinc-900 border border-teal-500 rounded-2xl shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-teal-300 font-semibold">
                Cart
              </CardTitle>
              <span className="text-xs text-zinc-400">{total.minutes} min</span>
            </div>

            <CardDescription className="text-sm text-zinc-400">
              {total.items ? `${total.items} item(s)` : 'Cart is empty'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <AnimatePresence>
              {!total.items ? (
                <p className="text-sm text-zinc-400">Your cart is empty.</p>
              ) : (
                Object.entries(cart).map(([id, qty]) => {
                  const item = bundles.find((b) => b.id === Number(id));
                  if (!item) return null;

                  const totalMinutes = (item.minutes + item.bonus) * qty;
                  const totalCost = item.price * qty;

                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex justify-between items-center bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3"
                    >
                      <div>
                        <p className="text-base text-white font-semibold">{item.label}</p>
                        <p className="text-xs text-zinc-400">${totalCost.toFixed(2)}</p>
                        <p className="text-xs text-teal-300 mt-1">{totalMinutes} total min</p>

                        <div className="flex gap-2 mt-2 items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => changeQuantity(item.id, -1)}
                            aria-label="Decrease"
                          >
                            <Minus className="w-4 h-4 text-teal-300" />
                          </Button>

                          <span className="text-base text-white">{qty}</span>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => changeQuantity(item.id, 1)}
                            aria-label="Increase"
                          >
                            <Plus className="w-4 h-4 text-teal-300" />
                          </Button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 rounded"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>

            <div className="pt-3 border-t border-zinc-700 text-base text-white space-y-1">
              <div className="flex justify-between">
                <span>Total Minutes:</span>
                <span className="font-bold">{total.minutes}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Cost:</span>
                <span className="font-bold">${total.price.toFixed(2)}</span>
              </div>
            </div>

            <p className="mt-2 text-xs text-teal-300 italic">
              Consider upgrading for more value!
            </p>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="gift"
                type="checkbox"
                checked={gifting}
                onChange={() => setGifting((prev) => !prev)}
                className="accent-teal-500 h-5 w-5"
              />
              <label htmlFor="gift" className="text-sm text-zinc-300 flex items-center gap-2">
                <Gift className="w-4 h-4 text-teal-300" />
                Gift
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

            {error && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300 whitespace-pre-wrap break-words">
                {error}
              </div>
            )}

            <Button
              size="lg"
              className="w-full bg-teal-600 hover:bg-teal-500 mt-4 text-base rounded-xl transition-colors disabled:opacity-60"
              onClick={startCheckout}
              disabled={!canCheckout}
            >
              {checkoutLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirecting...
                </span>
              ) : (
                'Checkout'
              )}
            </Button>

            {total.items > 0 && (
              <button
                onClick={emptyCart}
                className="mt-3 text-xs text-zinc-400 hover:text-teal-300 underline transition-colors"
              >
                Empty Cart
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
          Return
        </button>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {bundles.map((bundle) => (
            <motion.div
              key={bundle.id}
              whileHover={{ scale: 1.02 }}
              className="transition-transform h-full"
            >
              <Card className="h-full flex flex-col justify-between bg-zinc-900 border border-teal-700 rounded-2xl shadow hover:border-teal-500 transition-colors">
                <CardHeader className="pb-4 flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg text-white font-semibold">
                      ${bundle.price.toFixed(2)}
                    </CardTitle>

                    <CardDescription className="text-sm text-zinc-300">
                      <span className="text-teal-300 font-bold">
                        {bundle.minutes + bundle.bonus} min
                      </span>
                      {bundle.bonus > 0 && (
                        <span className="italic text-xs text-teal-400 ml-1">
                          ({bundle.minutes}+{bundle.bonus})
                        </span>
                      )}
                    </CardDescription>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => addToCart(bundle.id)}
                    aria-label="Add bundle"
                  >
                    <Plus className="w-5 h-5 text-teal-300" />
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
