import ReactDOM from "react-dom/client";
import "react-tooltip/dist/react-tooltip.css";

// app
import App from "./App";

// fonts
import "@fontsource/poppins";
import "@fontsource/roboto";

// styles
import "./index.css";

// providers
import {
  ManagerProvider,
  NotificationProvider,
  LocalCacheProvider,
} from "providers";

//i18
import "./i18";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ManagerProvider>
    <LocalCacheProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </LocalCacheProvider>
  </ManagerProvider>
);
