import { useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const onCloseRef = useRef(onClose);

  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useLayoutEffect(() => {
    onCloseRef.current();
  }, [location.pathname]);

  return (
    <Dialog
      open={open}
      className="search-modal"
      title={t("_pages:search.label")}
      handleClose={onClose}
    >
      <SearchWrapper isModal onNavigate={onClose} />
    </Dialog>
  );
};
