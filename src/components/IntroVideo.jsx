import React, { useEffect } from "react";

export default function IntroVideo({ onFinish }) {
  // TODO: Implement the intro video player
  useEffect(() => {
    onFinish(); // Immediately finish for dev
  }, [onFinish]);
  return <div style={{ display: "none" }}>IntroVideo Placeholder</div>;
}