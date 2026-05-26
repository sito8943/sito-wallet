import { matchPath } from "react-router-dom";

import { config } from "../../config";

import {
  SEO_APP_NAME,
  SEO_DEFAULT_DESCRIPTION_KEY,
  SEO_DEFAULT_IMAGE_PATH,
  SEO_DEFAULT_TITLE_KEY,
  SEO_LOCALE_BY_LANGUAGE,
  SEO_NOT_FOUND_DESCRIPTION_KEY,
  SEO_NOT_FOUND_TITLE_KEY,
  SEO_PRIVATE_ROBOTS,
  seoRouteDefinitions,
} from "./constants";
import type { SeoMetadata, SeoRouteDefinition } from "./types";

const ensureMetaTag = (
  attribute: "name" | "property",
  key: string,
): HTMLMetaElement => {
  const selector = `meta[${attribute}="${key}"]`;
  const existingTag = document.head.querySelector<HTMLMetaElement>(selector);

  if (existingTag) return existingTag;

  const metaTag = document.createElement("meta");
  metaTag.setAttribute(attribute, key);
  document.head.append(metaTag);
  return metaTag;
};

const ensureLinkTag = (rel: string): HTMLLinkElement => {
  const selector = `link[rel="${rel}"]`;
  const existingTag = document.head.querySelector<HTMLLinkElement>(selector);

  if (existingTag) return existingTag;

  const linkTag = document.createElement("link");
  linkTag.rel = rel;
  document.head.append(linkTag);
  return linkTag;
};

const resolveBaseUrl = (): string => {
  const fallbackUrl = window.location.origin;

  try {
    return new URL(config.thisUrl).toString();
  } catch {
    return fallbackUrl;
  }
};

export const resolveSeoRouteDefinition = (
  pathname: string,
): SeoRouteDefinition | undefined => {
  return seoRouteDefinitions.find((routeDefinition) =>
    Boolean(matchPath({ path: routeDefinition.path, end: true }, pathname)),
  );
};

export const resolveSeoMetadata = (
  pathname: string,
  translate: (key: string) => string,
): SeoMetadata => {
  const routeDefinition = resolveSeoRouteDefinition(pathname);

  if (!routeDefinition) {
    return {
      title: `${translate(SEO_NOT_FOUND_TITLE_KEY)} | ${SEO_APP_NAME}`,
      description: translate(SEO_NOT_FOUND_DESCRIPTION_KEY),
      robots: SEO_PRIVATE_ROBOTS,
    };
  }

  const baseTitle = translate(routeDefinition.titleKey);
  const appTitle = translate(SEO_DEFAULT_TITLE_KEY);
  const title = pathname === "/" ? appTitle : `${baseTitle} | ${SEO_APP_NAME}`;

  return {
    title,
    description:
      translate(routeDefinition.descriptionKey) ||
      translate(SEO_DEFAULT_DESCRIPTION_KEY),
    robots: routeDefinition.robots,
  };
};

export const applySeoMetadata = (
  pathname: string,
  language: string,
  metadata: SeoMetadata,
) => {
  const baseUrl = resolveBaseUrl();
  const canonicalUrl = new URL(pathname, baseUrl).toString();
  const imageUrl = new URL(SEO_DEFAULT_IMAGE_PATH, baseUrl).toString();
  const locale =
    SEO_LOCALE_BY_LANGUAGE[language as keyof typeof SEO_LOCALE_BY_LANGUAGE] ??
    SEO_LOCALE_BY_LANGUAGE.es;

  document.title = metadata.title;
  document.documentElement.lang = language;

  ensureMetaTag("name", "description").content = metadata.description;
  ensureMetaTag("name", "robots").content = metadata.robots;
  ensureMetaTag("name", "application-name").content = SEO_APP_NAME;
  ensureMetaTag("property", "og:type").content = "website";
  ensureMetaTag("property", "og:site_name").content = SEO_APP_NAME;
  ensureMetaTag("property", "og:locale").content = locale;
  ensureMetaTag("property", "og:title").content = metadata.title;
  ensureMetaTag("property", "og:description").content = metadata.description;
  ensureMetaTag("property", "og:url").content = canonicalUrl;
  ensureMetaTag("property", "og:image").content = imageUrl;
  ensureMetaTag("property", "og:image:alt").content = SEO_APP_NAME;
  ensureMetaTag("name", "twitter:card").content = "summary";
  ensureMetaTag("name", "twitter:title").content = metadata.title;
  ensureMetaTag("name", "twitter:description").content = metadata.description;
  ensureMetaTag("name", "twitter:image").content = imageUrl;
  ensureLinkTag("canonical").href = canonicalUrl;
};
