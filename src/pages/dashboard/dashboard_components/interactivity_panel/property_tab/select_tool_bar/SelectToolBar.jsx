import * as React from "react";
import Box from "@mui/material/Box";
import CustomInputLabel from "../../../../../../components/input_label/CustomInputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useStateContext } from "../../../../../../contexts/ContextProvider";

export default function SelectToolBar(props) {
  const [toolName, setToolName] = React.useState("");
  const { currentMode } = useStateContext();

  const handleChange = (event) => {
    setToolName(event.target.value);
    props.handleSelectedTool(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl
        style={{
          maxWidth: "380px",
          minWidth: `200px`,
          width: `${parseFloat(props.containerWidth) - 90}px`,
        }}
      >
        <CustomInputLabel
          idProp="demo-simple-select-label"
          text="Select Tool"
        />
        <Select
          SelectDisplayProps={{
            style: { color: currentMode === "Light" ? "rgb(150,150,150)" : "white" },
          }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={toolName}
          label="toolName"
          onChange={handleChange}
        >
          {props.interactiveTools.map((toolName, index) => {
            return (
              <MenuItem className="ml-3" key={index} value={index}>
                {toolName}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
