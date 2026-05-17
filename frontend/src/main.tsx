import { createRoot } from "react-dom/client";
import React from "react";
import App from "./App.tsx";
import "./index.css";

// Error boundary to prevent blank screen on crash
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          color: "#f8fafc",
          fontFamily: "sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🧠</div>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>CogTwin</h1>
          <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>
            Something went wrong loading the app.
          </p>
          <p style={{
            background: "#1e293b",
            padding: "1rem",
            borderRadius: "0.5rem",
            fontSize: "0.8rem",
            color: "#f87171",
            maxWidth: "500px",
            wordBreak: "break-word",
          }}>
            {this.state.error}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 2rem",
              background: "#7c3aed",
              color: "white",
              border: "none",
              borderRadius: "0.75rem",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} else {
  document.body.innerHTML = '<div style="color:white;padding:2rem">Error: root element not found</div>';
}
