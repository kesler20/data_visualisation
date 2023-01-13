import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useStateContext } from "../../contexts/ContextProvider";

function TabPanel(props) {
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
}

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

/**
 *
 * @param {*} props the props are :
 * - tabPanels - an array of react components which will be display under each tab
 * - tabPanelLabels - an array of stings consisting of the labels of the tab
 * @returns
 */
export default function BasicTabs(props) {
  const { currentMode } = useStateContext();

  const [value, setValue] = React.useState(0);
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
            {props.tabPanelLabels.map((tabPanelLabel, index) => {
              return (
                <Tab
                  label={`${tabPanelLabel}`}
                  {...a11yProps(index)}
                  key={index}
                />
              );
            })}
          </Tabs>
        ) : (
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            style={{ color: "white" }}
            textColor="inherit"
          >
            {props.tabPanelLabels.map((tabPanelLabel, index) => {
              return (
                <Tab
                  label={`${tabPanelLabel}`}
                  {...a11yProps(index)}
                  key={index}
                />
              );
            })}
          </Tabs>
        )}
      </Box>
      {props.tabPanels.map((tabPanel, index) => {
        return (
          <TabPanel value={value} index={index} key={index}>
            {tabPanel}
          </TabPanel>
        );
      })}
    </Box>
  );
}
