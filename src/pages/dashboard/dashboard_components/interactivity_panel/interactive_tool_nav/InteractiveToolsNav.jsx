import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useStateContext } from "../../../../../contexts/ContextProvider";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const InteractiveToolsNav = ({ properties, propertyNames }) => {
  const [value, setValue] = React.useState(0);
  const { currentMode } = useStateContext();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        {currentMode === "Light" ? (
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            {propertyNames.length > 0 ? (
              propertyNames.map((property, index) => {
                return (
                  <Tab
                    key={index}
                    label={`${property}`}
                    {...a11yProps(index)}
                  />
                );
              })
            ) : (
              <Tab label={"Select a Column"} {...a11yProps(0)} />
            )}
          </Tabs>
        ) : (
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            style={{ color: "white" }}
            textColor="inherit"
          >
            {propertyNames.length > 0 ? (
              propertyNames.map((property, index) => {
                return (
                  <Tab
                    key={index}
                    label={`${property}`}
                    {...a11yProps(index)}
                  />
                );
              })
            ) : (
              <Tab label={"Select a Column"} {...a11yProps(0)} />
            )}
          </Tabs>
        )}
      </Box>
      {properties.map((property, index) => {
        return (
          <TabPanel value={value} index={index} key={index}>
            {property}
          </TabPanel>
        );
      })}
    </Box>
  );
};
export default InteractiveToolsNav;
