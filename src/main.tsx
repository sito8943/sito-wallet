import ReactDOM from "react-dom/client";
import "react-tooltip/dist/react-tooltip.css";

// app
import App from "./App";

// fonts
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-ext-400.css";
import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-ext-400.css";

// styles
import "./index.css";

// providers
import { SitoWalletProvider } from "providers";

// i18
import { initI18n } from "./i18";

const bootstrap = async () => {
  await initI18n();
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <SitoWalletProvider>
      <App />
    </SitoWalletProvider>,
  );
};

bootstrap();
