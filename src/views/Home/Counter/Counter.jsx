import CountUp from "react-countup";
import PropTypes from "prop-types";

function Counter({ number, className, duration = 1 }) {
  return (
    <div className={className}>
      <CountUp
        duration={duration}
        decimals="2"
        decimal={"."}
        className="counter"
        end={number}
      />
    </div>
  );
}

Counter.propTypes = {
  duration: PropTypes.number,
  number: PropTypes.number,
  className: PropTypes.string,
};

export default Counter;
