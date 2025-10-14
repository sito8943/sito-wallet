import { useTranslation } from "react-i18next";

// icons
import { faClose } from "@fortawesome/free-solid-svg-icons";

// components
import { Chip } from "./Chip";
import { IconButton } from "@sito/dashboard-app";

// types
import { DeleteChipPropsType } from "./types.ts";

export const DeletableChip = (props: DeleteChipPropsType) => {
  const { t } = useTranslation();

  const { onDelete, text, ...rest } = props;

  return (
    <Chip {...rest} className="!pr-1">
      <p>{text}</p>
      <IconButton
        name={t("_accessibility:buttons.deleteChip", { value: text })}
        aria-label={t("_accessibility:ariaLabels.deleteChip", {
          value: text,
        })}
        className="hover:text-red-300"
        onClick={onDelete}
        icon={faClose}
      />
    </Chip>
  );
};
