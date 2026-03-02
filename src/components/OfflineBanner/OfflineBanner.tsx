import { useTranslation } from "react-i18next";
import { useOnlineStatus } from "hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const { t } = useTranslation();

  if (isOnline) return null;

  return (
    <div className="group px-4 py-1 transition-all duration-300 overflow-hidden h-0 hover:h-9 sticky top-0 z-50 flex items-center justify-center gap-2 bg-bg-warning text-warning text-sm font-medium">
      <p className="group-hover:opacity-100 opacity-0 transition duration-300">
        <FontAwesomeIcon icon={faWarning} />
        <span>{t("_accessibility:offline.banner")}</span>
      </p>
    </div>
  );
}
