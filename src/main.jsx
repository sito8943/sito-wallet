import ReactDOM from "react-dom/client";

// @sito/ui
import { StyleProvider, ModeProvider, NotificationProvider } from "@sito/ui";

// providers
import { AppApiClientProvider } from "./providers/AppApiProvider.jsx";
import { AccountProvider } from "./providers/AccountProvider.jsx";
import { CacheProvider } from "./providers/CacheProvider.jsx";

// APP
import App from "./App.jsx";

// app styles
import "./index.css";
// Import css files
import "tippy.js/dist/tippy.css"; // optional

// fonts
import "@fontsource/poppins/700.css";
import "@fontsource/roboto/500.css";

// i18
import "./i18.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ModeProvider>
    <AppApiClientProvider>
      <AccountProvider>
        <StyleProvider>
          <CacheProvider>
            <NotificationProvider>
                <App />
            </NotificationProvider>
          </CacheProvider>
        </StyleProvider>
      </AccountProvider>
    </AppApiClientProvider>
  </ModeProvider>
);
