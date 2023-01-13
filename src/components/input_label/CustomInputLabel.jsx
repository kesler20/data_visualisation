import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import styled from "styled-components";
import { useStateContext } from "../../contexts/ContextProvider";

const StyledInputLabel = styled(InputLabel)`
  && {
    color: white;
  }
`;

/**
 *
 * @param {*} props where the pros are:
 * - idProp this refers to the id which will be passed to the InputLabel component
 * - text this is the placeHolder text that the input label component will display
 * @returns
 */
const CustomInputLabel = (props) => {
  const { currentMode } = useStateContext();
  return (
    <>
      {currentMode === "Light" ? (
        <InputLabel color="primary" id={props.idProp}>{props.text}</InputLabel>
      ) : (
        <StyledInputLabel id={props.idProp}>{props.text}</StyledInputLabel>
      )}
    </>
  );
};

export default CustomInputLabel;
