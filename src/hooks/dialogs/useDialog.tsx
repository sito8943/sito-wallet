import { useState } from "react";

export const useDialog = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const handleOpen = () => setOpen(true);

  return { open, setOpen, handleClose, handleOpen };
};
