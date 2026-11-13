import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble, faRightLeft } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { Button } from "@sito/dashboard-app";

// lib
import { MCP_AREA_KEYS, MCP_AREAS } from "lib";

// constants
import { MCP_AREA_SELECTOR_NAME } from "./constants";

// utils
import { invertMcpAreas, selectAllMcpAreas, toggleMcpArea } from "./utils";

// types
import type { McpAreaSelectorPropsType } from "./types";

import "./styles.css";

/**
 * Parts of the wallet an API key may use (transactions, debts, ...), each
 * with a one-line explanation. At least one must stay selected.
 */
export function McpAreaSelector(props: McpAreaSelectorPropsType) {
  const {
    value,
    onChange,
    name = MCP_AREA_SELECTOR_NAME,
    disabled = false,
    error,
    className = "",
  } = props;
  const { t } = useTranslation();
  const errorId = `${name}-error`;

  return (
    <fieldset
      className={`mcp-area-selector ${className}`.trim()}
      disabled={disabled}
      aria-describedby={error ? errorId : undefined}
    >
      <legend className="mcp-area-selector-legend">
        {t("_pages:aiAgents.areas.label")}
      </legend>
      <p className="mcp-area-selector-helper">
        {t("_pages:aiAgents.areas.helper")}
      </p>
      <div className="mcp-area-selector-actions">
        <Button
          type="button"
          variant="text"
          disabled={disabled}
          onClick={() => onChange(selectAllMcpAreas())}
        >
          <FontAwesomeIcon icon={faCheckDouble} />{" "}
          {t("_pages:aiAgents.areas.selectAll")}
        </Button>
        <Button
          type="button"
          variant="text"
          disabled={disabled}
          onClick={() => onChange(invertMcpAreas(value))}
        >
          <FontAwesomeIcon icon={faRightLeft} />{" "}
          {t("_pages:aiAgents.areas.invert")}
        </Button>
      </div>
      {MCP_AREAS.map((area) => {
        const key = MCP_AREA_KEYS[area];
        const id = `${name}-${key}`;
        return (
          <label key={area} htmlFor={id} className="mcp-area-option">
            <input
              id={id}
              type="checkbox"
              name={name}
              value={area}
              checked={value.includes(area)}
              onChange={() => onChange(toggleMcpArea(value, area))}
              className="mcp-area-option-input"
            />
            <span className="mcp-area-option-content">
              <span className="mcp-area-option-label">
                {t(`_pages:aiAgents.areas.items.${key}.label`)}
              </span>
              <span className="mcp-area-option-description">
                {t(`_pages:aiAgents.areas.items.${key}.description`)}
              </span>
            </span>
          </label>
        );
      })}
      {error && (
        <p id={errorId} role="alert" className="mcp-area-selector-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
