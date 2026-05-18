import { useEffect, useRef, useState } from "react";

const serviceWorkerScriptUrl = `/sw.js?build=${encodeURIComponent(__APP_BUILD_ID__)}`;

export function useServiceWorkerUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!import.meta.env.PROD) return;
    if (!("serviceWorker" in navigator)) return;

    let cancelled = false;

    const showUpdateDialog = (registration: ServiceWorkerRegistration) => {
      if (!registration.waiting) return;

      registrationRef.current = registration;
      if (!cancelled) setNeedRefresh(true);
    };

    const observeInstallingWorker = (
      registration: ServiceWorkerRegistration,
      worker: ServiceWorker,
    ) => {
      worker.addEventListener("statechange", () => {
        if (worker.state !== "installed") return;
        if (!navigator.serviceWorker.controller) return;

        showUpdateDialog(registration);
      });
    };

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          serviceWorkerScriptUrl,
          { scope: "/" },
        );

        registrationRef.current = registration;
        showUpdateDialog(registration);

        if (registration.installing) {
          observeInstallingWorker(registration, registration.installing);
        }

        registration.addEventListener("updatefound", () => {
          const nextWorker = registration.installing;
          if (!nextWorker) return;

          observeInstallingWorker(registration, nextWorker);
        });

        void registration.update();
      } catch {
        registrationRef.current = null;
      }
    };

    const handleControllerChange = () => {
      window.location.reload();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      void registrationRef.current?.update();
    };

    void registerServiceWorker();

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange,
    );
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      cancelled = true;
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange,
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, []);

  const dismissUpdate = () => {
    setNeedRefresh(false);
  };

  const applyUpdate = () => {
    registrationRef.current?.waiting?.postMessage({ type: "SKIP_WAITING" });
  };

  return {
    needRefresh,
    dismissUpdate,
    applyUpdate,
  };
}
