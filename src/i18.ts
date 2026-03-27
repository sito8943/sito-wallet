import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { namespaces } from "./lang/nameSpaces.ts";

const fallbackLng = "es";
const supportedLngs = ["es", "en"] as const;
type SupportedLng = (typeof supportedLngs)[number];
type ResourceBundle = Record<string, unknown>;
type LanguageResources = {
  _accessibility: ResourceBundle;
  _pages: ResourceBundle;
  _entities: ResourceBundle;
};

const resourceLoaders: Record<
  SupportedLng,
  () => Promise<[unknown, unknown, unknown]>
> = {
  es: () =>
    Promise.all([
      import("./lang/es/_accessibility.json"),
      import("./lang/es/_pages.json"),
      import("./lang/es/_entities.json"),
    ]),
  en: () =>
    Promise.all([
      import("./lang/en/_accessibility.json"),
      import("./lang/en/_pages.json"),
      import("./lang/en/_entities.json"),
    ]),
};

const toResourceBundle = (resource: unknown): ResourceBundle => {
  if (
    typeof resource === "object" &&
    resource !== null &&
    "default" in resource
  ) {
    return (resource as { default: ResourceBundle }).default;
  }
  return resource as ResourceBundle;
};

const normalizeLanguage = (
  input?: string | readonly string[],
): SupportedLng => {
  const value = Array.isArray(input) ? input[0] : input;
  if (!value) return fallbackLng;
  const language = value.split("-")[0].toLowerCase() as SupportedLng;
  return supportedLngs.includes(language) ? language : fallbackLng;
};

const loadedLanguageResources = new Map<SupportedLng, LanguageResources>();
const appliedLanguages = new Set<SupportedLng>();

const loadLanguageResources = async (
  lng: SupportedLng,
): Promise<LanguageResources> => {
  const cached = loadedLanguageResources.get(lng);
  if (cached) return cached;

  const [accessibility, pages, entities] = await resourceLoaders[lng]();
  const parsed: LanguageResources = {
    _accessibility: toResourceBundle(accessibility),
    _pages: toResourceBundle(pages),
    _entities: toResourceBundle(entities),
  };
  loadedLanguageResources.set(lng, parsed);
  return parsed;
};

const applyLanguageResources = (
  lng: SupportedLng,
  resources: LanguageResources,
) => {
  if (appliedLanguages.has(lng)) return;
  i18n.addResourceBundle(
    lng,
    "_accessibility",
    resources._accessibility,
    true,
    true,
  );
  i18n.addResourceBundle(lng, "_pages", resources._pages, true, true);
  i18n.addResourceBundle(lng, "_entities", resources._entities, true, true);
  appliedLanguages.add(lng);
};

export const initI18n = async () => {
  if (i18n.isInitialized) return i18n;

  const detector = new LanguageDetector();
  const preferredLng = normalizeLanguage(detector.detect());

  const fallbackResources = await loadLanguageResources(fallbackLng);
  const preferredResources =
    preferredLng === fallbackLng
      ? fallbackResources
      : await loadLanguageResources(preferredLng);

  const resources: Record<string, LanguageResources> = {
    [fallbackLng]: fallbackResources,
  };
  if (preferredLng !== fallbackLng) {
    resources[preferredLng] = preferredResources;
  }

  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng,
      supportedLngs: [...supportedLngs],
      load: "languageOnly",
      lng: preferredLng,
      ns: namespaces,
      defaultNS: "_pages",
      resources,
    });

  appliedLanguages.add(fallbackLng);
  appliedLanguages.add(preferredLng);

  i18n.on("languageChanged", async (lng) => {
    const normalized = normalizeLanguage(lng);
    const languageResources = await loadLanguageResources(normalized);
    applyLanguageResources(normalized, languageResources);
  });

  return i18n;
};

export default i18n;
