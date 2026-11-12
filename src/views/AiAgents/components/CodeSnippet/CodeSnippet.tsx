import { faCopy } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { IconButton, classNames } from "@sito/dashboard-app";

// hooks
import { useCopyToClipboard } from "hooks";

// types
import type { CodeSnippetPropsType } from "../../types";

/** Read-only code block with a copy-to-clipboard button. */
export function CodeSnippet(props: CodeSnippetPropsType) {
  const { code, copyLabel, label, wrap = false } = props;
  const copy = useCopyToClipboard();

  return (
    <div className="ai-agents-snippet">
      {label && <span className="ai-agents-snippet-label">{label}</span>}
      <div className="ai-agents-snippet-body">
        <pre
          className={classNames(
            "ai-agents-snippet-code",
            wrap && "ai-agents-snippet-code--wrap",
          )}
        >
          <code>{code}</code>
        </pre>
        <IconButton
          icon={faCopy}
          type="button"
          color="primary"
          className="ai-agents-snippet-copy"
          aria-label={copyLabel}
          data-tooltip-id="tooltip"
          data-tooltip-content={copyLabel}
          onClick={() => void copy(code)}
        />
      </div>
    </div>
  );
}
