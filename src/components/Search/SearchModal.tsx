import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";

// components
import { Dialog, SearchWrapper } from "components";

// utils
import { isMac } from "./utils";

export const SearchModal = () => {
  const { t } = useTranslation();
  const [showDialog, setShowDialog] = useState(false);

  const openOnKeyCombination = useCallback((e: KeyboardEvent) => {
    const primary = isMac() ? e.metaKey : e.ctrlKey;
    if (primary && e.shiftKey && e.key.toLowerCase() === "f") {
      setShowDialog(true);
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", openOnKeyCombination);
    return () => {
      window.removeEventListener("keydown", openOnKeyCombination);
    };
  }, [openOnKeyCombination]);

  return (
    <Dialog
      open={showDialog}
      className="md:w-1/2 w-5/6"
      title={t("_pages:search.label")}
      handleClose={() => setShowDialog(false)}
    >
      <SearchWrapper isModal />
    </Dialog>
  );
};
