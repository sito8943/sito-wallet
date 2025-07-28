import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSadTear } from "@fortawesome/free-regular-svg-icons";

// types
import { ErrorPropsType } from "./types.ts";

export function Error(props: ErrorPropsType) {
  const { message } = props;
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center pt-10 gap-5">
      <FontAwesomeIcon icon={faSadTear} className="text-red-300 text-4xl" />
      <p className="text-text text-center">
        {message ?? t("_accessibility:errors.unknownError")}
      </p>
    </div>
  );
}
