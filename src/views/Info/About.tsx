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

import "./styles.css";

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
                className="about-link"
              />
            ),
          }}
        />
      }
    >
      <section>
        <h3 className="about-how-to-title">{t("_pages:about.howTo.title")}</h3>
        <p className="about-how-to-body">{t("_pages:about.howTo.body")}</p>

        <ul className="about-steps">
          {steps.map((step, idx) => (
            <li key={idx} className="about-step">
              <h4 className="about-step-title">{step.title}</h4>
              <ul className="about-step-items">
                {step.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <LegalSection
        title={t("_pages:about.legal.title")}
        className="about-legal-section"
      >
        <p>{t("_pages:about.legal.body")}</p>
        <LegalLinksList links={legalLinks} />
        <p className="about-legal-updated">
          {t("_pages:about.legal.updated")}
        </p>
      </LegalSection>
    </LegalPage>
  );
};
