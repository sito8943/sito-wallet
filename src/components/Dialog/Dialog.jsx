import { useEffect } from "react";
import PropTypes from "prop-types";
import { faClose } from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { IconButton } from "@sito/ui";

// styles
import "./styles.css";

function Dialog({ visible, onClose, children, canBeClosed }) {
  useEffect(() => {
    if (visible) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [visible]);

  return (
    <div
      className={`dialog ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-0"
      }`}
    >
      {canBeClosed ? (
        <IconButton
          onClick={onClose}
          icon={faClose}
          color="primary"
          shape="filled"
          className="top-1 right-1"
        />
      ) : null}
      {visible ? children : null}
    </div>
  );
}

Dialog.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.any,
  canBeClosed: PropTypes.bool,
};

export default Dialog;
