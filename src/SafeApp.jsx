import * as Sentry from "@sentry/react";
import App from "./App";

function Fallback() {
  return <div style={{ padding: 24 }}>Something went wrong. We’re on it.</div>;
}

export default function SafeApp() {
  return (
    <Sentry.ErrorBoundary fallback={<Fallback />}>
      <App />
    </Sentry.ErrorBoundary>
  );
}
