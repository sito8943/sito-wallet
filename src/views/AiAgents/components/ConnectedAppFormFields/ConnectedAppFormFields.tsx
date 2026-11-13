import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useController, useFormState } from "react-hook-form";

// components
import {
  MCP_PERMISSION_TAB,
  McpPermissionTabs,
  type McpPermissionTabId,
} from "components";

// utils
import { getApiKeyAreasErrorKey } from "../../utils";

// types
import type { ConnectedAppFormFieldsPropsType } from "../../types";

/** Access level and areas of a connected app, plus when they apply. */
export function ConnectedAppFormFields(props: ConnectedAppFormFieldsPropsType) {
  const { control, isLoading = false } = props;
  const { t } = useTranslation();
  const [tab, setTab] = useState<McpPermissionTabId>(MCP_PERMISSION_TAB.access);
  const { errors, submitCount } = useFormState({ control });

  const { field: accessField } = useController({
    control,
    name: "access",
    disabled: isLoading,
  });
  const { field: areasField, fieldState: areasState } = useController({
    control,
    name: "areas",
    disabled: isLoading,
    rules: {
      validate: (value) => {
        const errorKey = getApiKeyAreasErrorKey(value);
        return errorKey === null || t(errorKey);
      },
    },
  });

  // After a failed submit, show the areas tab if that is what is wrong.
  useEffect(() => {
    if (submitCount && errors.areas) setTab(MCP_PERMISSION_TAB.areas);
  }, [errors.areas, submitCount]);

  return (
    <>
      <p className="ai-agents-text">{t("_pages:aiAgents.apps.edit.note")}</p>
      <McpPermissionTabs
        name="connectedApp"
        access={accessField.value}
        onAccessChange={accessField.onChange}
        areas={areasField.value ?? []}
        onAreasChange={areasField.onChange}
        areasError={areasState.error?.message}
        disabled={isLoading}
        tab={tab}
        onTabChange={setTab}
      />
    </>
  );
}
