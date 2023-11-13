import PropTypes from "prop-types";

function Bill({ id, description, spent, onChangeDescription, onChangeSpent }) {
  return (
    <div className="flex w-full justify-between items-center pr-4 py-2">
      <p className="text-xl" contentEditable onChange={onChangeDescription}>
        {description}
      </p>
      <p className="font-bold" contentEditable onChange={onChangeSpent}>
        $ {spent}
      </p>
    </div>
  );
}

Bill.propTypes = {
  id: PropTypes.string,
  description: PropTypes.string,
  onChangeDescription: PropTypes.func,
  spent: PropTypes.number,
  onChangeSpent: PropTypes.func,
};

export default Bill;
