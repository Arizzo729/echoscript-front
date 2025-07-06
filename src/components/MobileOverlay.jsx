// ... everything else remains unchanged above ...

// --- MOBILE OVERLAY (with sticky drag, no lag) ---
const MobileOverlay = (() => {
  // Are we dragging? Local state!
  const [touchDragging, setTouchDragging] = useState(false);
  const [touchPos, setTouchPos] = useState(dragPos);

  useEffect(() => {
    if (!touchDragging) setTouchPos(dragPos);
  }, [dragPos, touchDragging]);

  useEffect(() => {
    if (!isMobile || collapsed) return;

    const node = dragRef.current;
    if (!node) return;

    function onTouchStart(e) {
      setTouchDragging(true);
    }
    function onTouchMove(e) {
      if (!touchDragging) return;
      const touch = e.touches[0];
      let x = touch.clientX - node.offsetWidth / 2;
      let y = touch.clientY - node.offsetHeight / 2;
      x = Math.max(0, Math.min(window.innerWidth - node.offsetWidth, x));
      y = Math.max(0, Math.min(window.innerHeight - node.offsetHeight - 80, y));
      setTouchPos({ x, y });
    }
    function onTouchEnd(e) {
      setTouchDragging(false);
      setDragPos(touchPos);
      localStorage.setItem('audio-overlay-pos', JSON.stringify(touchPos));
    }

    node.addEventListener('touchstart', onTouchStart, { passive: false });
    node.addEventListener('touchmove', onTouchMove, { passive: false });
    node.addEventListener('touchend', onTouchEnd, { passive: false });

    return () => {
      node.removeEventListener('touchstart', onTouchStart);
      node.removeEventListener('touchmove', onTouchMove);
      node.removeEventListener('touchend', onTouchEnd);
    };
  }, [isMobile, collapsed, touchDragging, touchPos, setDragPos, dragRef]);

  // Use left/top style directly for instant update, not motion.div x/y
  return (
    <div
      ref={dragRef}
      style={{
        position: 'fixed',
        left: touchPos.x,
        top: touchPos.y,
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
        userSelect: 'none',
        transition: touchDragging ? 'none' : 'left 0.14s, top 0.14s'
      }}
    >
      {/* ... the rest stays exactly as you wrote ... */}
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
        {currentLabel}
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
})();


