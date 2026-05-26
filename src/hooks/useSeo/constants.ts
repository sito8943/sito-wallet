import { AppRoutes } from "lib";

import type { SeoRouteDefinition } from "./types";

export const SEO_APP_NAME = "Sito Wallet";
export const SEO_DEFAULT_IMAGE_PATH = "/pwa-512x512.png";
export const SEO_PUBLIC_ROBOTS = "index,follow";
export const SEO_PRIVATE_ROBOTS = "noindex,nofollow";
export const SEO_DEFAULT_TITLE_KEY = "_pages:seo.defaultTitle";
export const SEO_DEFAULT_DESCRIPTION_KEY = "_pages:seo.defaultDescription";
export const SEO_NOT_FOUND_TITLE_KEY = "_pages:notFound.title";
export const SEO_NOT_FOUND_DESCRIPTION_KEY = "_pages:seo.routes.notFound.description";
export const SEO_LOCALE_BY_LANGUAGE = {
  en: "en_US",
  es: "es_ES",
} as const;

export const seoRouteDefinitions: SeoRouteDefinition[] = [
  {
    path: AppRoutes.subscriptionEdit,
    titleKey: "_pages:seo.routes.subscriptionEdit.title",
    descriptionKey: "_pages:seo.routes.subscriptionEdit.description",
    robots: SEO_PRIVATE_ROBOTS,
  },
  {
    path: AppRoutes.subscriptionNew,
    titleKey: "_pages:seo.routes.subscriptionNew.title",
    descriptionKey: "_pages:seo.routes.subscriptionNew.description",
    robots: SEO_PRIVATE_ROBOTS,
  },
  {
    path: AppRoutes.signIn,
    titleKey: "_pages:auth.signIn.title",
    descriptionKey: "_pages:seo.routes.signIn.description",
    robots: SEO_PRIVATE_ROBOTS,
  },
  {
    path: AppRoutes.signUp,
    titleKey: "_pages:auth.signUp.title",
    descriptionKey: "_pages:seo.routes.signUp.description",
    robots: SEO_PUBLIC_ROBOTS,
  },
  {
    path: AppRoutes.signUpSuccess,
    titleKey: "_pages:auth.signUpSuccess.title",
    descriptionKey: "_pages:seo.routes.signUpSuccess.description",
    robots: SEO_PRIVATE_ROBOTS,
  },
  {
    path: AppRoutes.resetPassword,
    titleKey: "_pages:auth.updatePassword.title",
    descriptionKey: "_pages:seo.routes.updatePassword.description",
    robots: SEO_PRIVATE_ROBOTS,
  },
  {
    path: AppRoutes.updatePassword,
    titleKey: "_pages:auth.updatePassword.title",
    descriptionKey: "_pages:seo.routes.updatePassword.description",
    robots: SEO_PRIVATE_ROBOTS,
  },
  {
    path: AppRoutes.recovery,
    titleKey: "_pages:auth.recovery.title",
    descriptionKey: "_pages:seo.routes.recovery.description",
    robots: SEO_PRIVATE_ROBOTS,
  },
  {
    path: AppRoutes.confirmEmailSuccess,
    titleKey: "_pages:auth.confirmEmailSuccess.title",
    descriptionKey: "_pages:seo.routes.confirmEmailSuccess.description",
    robots: SEO_PRIVATE_ROBOTS,
  },
  {
    path: AppRoutes.confirmEmailError,
    titleKey: "_pages:auth.confirmEmailError.title",
    descriptionKey: "_pages:seo.routes.confirmEmailError.description",
    robots: SEO_PRIVATE_ROBOTS,
  },
  {
    path: AppRoutes.signOut,
    titleKey: "_pages:signOut.title",
    descriptionKey: "_pages:seo.routes.signOut.description",
    robots: SEO_PRIVATE_ROBOTS,
  },
  {
    path: AppRoutes.home,
    titleKey: "_pages:home.title",
    descriptionKey: "_pages:seo.routes.home.description",
    robots: SEO_PRIVATE_ROBOTS,
  },
  {
    path: AppRoutes.transactions,
    titleKey: "_pages:pages.transactions",
    descriptionKey: "_pages:seo.routes.transactions.description",
    robots: SEO_PRIVATE_ROBOTS,
  },
  {
    path: AppRoutes.transactionCategories,
    titleKey: "_pages:pages.transactionCategories",
    descriptionKey: "_pages:seo.routes.transactionCategories.description",
    robots: SEO_PRIVATE_ROBOTS,
  },
  {
    path: AppRoutes.subscriptions,
    titleKey: "_pages:pages.subscriptions",
    descriptionKey: "_pages:seo.routes.subscriptions.description",
    robots: SEO_PRIVATE_ROBOTS,
  },
  {
    path: AppRoutes.subscriptionProviders,
    titleKey: "_pages:pages.subscriptionProviders",
    descriptionKey: "_pages:seo.routes.subscriptionProviders.description",
    robots: SEO_PRIVATE_ROBOTS,
  },
  {
    path: AppRoutes.accounts,
    titleKey: "_pages:pages.accounts",
    descriptionKey: "_pages:seo.routes.accounts.description",
    robots: SEO_PRIVATE_ROBOTS,
  },
  {
    path: AppRoutes.currencies,
    titleKey: "_pages:pages.currencies",
    descriptionKey: "_pages:seo.routes.currencies.description",
    robots: SEO_PRIVATE_ROBOTS,
  },
  {
    path: AppRoutes.profile,
    titleKey: "_pages:pages.profile",
    descriptionKey: "_pages:seo.routes.profile.description",
    robots: SEO_PRIVATE_ROBOTS,
  },
  {
    path: AppRoutes.users,
    titleKey: "_pages:pages.users",
    descriptionKey: "_pages:seo.routes.users.description",
    robots: SEO_PRIVATE_ROBOTS,
  },
  {
    path: AppRoutes.about,
    titleKey: "_pages:about.title",
    descriptionKey: "_pages:seo.routes.about.description",
    robots: SEO_PUBLIC_ROBOTS,
  },
  {
    path: AppRoutes.cookiesPolicy,
    titleKey: "_pages:pages.cookies-policy",
    descriptionKey: "_pages:seo.routes.cookiesPolicy.description",
    robots: SEO_PUBLIC_ROBOTS,
  },
  {
    path: AppRoutes.privacyPolicy,
    titleKey: "_pages:pages.privacy-policy",
    descriptionKey: "_pages:seo.routes.privacyPolicy.description",
    robots: SEO_PUBLIC_ROBOTS,
  },
  {
    path: AppRoutes.termsAndConditions,
    titleKey: "_pages:pages.terms-and-conditions",
    descriptionKey: "_pages:seo.routes.termsAndConditions.description",
    robots: SEO_PUBLIC_ROBOTS,
  },
];
