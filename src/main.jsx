import React from "react";
import ReactDOM from "react-dom/client";

// @sito/ui
import { StyleProvider, ModeProvider, NotificationProvider } from "@sito/ui";

// providers
import { UserProvider } from "./providers/UserProvider.jsx";

// APP
import App from "./App.jsx";

// app styles
import "./index.css";
// Import css files
import "tippy.js/dist/tippy.css"; // optional

// fonts
import "@fontsource/poppins";
import "@fontsource/roboto";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StyleProvider>
      <ModeProvider>
        <NotificationProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </NotificationProvider>
      </ModeProvider>
    </StyleProvider>
  </React.StrictMode>
);
