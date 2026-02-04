import { useState } from "react";

// @sito-dashboard
import { Navbar, Drawer } from "@sito/dashboard-app";

// menu
import { menuMap } from "views";
import { Logo } from "components";

function Header() {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      <Drawer
        menuMap={menuMap}
        logo={<Logo className="w-10 h-10 rounded-full" />}
        open={showDrawer}
        onClose={() => {
          setShowDrawer(false);
        }}
      />
      <Navbar openDrawer={() => setShowDrawer(true)} />
    </>
  );
}

export default Header;
