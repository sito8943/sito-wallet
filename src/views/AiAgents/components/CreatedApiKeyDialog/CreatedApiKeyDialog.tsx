import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { Button, Dialog } from "@sito/dashboard-app";

// constants
import { RAW_INTERPOLATION } from "../../constants";

// components
import { CodeSnippet } from "../CodeSnippet";
import { McpSetupInstructions } from "../McpSetupInstructions";

// types
import type { CreatedApiKeyDialogPropsType } from "../../types";

/** Shows the full key once, with the snippets already filled in. */
export function CreatedApiKeyDialog(props: CreatedApiKeyDialogPropsType) {
  const { createdKey, mcpUrl, handleClose } = props;
  const { t } = useTranslation();

  return (
    <Dialog
      open={createdKey !== null}
      title={t("_pages:aiAgents.keys.created.title")}
      handleClose={handleClose}
      closeOnBackdropClick={false}
      mobileFullScreen
      className="ai-agents-created-dialog"
    >
      {createdKey && (
        <div className="ai-agents-created">
          <p className="ai-agents-warning" role="alert">
            <FontAwesomeIcon icon={faWarning} />
            <span>{t("_pages:aiAgents.keys.created.warning")}</span>
          </p>
          <CodeSnippet
            code={createdKey.key}
            label={t("_pages:aiAgents.keys.created.keyLabel", {
              name: createdKey.name,
              interpolation: RAW_INTERPOLATION,
            })}
            copyLabel={t("_pages:aiAgents.keys.created.copyKey")}
            wrap
          />
          <div className="ai-agents-created-setup">
            <h4 className="ai-agents-subtitle">
              {t("_pages:aiAgents.keys.created.setupTitle")}
            </h4>
            <McpSetupInstructions mcpUrl={mcpUrl} apiKey={createdKey.key} />
          </div>
          <div className="ai-agents-created-actions">
            <Button
              type="button"
              color="primary"
              variant="submit"
              onClick={handleClose}
            >
              {t("_pages:aiAgents.keys.created.done")}
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
