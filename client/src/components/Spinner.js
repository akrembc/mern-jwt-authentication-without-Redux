import React from "react";

const Spinner = (props) => {
  return (
    <div className="d-flex flex-column bd-highlight mb-3">
      <div className="spinner-border text-secondary" role="status"></div>
      <span>{props.msg}</span>
    </div>
  );
};

Spinner.defaultProps = {
  msg: "Loading...",
};

export default Spinner;
