  /* Floating home action button */
  .floating-home {
    position: fixed;
    bottom: calc(72px + env(safe-area-inset-bottom, 8px));
    right: 16px;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-primary);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    box-shadow: var(--shadow-strong);
    cursor: pointer;
    transition: transform 0.2s ease;
    z-index: 1003;
  }
  .floating-home:hover,
  .floating-home:focus {
    transform: scale(1.05);
  }
}
