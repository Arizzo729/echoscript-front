<<<<<<< Updated upstream
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
=======
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "../components/ui/Button";
>>>>>>> Stashed changes
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
<<<<<<< Updated upstream
} from '../components/ui/Card';
import { useSound } from '../context/SoundContext';

const bundles = [
  { id: 1, price: 0.99, minutes: 5, bonus: 0 },
  { id: 2, price: 3.99, minutes: 25, bonus: 5 },
  { id: 3, price: 7.99, minutes: 60, bonus: 10 },
  { id: 4, price: 14.99, minutes: 120, bonus: 45 },
  { id: 5, price: 29.99, minutes: 250, bonus: 100 },
  { id: 6, price: 59.99, minutes: 500, bonus: 200 },
];

const isValidEmail = (v) => /\S+@\S+\.\S+/.test(v);

export default function BuyExtraMinutes() {
  const [cart, setCart] = useState({});
  const [gifting, setGifting] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const { playClick } = useSound();
  const navigate = useNavigate();

  const addToCart = (id) => {
    playClick();
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
=======
} from "../components/ui/Card";
import { useSound } from "../context/SoundContext";

// Updated bundles: id 5 is now 200 + 40 bonus
const bundles = [
  { id: 1, price: 0.99, minutes: 5, bonus: 0 },
  { id: 2, price: 4.99, minutes: 25, bonus: 5 },
  { id: 3, price: 9.99, minutes: 50, bonus: 10 },
  { id: 4, price: 19.99, minutes: 100, bonus: 20 },
  { id: 5, price: 49.99, minutes: 200, bonus: 40 },
  { id: 6, price: 99.99, minutes: 500, bonus: 0 },
];

export default function BuyExtraMinutes() {
  const [cart, setCart] = useState({});
  const [gifting, setGifting] = useState(false);
  const [recipient, setRecipient] = useState("");
  const { playPop } = useSound();

  const addToCart = (id) => {
    playPop();
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
>>>>>>> Stashed changes
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
<<<<<<< Updated upstream
      const updated = { ...prev };
      delete updated[id];
      return updated;
=======
      const newCart = { ...prev };
      delete newCart[id];
      return newCart;
>>>>>>> Stashed changes
    });
  };

  const changeQuantity = (id, delta) => {
<<<<<<< Updated upstream
    playClick();
    setCart((prev) => {
      const current = prev[id] || 0;
      const updatedQty = current + delta;
      if (updatedQty <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: updatedQty };
=======
    playPop();
    setCart((prev) => {
      const currentQty = prev[id] || 0;
      const newQty = currentQty + delta;
      if (newQty <= 0) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, [id]: newQty };
>>>>>>> Stashed changes
    });
  };

  const emptyCart = () => setCart({});

  const total = Object.entries(cart).reduce(
    (acc, [id, qty]) => {
<<<<<<< Updated upstream
      const b = bundles.find((x) => x.id === +id);
=======
      const b = bundles.find((x) => x.id === parseInt(id));
>>>>>>> Stashed changes
      return {
        price: acc.price + b.price * qty,
        minutes: acc.minutes + (b.minutes + b.bonus) * qty,
      };
    },
    { price: 0, minutes: 0 }
  );

<<<<<<< Updated upstream
  const suggestedId =
    Object.keys(cart).length === 1
      ? Math.min(...Object.keys(cart).map((i) => +i)) + 1
      : null;

  const handleCheckout = async () => {
    try {
      setBusy(true);
      setErr('');

      if (Object.keys(cart).length === 0) return;

      if (gifting && !isValidEmail(recipient)) {
        setErr('Please enter a valid recipient email for gifting.');
        return;
      }

      // Backend should create a Stripe Checkout session and return { url }
      // Implement endpoint: POST /api/stripe/create-minutes-session
      const res = await fetch('/api/stripe/create-minutes-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: Object.entries(cart).map(([id, qty]) => {
            const b = bundles.find((x) => x.id === +id);
            return {
              id: +id,
              qty,
              price: b.price,
              minutes: b.minutes,
              bonus: b.bonus,
            };
          }),
          gifting,
          recipient: gifting ? recipient : undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json?.url) {
        throw new Error(json?.error || 'Unable to create checkout session.');
      }
      window.location.href = json.url;
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row max-w-5xl mx-auto px-2 sm:px-4 py-6 gap-7">
      {/* Cart Summary (mobile first: on bottom, sticky on desktop) */}
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
              {Object.keys(cart).length
                ? `${Object.values(cart).reduce((a, b) => a + b, 0)} item(s)`
                : 'Cart is empty'}
            </CardDescription>
          </CardHeader>
=======
  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-6 py-12 gap-10">
      {/* Bundles Grid */}
      <section className="flex-1 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bundles.map((bundle) => (
          <motion.div
            key={bundle.id}
            whileHover={{ scale: 1.02 }}
            className="transition-all"
          >
            <Card className="bg-zinc-800 border border-zinc-700 rounded-2xl shadow-md hover:border-teal-500 transition">
              <CardHeader className="pb-1 flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl text-white font-semibold">
                    ${bundle.price.toFixed(2)}
                  </CardTitle>
                  <CardDescription className="text-sm text-zinc-400">
                    {bundle.minutes} min{' '}
                    {bundle.bonus > 0 && (
                      <span className="text-teal-300 font-medium ml-1">
                        +{bundle.bonus} bonus
                      </span>
                    )}
                  </CardDescription>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => addToCart(bundle.id)}
                  aria-label="Add bundle to cart"
                >
                  <Plus className="w-5 h-5 text-teal-400" />
                </Button>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Cart Summary */}
      <aside className="w-full lg:w-80 flex-shrink-0 sticky top-24 self-start">
        <Card className="bg-zinc-900 border border-teal-500 rounded-2xl shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl text-teal-300 font-semibold">
                Cart
              </CardTitle>
              <span className="text-xs text-zinc-400">
                {total.minutes} min total
              </span>
            </div>
            <CardDescription className="text-sm text-zinc-400">
              {Object.keys(cart).length === 0
                ? 'Cart is empty'
                : `${Object.values(cart).reduce((a,b)=>a+b,0)} item(s)`}
            </CardDescription>
          </CardHeader>

>>>>>>> Stashed changes
          <CardContent className="space-y-4">
            <AnimatePresence>
              {Object.keys(cart).length === 0 ? (
                <p className="text-sm text-zinc-400">Your cart is empty.</p>
              ) : (
                Object.entries(cart).map(([id, qty]) => {
<<<<<<< Updated upstream
                  const item = bundles.find((b) => b.id === +id);
=======
                  const item = bundles.find((b) => b.id === parseInt(id));
>>>>>>> Stashed changes
                  const minutes = (item.minutes + item.bonus) * qty;
                  const cost = item.price * qty;

                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
<<<<<<< Updated upstream
                      className="flex justify-between items-center bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3"
                    >
                      <div>
                        <p className="text-base text-white font-semibold">
                          {minutes} min
                        </p>
                        <p className="text-xs text-zinc-400">${cost.toFixed(2)}</p>
=======
                      className="flex justify-between items-center border border-zinc-700 bg-zinc-800 rounded-lg px-4 py-2"
                    >
                      <div>
                        <p className="text-sm text-white font-medium">
                          {minutes} min
                        </p>
                        <p className="text-xs text-zinc-400">
                          ${cost.toFixed(2)}
                        </p>
>>>>>>> Stashed changes
                        <div className="flex gap-2 mt-1 items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => changeQuantity(item.id, -1)}
<<<<<<< Updated upstream
                            aria-label="Decrease"
                          >
                            <Minus className="w-4 h-4 text-teal-300" />
                          </Button>
                          <span className="text-base text-white">{qty}</span>
=======
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-sm text-white">{qty}</span>
>>>>>>> Stashed changes
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => changeQuantity(item.id, 1)}
<<<<<<< Updated upstream
                            aria-label="Increase"
                          >
                            <Plus className="w-4 h-4 text-teal-300" />
=======
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
>>>>>>> Stashed changes
                          </Button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
<<<<<<< Updated upstream
                        className="text-red-400 hover:text-red-300 transition-colors p-2 rounded"
                        aria-label="Remove"
=======
                        className="text-red-400 hover:text-red-300"
                        aria-label="Remove from cart"
>>>>>>> Stashed changes
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>

            {/* Totals */}
<<<<<<< Updated upstream
            <div className="pt-3 border-t border-zinc-700 text-base text-white space-y-1">
=======
            <div className="pt-3 border-t border-zinc-700 text-sm text-white space-y-1">
>>>>>>> Stashed changes
              <div className="flex justify-between">
                <span>Total Minutes:</span>
                <span className="font-bold">{total.minutes}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Cost:</span>
<<<<<<< Updated upstream
                <span className="font-bold">${total.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Gift toggle */}
=======
                <span className="font-bold">
                  ${total.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Gift Option */}
>>>>>>> Stashed changes
            <div className="flex items-center gap-2 pt-2">
              <input
                id="gift"
                type="checkbox"
                checked={gifting}
                onChange={() => setGifting(!gifting)}
                className="accent-teal-500 h-5 w-5"
              />
<<<<<<< Updated upstream
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

            {err && <p className="text-sm text-red-400">{err}</p>}

            <Button
              size="lg"
              className="w-full bg-teal-600 hover:bg-teal-500 mt-4 text-base rounded-xl transition-colors disabled:opacity-60"
              onClick={handleCheckout}
              disabled={Object.keys(cart).length === 0 || busy || (gifting && !isValidEmail(recipient))}
            >
              {busy ? 'Processing…' : 'Checkout'}
            </Button>
            {Object.keys(cart).length > 0 && (
              <button
                onClick={emptyCart}
                className="mt-3 text-xs text-zinc-400 hover:text-teal-300 underline transition-colors"
=======
              <label
                htmlFor="gift"
                className="text-sm text-zinc-300 flex items-center gap-2"
              >
                <Gift className="w-4 h-4 text-teal-400" />
                Gift to a friend
              </label>
            </div>
            {gifting && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
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
            )}

            {/* Checkout */}
            <Button
              size="lg"
              className="w-full bg-teal-600 hover:bg-teal-500 mt-4"
              onClick={() => {
                // TODO: Stripe integration
              }}
            >
              Checkout
            </Button>

            {/* Empty Cart */}
            {Object.keys(cart).length > 0 && (
              <button
                onClick={emptyCart}
                className="mt-3 text-xs text-zinc-400 hover:text-zinc-300 underline"
>>>>>>> Stashed changes
              >
                Empty Cart
              </button>
            )}
          </CardContent>
        </Card>
      </aside>
<<<<<<< Updated upstream

      {/* Main Content / Bundles */}
      <div className="flex-1 flex flex-col">
        {/* Return Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-zinc-400 hover:text-teal-300 transition-colors mb-5 w-max"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return
        </button>

        {/* Bundles Grid */}
        <section className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4">
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
=======
>>>>>>> Stashed changes
    </div>
  );
}

<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
