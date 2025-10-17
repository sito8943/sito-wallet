import { useTranslation, Trans } from "react-i18next";

// types
import { HowToStep } from "./types";

export const About = () => {
  const { t } = useTranslation();

  const steps = t("_pages:about.howTo.steps", {
    returnObjects: true,
  }) as HowToStep[];

  return (
    <main className="py-10 px-5 gap-5">
      <h2 className="text-4xl max-xs:text-2xl">{t("_pages:about.title")}</h2>
      <Trans
        i18nKey="_pages:about.body"
        components={[
          <p />,
          <strong />,
          <a
            href="https://sito8943.com?utm_source=sitowallet&utm_medium=about_page&utm_campaign=portfolio_link"
            target="_blank"
            rel="noopener"
            className="primary underline !font-bold"
          />,
        ]}
      />
      <section>
        <h3 className="text-2xl font-bold">{t("_pages:about.howTo.title")}</h3>
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
    </main>
  );
};
