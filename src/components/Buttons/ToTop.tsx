import { useTranslation } from "react-i18next";
import { scrollTo } from "some-javascript-utils/browser";

// icons
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

// components
import { IconButton } from "./IconButton";

// hook
import { useScrollTrigger } from "hooks";

export const ToTop = () => {
  const { t } = useTranslation();

  const isScrolled = useScrollTrigger(200);

  console.log(isScrolled)

  return (
    <IconButton
      icon={faArrowUp}
      onClick={() => scrollTo(0, 0)}
      data-tooltip-id="tooltip"
      data-tooltip-content={t("_accessibility:buttons.toTop")}
      className={`fixed bottom-4 right-4 z-50 submit primary transition duration-500 ease-in-out ${
        isScrolled ? "scale-100" : "scale-0"
      }`}
    />
  );
};
