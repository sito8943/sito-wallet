import { useTranslation, Trans } from "react-i18next";

import {
  LegalPage,
  LegalSection,
  richTextComponents,
  type LegalContentSectionType,
} from "@sito/dashboard-app";

export const TermsAndConditions = () => {
  const { t } = useTranslation();

  const sections = t("_pages:termsAndConditions.sections", {
    returnObjects: true,
  }) as LegalContentSectionType[];

  return (
    <LegalPage
      title={t("_pages:termsAndConditions.title")}
      intro={
        <Trans
          i18nKey="_pages:termsAndConditions.body"
          components={richTextComponents}
        />
      }
    >
      <section className="mt-6 space-y-6">
        {sections.map((section, idx) => (
          <LegalSection key={idx} title={section.title}>
            <Trans
              i18nKey={`_pages:termsAndConditions.sections.${idx}.body`}
              components={richTextComponents}
            />
          </LegalSection>
        ))}
      </section>
    </LegalPage>
  );
};
