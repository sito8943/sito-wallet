import { useMemo } from "react";
import PropTypes from "prop-types";

// @emotion/css
import { css } from "@emotion/css";

// @sito/ui
import { useStyle } from "@sito/ui";

function Bar({ value, max, active }) {
  const { colors } = useStyle();

  const fetchPercentOf = (result, total = 450) => {
    let resultR = (100 * result) / total;
    return Math.floor(resultR + 40);
  };

  const styles = useMemo(() => {
    const gradientBar = css({
      backgroundImage: `linear-gradient(0deg, #0093E900 45%, ${colors.secondary.light}78 100%)`,
    });
    const dashedBar = css({
      background: `repeating-linear-gradient(
          45deg,
          ${colors.secondary.default}78 0px,
          ${colors.secondary.default}78 2px,
          transparent 2px,
          transparent 9px
        )`,
    });
    return {
      gradientBar,
      dashedBar,
    };
  }, [colors]);

  return (
    <div>
      <div
        className={`animation ${
          value ? "mb-[2px]" : ""
        } relative all-spent-bar flex flex-col items-start justify-between ${css(
          {
            height: `${value ? fetchPercentOf(value, max) : 4}px`,
          }
        )} ${styles.gradientBar}`}
      >
        {active ? (
          <div
            className={`${styles.dashedBar} absolute top-0 left-0 w-full h-full`}
          ></div>
        ) : null}
        <div className="top-of-the-bar secondary filled" />
        {active ? <div className="bottom-of-the-bar secondary filled" /> : null}
      </div>
      <p className="text-center h-[24px]">{value ? Math.floor(value) : ""}</p>
    </div>
  );
}

Bar.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  active: PropTypes.bool,
};

export default Bar;
