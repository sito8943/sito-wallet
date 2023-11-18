import CountUp from "react-countup";
import PropTypes from "prop-types";

function Counter({ number, className, duration = 1, containerProps }) {
  return (
    <div className={className}>
      <CountUp
        duration={duration}
        decimals="2"
        decimal={"."}
        className="counter"
        end={number}
        containerProps={containerProps}
      />
    </div>
  );
}

Counter.propTypes = {
  duration: PropTypes.number,
  number: PropTypes.number,
  className: PropTypes.string,
  containerProps: PropTypes.object,
};

export default Counter;
