import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, background: "#fee2e2", color: "#991b1b" }}>
          <strong>UI crash:</strong> {String(this.state.error?.message || this.state.error)}
        </div>
      );
    }
    return this.props.children;
  }
}