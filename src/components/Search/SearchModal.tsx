import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Dialog } from "@sito/dashboard-app";

// components
import { SearchWrapper } from "components";

// types
import type { SearchModalPropsType } from "./types";

import "./styles.css";

export const SearchModal = (props: SearchModalPropsType) => {
  const { t } = useTranslation();

  const { open, onClose } = props;

  return (
    <Dialog
      open={open}
      className="search-modal"
      title={t("_pages:search.label")}
      handleClose={onClose}
    >
      <SearchWrapper isModal />
    </Dialog>
  );
};
