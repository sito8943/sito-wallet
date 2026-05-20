import { useTranslation, Trans } from "react-i18next";

import {
  LegalLinksList,
  LegalPage,
  LegalSection,
  richTextComponents,
} from "@sito/dashboard-app";

import { AppRoutes } from "lib";

import { PORTFOLIO_LINK_URL } from "./constants";
import type { HowToStep } from "./types";

export const About = () => {
  const { t } = useTranslation();

  const steps = t("_pages:about.howTo.steps", {
    returnObjects: true,
  }) as HowToStep[];

  const legalLinks = [
    {
      to: AppRoutes.termsAndConditions,
      label: t("_pages:about.legal.links.terms"),
    },
    {
      to: AppRoutes.privacyPolicy,
      label: t("_pages:about.legal.links.privacy"),
    },
    {
      to: AppRoutes.cookiesPolicy,
      label: t("_pages:about.legal.links.cookies"),
    },
  ];

  return (
    <LegalPage
      title={t("_pages:about.title")}
      intro={
        <Trans
          i18nKey="_pages:about.body"
          components={{
            ...richTextComponents,
            a: (
              <a
                href={PORTFOLIO_LINK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="primary underline font-bold!"
              />
            ),
          }}
        />
      }
    >
      <section>
        <h3 className="text-2xl max-sm:text-xl font-bold">
          {t("_pages:about.howTo.title")}
        </h3>
        <p className="mt-2">{t("_pages:about.howTo.body")}</p>

        <ul className="mt-5 grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-5">
          {steps.map((step, idx) => (
            <li key={idx} className="bg-base p-5 rounded-2xl">
              <h4 className="text-xl font-semibold">{step.title}</h4>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {step.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <LegalSection title={t("_pages:about.legal.title")} className="mt-8">
        <p>{t("_pages:about.legal.body")}</p>
        <LegalLinksList links={legalLinks} />
        <p className="mt-4 text-sm text-text-muted">
          {t("_pages:about.legal.updated")}
        </p>
      </LegalSection>
    </LegalPage>
  );
};
