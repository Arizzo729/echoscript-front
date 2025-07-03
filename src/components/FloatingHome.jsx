/* 5. Floating home action button */
floating-home ;
  --size: clamp(48px, 6vw, 64px);
  position: fixed;
  bottom: calc(72px + env(safe-area-inset-bottom, 8px));
  right: 16px;
  width: var(--size);
  height: var(--size);
  display: grid;
  place-items: center;
  background-color: var(--color-primary);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  box-shadow: var(--shadow-strong);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  z-index: 1003;

.floating-home:hover,
.floating-home:focus {
  transform: scale(1.1);
  box-shadow: var(--shadow-strong-hover, 0 6px 16px rgba(0, 0, 0, 0.12));
}
