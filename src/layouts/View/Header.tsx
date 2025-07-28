import { useState } from "react";

// components
import { Navbar, Drawer } from "components";

function Header() {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      <Drawer
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
