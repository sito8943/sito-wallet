import { useTranslation } from "react-i18next";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { IconButton } from "@sito/dashboard-app";

// components
import { ProviderPhoto } from "../ProviderPhoto";

// types
import type { CatalogItemPropsType } from "./types";

import "./styles.css";

export function CatalogItem(props: CatalogItemPropsType) {
  const { id, name, photo, onEdit, onDelete } = props;
  const { t } = useTranslation();

  return (
    <li className="catalog-item">
      <ProviderPhoto className="catalog-item-photo" photo={photo} />
      <span className="catalog-item-name">{name}</span>
      <IconButton
        type="button"
        icon={faPencil}
        onClick={() => onEdit(id)}
        aria-label={t("_pages:common.actions.edit.text")}
        data-tooltip-id="tooltip"
        data-tooltip-content={t("_pages:common.actions.edit.text")}
      />
      <IconButton
        type="button"
        icon={faTrash}
        onClick={() => onDelete(id)}
        aria-label={t("_pages:common.actions.delete.text")}
        data-tooltip-id="tooltip"
        data-tooltip-content={t("_pages:common.actions.delete.text")}
      />
    </li>
  );
}
