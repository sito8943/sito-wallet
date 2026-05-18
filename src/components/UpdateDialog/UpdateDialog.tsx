import { useTranslation } from "react-i18next";

import { Button, Dialog } from "@sito/dashboard-app";

import { useServiceWorkerUpdate } from "./useServiceWorkerUpdate";

export function UpdateDialog() {
  const { t } = useTranslation();
  const { needRefresh, dismissUpdate, applyUpdate } = useServiceWorkerUpdate();

  return (
    <Dialog
      open={needRefresh}
      title={t("_pages:pwaUpdate.title")}
      handleClose={dismissUpdate}
      containerClassName="!items-end pb-3"
    >
      <p className="text-sm text-text-muted">
        {t("_pages:pwaUpdate.description")}
      </p>
      <div className="mt-5 flex items-center justify-end gap-2">
        <Button type="button" variant="outlined" onClick={dismissUpdate}>
          {t("_pages:pwaUpdate.actions.later")}
        </Button>
        <Button
          type="button"
          variant="submit"
          color="primary"
          onClick={applyUpdate}
        >
          {t("_pages:pwaUpdate.actions.update")}
        </Button>
      </div>
    </Dialog>
  );
}
