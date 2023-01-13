import React from "react";
import { useStateContext } from "../../contexts/ContextProvider";

/**
 *
 * @props {*} bgColor - sets the background color of the component
 * @props {*} color - sets the inner color of the button text
 * @props {*} borderRadius - sets the radius of the button
 * @props {*} size - sets the text size of the component
 * @props {*} width - sets the width of the component
 * @props {*} bgHoverColor - sets the background color on hover
 */
const Button = (props) => {
  const { setIsClicked, initialState } = useStateContext();

  return (
    <button
      type="button"
      onClick={() => setIsClicked(initialState)}
      style={{
        backgroundColor: props.bgColor,
        color: props.color,
        borderRadius: props.borderRadius,
      }}
      className={`text-${props.size} p-3 w-${props.width} hover:drop-shadow-xl hover:bg-${props.bgHoverColor}`}
    >
      {props.icon} {props.text}
    </button>
  );
};

export default Button;
