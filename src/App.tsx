import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import loadable from "@loadable/component";

// layouts
import View from "./layouts/View/View";

// components
import { SplashScreen } from "components";

// view
const Home = loadable(() =>
  import("views").then((module) => ({
    default: module.Home,
  }))
);
const NotFound = loadable(() =>
  import("views").then((module) => ({
    default: module.NotFound,
  }))
);
const Wallets = loadable(() =>
  import("views").then((module) => ({
    default: module.Wallets,
  }))
);

function App() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<View />}>
            <Route index element={<Home />} />
            <Route path="/wallets" element={<Wallets />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
