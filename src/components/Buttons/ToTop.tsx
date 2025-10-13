import { useTranslation } from "react-i18next";
import { scrollTo } from "some-javascript-utils/browser";

// icons
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

// components
import { IconButton } from "./IconButton";

// hook
import { useScrollTrigger } from "hooks";

// styles
import "./styles.css";

export const ToTop = () => {
  const { t } = useTranslation();

  const isScrolled = useScrollTrigger(200);

  return (
    <IconButton
      icon={faArrowUp}
      onClick={() => scrollTo(0, 0)}
      data-tooltip-id="tooltip"
      data-tooltip-content={t("_accessibility:buttons.toTop")}
      className={`submit primary to-top ${isScrolled ? "show" : "hide"}`}
    />
  );
};
