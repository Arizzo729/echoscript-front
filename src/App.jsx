// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Context providers
import { ThemeProvider } from "./context/useTheme";
import { GPTProvider } from "./context/GPTContext";
import { FontSizeProvider } from "./context/useFontSize";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { SoundProvider } from "./context/SoundContext";

// Setup i18n + global styles
import "./i18n";
import "./global.css";

// App
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SoundProvider>
      <AuthProvider>
        <LanguageProvider>
          <ThemeProvider>
            <GPTProvider>
              <FontSizeProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </FontSizeProvider>
            </GPTProvider>
          </ThemeProvider>
        </LanguageProvider>
      </AuthProvider>
    </SoundProvider>
  </React.StrictMode>
);


