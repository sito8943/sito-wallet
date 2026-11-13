import { useTranslation } from "react-i18next";

// lib
import { MCP_ACCESS_KEYS, MCP_ACCESS_LEVELS } from "lib";

// constants
import { MCP_ACCESS_SELECTOR_NAME } from "./constants";

// types
import type { McpAccessSelectorPropsType } from "./types";

import "./styles.css";

/**
 * Access level of an AI agent connection (read and write, read only or write
 * only), each with a one-line explanation. Shared by the API key dialog and
 * the OAuth consent page.
 */
export function McpAccessSelector(props: McpAccessSelectorPropsType) {
  const {
    value,
    onChange,
    name = MCP_ACCESS_SELECTOR_NAME,
    disabled = false,
    className = "",
  } = props;
  const { t } = useTranslation();

  return (
    <fieldset
      className={`mcp-access-selector ${className}`.trim()}
      disabled={disabled}
    >
      <legend className="mcp-access-selector-legend">
        {t("_pages:aiAgents.access.label")}
      </legend>
      {MCP_ACCESS_LEVELS.map((level) => {
        const key = MCP_ACCESS_KEYS[level];
        const id = `${name}-${key}`;
        return (
          <label key={level} htmlFor={id} className="mcp-access-option">
            <input
              id={id}
              type="radio"
              name={name}
              value={level}
              checked={value === level}
              onChange={() => onChange(level)}
              className="mcp-access-option-input"
            />
            <span className="mcp-access-option-content">
              <span className="mcp-access-option-label">
                {t(`_pages:aiAgents.access.levels.${key}.label`)}
              </span>
              <span className="mcp-access-option-description">
                {t(`_pages:aiAgents.access.levels.${key}.description`)}
              </span>
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
