import ReactDOM from "react-dom/client";
import "react-tooltip/dist/react-tooltip.css";

// @sito/ui
import { StyleProvider, ModeProvider } from "@sito/ui";

// providers
import {
  ManagerProvider,
  AccountProvider,
  NotificationProvider,
} from "providers";

// APP
import App from "./App";

// app styles
import "./index.css";

// fonts
import "@fontsource/poppins/700.css";
import "@fontsource/roboto/500.css";

// i18
import "./i18";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ModeProvider defaultMode="dark">
    <StyleProvider>
      <ManagerProvider>
        <AccountProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AccountProvider>
      </ManagerProvider>
    </StyleProvider>
  </ModeProvider>
);
