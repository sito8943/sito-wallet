import { useState } from "react";
import { useTranslation } from "react-i18next";

// lib
import { BaseEntityDto } from "lib";

// types
import { ActionsContainerPropsType } from "./types";

// components
import { Dropdown } from "../Dropdown/Dropdown";
import { Actions } from "./Actions";

export const ActionsDropdown = <TRow extends BaseEntityDto>(
  props: ActionsContainerPropsType<TRow>
) => {
  const { actions = [], className = "" } = props;

  const { t } = useTranslation();

  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className={`actions-dropdown ${className}`}>
      <button
        className="action"
        onClick={() => setOpenMenu(true)}
        data-tooltip-id="tooltip"
        data-tooltip-content={t("_accessibility:buttons.openActions")}
      ></button>
      <Dropdown>
        <Actions showActionTexts actions={actions} className="flex-col" />
      </Dropdown>
    </div>
  );
};
