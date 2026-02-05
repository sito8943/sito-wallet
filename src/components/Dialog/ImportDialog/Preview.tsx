import { BaseEntityDto, useTranslation } from "@sito/dashboard-app";

type ImportDialogPreviewProps<EntityDto extends BaseEntityDto> = {
  items: EntityDto[];
  max?: number;
  className?: string;
};

export function ImportDialogPreview<EntityDto extends BaseEntityDto>(
  props: ImportDialogPreviewProps<EntityDto>
) {
  const { items, max = 5, className = "" } = props;
  const { t } = useTranslation();

  if (!items || items.length === 0) return null;

  const limited = items.slice(0, max);

  return (
    <div className={`mt-4 ${className}`}>
      <p className="text-sm text-gray-600">
        {t("_pages:common.actions.import.previewCount", {
          count: items.length,
          defaultValue: `Preview: ${items.length} items`,
        })}
      </p>
      <pre className="mt-2 max-h-56 overflow-auto rounded bg-gray-100 p-3 text-xs">
        {JSON.stringify(limited, null, 2)}
      </pre>
    </div>
  );
}

