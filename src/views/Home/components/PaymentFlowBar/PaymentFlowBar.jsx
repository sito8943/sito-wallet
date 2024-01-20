import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// @emotion/css
import { css } from "@emotion/css";

import PropTypes from "prop-types";

export default function PaymentFlowBar({
  id,
  icon,
  label,
  labelColor,
  number,
  show,
  color,
  showHeight,
}) {
  const barCss = useMemo(
    () =>
      css({
        height: `${showHeight}px`,
      }),
    [showHeight]
  );

  return (
    <div id={id} className={`flex-col flex w-full items-end justify-end`}>
      <div
        className={`spent ${color} w-full text-light-default flex flex-col justify-between p-3 animation ${
          show ? `${barCss}` : "h-[80px]"
        }`}
      >
        <div className="w-full flex justify-end">
          <FontAwesomeIcon className="text-xl" icon={icon} />
        </div>
        <p className="text-left">$ {Math.floor(number)}</p>
      </div>
      <p className={`w-full font-[600] text-left ${labelColor}`}>{label}</p>
    </div>
  );
}

PaymentFlowBar.propTypes = {
  id: PropTypes.string,
  icon: PropTypes.any,
  label: PropTypes.string,
  labelColor: PropTypes.string,
  color: PropTypes.string,
  number: PropTypes.number,
  show: PropTypes.bool,
  showHeight: PropTypes.number,
};
