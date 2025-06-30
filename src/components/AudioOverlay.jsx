 * AudioOverlay — draggable ambient control with minimize/restore.
 */
export default function AudioOverlay() {
  const { toggleAmbient, nowPlaying } = useSound();
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setMinimized(false)}
      >
        <div className="p-2 bg-white/40 backdrop-blur-md rounded-full shadow-lg cursor-pointer">
          🎵
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      drag
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={0.2}
      whileDrag={{ scale: 1.05 }}
    >
      <motion.div
        className="p-4 bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl flex items-center space-x-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <button
          onClick={() => setMinimized(true)}
          className="text-gray-200 hover:text-white"
        >
          ✕
        </button>
        <button
          onClick={toggleAmbient}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-full shadow-md"
        >
          <span>🎵</span>
          <span className="whitespace-nowrap">{nowPlaying}</span>
        </button>
      </motion.div>
    </motion.div>
  );
}

