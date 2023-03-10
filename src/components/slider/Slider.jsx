import * as React from "react";
import PropTypes from "prop-types";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { useStateContext } from "../../contexts/ContextProvider";

function ValueLabelComponent(props) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  value: PropTypes.number.isRequired,
};

const PrettoSlider = styled(Slider)({
  color: "#52af77",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#52af77",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&:before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

/**
 *
 * @param {*} props this has a props of:
 * - name
 * - minValue
 * - maxValue
 * - handleChangeValue
 * - defaultValue
 * @returns
 */
export default function CustomizedSlider(props) {
  const { currentMode } = useStateContext();
  return (
    <Box
      sx={{
        maxWidth: "380px",
        minWidth: `200px`,
        width: `${parseFloat(props.containerWidth) - 90}px`,
      }}
    >
      <p style={{ color: `${currentMode === "Light" ? "black" : "white"}` }}>
        {props.name}
      </p>
      <PrettoSlider
        controlled="true"
        valueLabelDisplay="auto"
        aria-label="pretto slider"
        defaultValue={props.defaultValue}
        min={props.minValue}
        max={props.maxValue}
        onChange={props.handleChangeValue}
      />
    </Box>
  );
}
