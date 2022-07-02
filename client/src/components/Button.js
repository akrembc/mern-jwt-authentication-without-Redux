import React from "react";
import PropTypes from "prop-types";

const Button = ({ as, disabled, onClick, children, ...props }) => {
  const Element = as || "button"; // "as" could be Link  or "a"

  const handleClick = (event) => {
    if (disabled) {
      event.preventDefault();
      return false;
    }
    if (onClick) {
      return onClick(event);
    }
    return false;
  };

  return (
    <Element {...props} onClick={handleClick} disabled={disabled}>
      {children}
    </Element>
  );
};

Button.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  children: PropTypes.node, // node = anything renderable
  disabled: PropTypes.bool,
  onClick(props, propName, componentName, ...rest) {
    // propTypes are just functions
    if (props.disabled) {
      // throw new Error(
      //   `${componentName}: ${propName} has no effect when disabled is set`
      // );
      // console.log(
      //   `%c${componentName}: ${propName} has no effect when disabled is set`,
      //   "color: red"
      // );
    }
    if (!props.disabled && (Element === "a" || Element === "button")) {
      return PropTypes.func.isRequired(props, propName, componentName, ...rest);
    }
    return PropTypes.func(props, propName, componentName, ...rest);
  },
};

export default Button;
