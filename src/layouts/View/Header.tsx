import { useState } from "react";

// @sito-dashboard
import { Navbar, Drawer } from "@sito/dashboard-app";

// menu
import { menuMap } from "views";

function Header() {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      <Drawer
        menuMap={menuMap}
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
