const MobileOverlay = (() => {
  // Don’t use React state for drag position!
  const posRef = useRef({ x: dragPos.x, y: dragPos.y });
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const overlayRef = dragRef;

  // Sync DOM with dragPos when not dragging
  useEffect(() => {
    if (!dragging.current && overlayRef.current) {
      overlayRef.current.style.left = `${dragPos.x}px`;
      overlayRef.current.style.top = `${dragPos.y}px`;
      posRef.current = dragPos;
    }
  }, [dragPos, overlayRef]);

  useEffect(() => {
    if (!isMobile || collapsed) return;
    const node = overlayRef.current;
    if (!node) return;

    function onTouchStart(e) {
      dragging.current = true;
      const touch = e.touches[0];
      const rect = node.getBoundingClientRect();
      dragOffset.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
      // Remove CSS transitions during drag for instant stickiness
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
      posRef.current = { x, y };
    }

    function onTouchEnd() {
      dragging.current = false;
      // Smoothly snap back if needed
      node.style.transition = 'left 0.13s, top 0.13s';
      setDragPos(posRef.current);
      localStorage.setItem('audio-overlay-pos', JSON.stringify(posRef.current));
    }

    node.addEventListener('touchstart', onTouchStart, { passive: false });
    node.addEventListener('touchmove', onTouchMove, { passive: false });
    node.addEventListener('touchend', onTouchEnd, { passive: false });

    return () => {
      node.removeEventListener('touchstart', onTouchStart);
      node.removeEventListener('touchmove', onTouchMove);
      node.removeEventListener('touchend', onTouchEnd);
    };
  }, [isMobile, collapsed, overlayRef, setDragPos]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        left: `${dragPos.x}px`,
        top: `${dragPos.y}px`,
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
      }}
    >
      {/* ...your buttons/content here... */}
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




