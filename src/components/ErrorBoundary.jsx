import React from "react";
import PropTypes from "prop-types";
// Optional: Uncomment if using Sentry
// import * as Sentry from "@sentry/react";

const ENABLE_SENTRY = true;       // Toggle to false if not using Sentry
const AUTO_RETRY_MS = 3000;       // Auto-retry after 3 seconds

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null, retrying: false };
    this.timeout = null;
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorInfo: error };
  }

  componentDidCatch(error, info) {
    console.error("🔴 Error caught in ErrorBoundary:", error, info);
    if (ENABLE_SENTRY && typeof Sentry !== "undefined") {
      Sentry.captureException(error);
    }

    this.setState({ retrying: true });

    this.timeout = setTimeout(() => {
      this.setState({ hasError: false, errorInfo: null, retrying: false });
      // Optional: window.location.reload(); // for hard reset
    }, AUTO_RETRY_MS);
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  handleManualReset = () => {
    this.setState({ hasError: false, errorInfo: null, retrying: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-white px-4 animate-fade-in">
          <h2 className="text-xl font-semibold text-red-500 mb-2">
            ⚠️ Something went wrong
          </h2>
          <p className="text-zinc-400 mb-4 text-sm">
            Attempting to auto-recover... or{" "}
            <button
              onClick={this.handleManualReset}
              className="underline text-teal-400 hover:text-teal-300"
            >
              click to refresh
            </button>
          </p>
          {this.state.retrying && (
            <div className="animate-spin w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full" />
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
