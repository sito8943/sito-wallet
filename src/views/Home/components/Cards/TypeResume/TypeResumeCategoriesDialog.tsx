import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Dialog } from "@sito/dashboard-app";

// components
import { Currency } from "../../../../Currencies";

// types
import type { TypeResumeCategoriesDialogPropsType } from "./types";

import "../styles.css";

export const TypeResumeCategoriesDialog = (
  props: TypeResumeCategoriesDialogPropsType,
) => {
  const { open, closeDialog, categories, currencyName, currencySymbol } = props;
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      handleClose={closeDialog}
      mobileFullScreen
      title={t("_pages:home.dashboard.transactionTypeResume.details.title")}
      className="type-resume-dialog"
    >
      {categories.length === 0 ? (
        <p className="type-resume-dialog-empty poppins">
          {t("_pages:home.dashboard.transactionTypeResume.details.empty")}
        </p>
      ) : (
        <ul className="type-resume-dialog-list">
          {categories.map((category) => (
            <li
              key={category.id}
              className="type-resume-dialog-item base-border"
            >
              <div className="type-resume-dialog-item-copy">
                <div className="type-resume-dialog-item-title-row">
                  {category.color ? (
                    <span
                      className="type-resume-dialog-item-color"
                      style={{ backgroundColor: category.color }}
                      aria-hidden="true"
                    />
                  ) : null}
                  <p className="type-resume-dialog-item-title poppins">
                    {category.name}
                  </p>
                </div>
              </div>
              <p className="type-resume-dialog-item-amount poppins">
                {category.total}{" "}
                <Currency name={currencyName} symbol={currencySymbol} />
              </p>
            </li>
          ))}
        </ul>
      )}
    </Dialog>
  );
};
