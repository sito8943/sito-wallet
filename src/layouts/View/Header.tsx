import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// @sito-dashboard
import { Navbar, Drawer } from "@sito/dashboard-app";

// menu
import { getFeatureFilteredMenuMap } from "views/menuMap";

// components
import { OfflineBanner } from "components";
import { useFeatureFlags } from "providers";

function Header() {
  const [showDrawer, setShowDrawer] = useState(false);
  const { isFeatureEnabled } = useFeatureFlags();
  const { i18n } = useTranslation();

  const featureFilteredMenuMap = useMemo(
    () => getFeatureFilteredMenuMap(isFeatureEnabled, i18n.resolvedLanguage),
    [isFeatureEnabled, i18n.resolvedLanguage],
  );

  return (
    <>
      <Drawer
        menuMap={featureFilteredMenuMap}
        open={showDrawer}
        onClose={() => {
          setShowDrawer(false);
        }}
      />
      <OfflineBanner />
      <Navbar openDrawer={() => setShowDrawer(true)} />
    </>
  );
}

export default Header;
