import { useMemo, useState } from "react";

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

  const featureFilteredMenuMap = useMemo(
    () => getFeatureFilteredMenuMap(isFeatureEnabled),
    [isFeatureEnabled],
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
