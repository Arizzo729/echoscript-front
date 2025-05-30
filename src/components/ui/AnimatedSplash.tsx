import React, { useEffect, useRef, useState } from "react"
import Lottie from "lottie-react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import animationData from "@/assets/lottie/ai-waveform.json" // example Lottie JSON

const AnimatedSplash: React.FC = () => {
  const [visible, setVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // GSAP subtle scale up then back to normal
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.95 },
        { scale: 1, duration: 1.8, ease: "power3.out" }
      )
    }

    // Hide splash after 2.3 seconds (match with main.tsx)
    const timer = setTimeout(() => setVisible(false), 2300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 flex items-center justify-center bg-white dark:bg-black"
          style={{ zIndex: 9999 }}
        >
          <Lottie
            animationData={animationData}
            loop={false}
            style={{ width: 240, height: 240 }}
            aria-label="Loading animation"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AnimatedSplash
