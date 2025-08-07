import { useState } from "react";
import { useTranslation } from "react-i18next";

// lib
import { BaseEntityDto } from "lib";

// types
import { ActionsContainerPropsType } from "./types";

// components
import { Dropdown } from "../Dropdown/Dropdown";
import { Actions } from "./Actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

export const ActionsDropdown = <TRow extends BaseEntityDto>(
  props: ActionsContainerPropsType<TRow>
) => {
  const { actions = [], className = "" } = props;

  const { t } = useTranslation();

  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className={`actions-dropdown ${className}`}>
      <button
        className="action !w-9 !justify-center"
        onClick={() => setOpenMenu(true)}
        data-tooltip-id="tooltip"
        data-tooltip-content={t("_accessibility:buttons.openActions")}
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </button>
      <Dropdown open={openMenu} onClose={() => setOpenMenu(false)}>
        <Actions
          showActionTexts
          actions={actions}
          className="flex-col"
          showTooltips={false}
        />
      </Dropdown>
    </div>
  );
};
