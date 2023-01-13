import React from "react";
import TextField from "@mui/material/TextField";
import { useStateContext } from "../../../contexts/ContextProvider";
import styled from "styled-components";

const DarkTextField = styled(TextField)`
  && {
    background-color: white;
  }
`;

const CustomTextField = (props) => {
  const { currentMode } = useStateContext();
  return (
    <>
      {currentMode === "Light" ? (
        <TextField
          label={`${props.currentDashboardTitle}`}
          variant="outlined"
          onChange={props.onTitleChange}
        />
      ) : (
        <DarkTextField
          label={`${props.currentDashboardTitle}`}
          variant="outlined"
          onChange={props.onTitleChange}
        />
      )}
    </>
  );
};

const DashboardTitle = (props) => {
  const { viewMode, theme } = props;
  return (
    <div
      style={{
        fontWeight: 700,
        color: `${theme ? "#9292a5" : "#768db7"}`,
        width: "300px",
        fontFamily: "'Ubuntu', sans-serif",
      }}
    >
      {viewMode === "edit" ? (
        <CustomTextField
          currentDashboardTitle={`${props.currentDashboardTitle}`}
          variant="outlined"
          onTitleChange={props.onTitleChange}
        />
      ) : (
        <h2>{props.currentDashboardTitle}</h2>
      )}
    </div>
  );
};

export default DashboardTitle;
