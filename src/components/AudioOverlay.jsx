// ...everything above unchanged...

export default function AudioOverlay() {
  const isMobile = useIsMobile();
  const {
    trackIndex,
    isPlaying,
    volume,
    setVolume,
    playAmbientTrack,
    togglePlay
  } = useSound();

  const [collapsed, setCollapsed] = useState(() =>
    JSON.parse(localStorage.getItem('audio-overlay-collapsed') || 'false')
  );
  const [busy, setBusy] = useState(false);

  // ---- DRAG FOR MOBILE, NO REACT STATE, NO MOTION.DIV ----
  const dragPosRef = useRef({
    x: (() => {
      const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
      return typeof saved.x === 'number' ? saved.x : window.innerWidth - 260 - 16;
    })(),
    y: (() => {
      const saved = JSON.parse(localStorage.getItem('audio-overlay-pos') || '{}');
      return typeof saved.y === 'number' ? saved.y : window.innerHeight - 120;
    })()
  });
  const overlayRef = useRef(null);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isMobile || collapsed) return;
    const node = overlayRef.current;
    if (!node) return;

    // Set start position
    node.style.left = `${dragPosRef.current.x}px`;
    node.style.top = `${dragPosRef.current.y}px`;

    function onTouchStart(e) {
      dragging.current = true;
      const touch = e.touches[0];
      const rect = node.getBoundingClientRect();
      dragOffset.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
      node.style.transition = 'none';
    }

    function onTouchMove(e) {
      if (!dragging.current) return;
      const touch = e.touches[0];
      let x = touch.clientX - dragOffset.current.x;
      let y = touch.clientY - dragOffset.current.y;
      // Clamp to screen
      x = Math.max(0, Math.min(window.innerWidth - node.offsetWidth, x));
      y = Math.max(0, Math.min(window.innerHeight - node.offsetHeight - 80, y));
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      dragPosRef.current = { x, y };
    }

    function onTouchEnd() {
      dragging.current = false;
      node.style.transition = 'left 0.13s, top 0.13s';
      // Save to localStorage, so next open returns to same place
      localStorage.setItem('audio-overlay-pos', JSON.stringify(dragPosRef.current));
    }

    node.addEventListener('touchstart', onTouchStart, { passive: false });
    node.addEventListener('touchmove', onTouchMove, { passive: false });
    node.addEventListener('touchend', onTouchEnd, { passive: false });

    return () => {
      node.removeEventListener('touchstart', onTouchStart);
      node.removeEventListener('touchmove', onTouchMove);
      node.removeEventListener('touchend', onTouchEnd);
    };
  }, [isMobile, collapsed]);

  // ---- MOBILE OVERLAY: NO MOTION.DIV ----
  const MobileOverlay = (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        left: dragPosRef.current.x,
        top: dragPosRef.current.y,
        zIndex: 9999,
        width: 260,
        height: 60,
        background: 'rgba(24,24,30,0.95)',
        borderRadius: 16,
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.13)',
        border: '1.5px solid #14b8a6a6',
        backdropFilter: 'blur(7px)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '0 10px 0 8px',
        touchAction: 'none',
        userSelect: 'none'
      }}
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label="Previous"
        onClick={() => {
          if (!busy) {
            setBusy(true);
            playAmbientTrack((trackIndex - 1 + TRACKS.length) % TRACKS.length);
            setTimeout(() => setBusy(false), 300);
          }
        }}
        icon={<ChevronLeft className="w-5 h-5 text-teal-400" />}
      />
      <Button
        variant="ghost"
        size="icon"
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={() =>
          trackIndex === 0 ? playAmbientTrack(1) : togglePlay()
        }
        icon={
          isPlaying ? (
            <Pause className="w-5 h-5 text-teal-400" />
          ) : (
            <Play className="w-5 h-5 text-teal-400" />
          )
        }
      />
      <Button
        variant="ghost"
        size="icon"
        aria-label="Next"
        onClick={() => {
          if (!busy) {
            setBusy(true);
            playAmbientTrack((trackIndex + 1) % TRACKS.length);
            setTimeout(() => setBusy(false), 300);
          }
        }}
        icon={<ChevronRight className="w-5 h-5 text-teal-400" />}
      />
      <span className="ml-1 mr-1 font-mono text-[0.83rem] text-teal-200 tracking-wider select-none">
        {TRACKS[trackIndex]?.label}
      </span>
      <button
        onClick={() => setCollapsed(true)}
        className="ml-auto flex items-center justify-center p-0 w-8 h-8 rounded-full hover:scale-110 transition"
        aria-label="Collapse"
        tabIndex={0}
        style={{
          background: 'none',
          border: 'none',
          outline: 'none',
          boxShadow: 'none'
        }}
      >
        <X className="w-4 h-4 text-teal-400" />
      </button>
    </div>
  );

  // ---- REST: Desktop unchanged ----

  const MobileFAB = (
    <motion.button
      key="audio-fab"
      initial={{ opacity: 0, scale: 0.90 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.90 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        position: 'fixed',
        bottom: 82,
        right: 18,
        zIndex: 9999,
        background: 'rgba(24,24,30,0.94)',
        border: '1.5px solid #14b8a6a6',
        boxShadow: '0 2px 14px 0 rgba(0,0,0,0.14)',
        borderRadius: 9999,
        width: 52,
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={() => setCollapsed(false)}
      aria-label="Show audio controls"
      tabIndex={0}
    >
      <Music className="w-6 h-6 text-teal-400" />
    </motion.button>
  );

  // DesktopOverlay and DesktopCollapsed remain exactly as you have them!

  // Render logic
  if (isMobile) {
    return (
      <AnimatePresence>
        {collapsed ? (
          MobileFAB
        ) : (
          MobileOverlay
        )}
      </AnimatePresence>
    );
  } else {
    return (
      <AnimatePresence>
        {collapsed ? (
          DesktopCollapsed
        ) : (
          DesktopOverlay
        )}
      </AnimatePresence>
    );
  }
}

