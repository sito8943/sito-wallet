import { useTranslation } from "react-i18next";

// components
import { Dialog, SearchWrapper } from "components";

// types
import { SearchModalPropsType } from "./types";

export const SearchModal = (props: SearchModalPropsType) => {
  const { t } = useTranslation();

  const { open, onClose } = props;

  return (
    <Dialog
      open={open}
      className="md:w-1/2 w-5/6"
      title={t("_pages:search.label")}
      handleClose={onClose}
    >
      <SearchWrapper isModal />
    </Dialog>
  );
};
