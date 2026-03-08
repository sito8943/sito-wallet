import { useTranslation } from "react-i18next";
import { useOnlineStatus } from "hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";

type OfflineBannerProps = {
  forceVisible?: boolean;
};

export function OfflineBanner({ forceVisible = false }: OfflineBannerProps) {
  const isOnline = useOnlineStatus();
  const { t } = useTranslation();

  console.log("isOnline", isOnline);

  if (isOnline && !forceVisible) return null;

  return (
    <div
      aria-live="polite"
      className="sticky top-0 z-10 flex items-center justify-center gap-2 bg-bg-warning px-4 py-2 text-sm font-medium text-warning"
      role="status"
    >
      <p className="flex items-center gap-2">
        <FontAwesomeIcon icon={faWarning} />
        <span className="text-xs">{t("_accessibility:offline.banner")}</span>
      </p>
    </div>
  );
}
