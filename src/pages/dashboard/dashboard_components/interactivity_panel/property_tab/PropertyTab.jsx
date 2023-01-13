import React, { useState } from "react";
import CustomizedSlider from "../../../../../components/slider/Slider";
import SelectToolBar from "./select_tool_bar/SelectToolBar";
import { useStateContext } from "../../../../../contexts/ContextProvider";
import RESTfulApiInterface from "../../../../../APIs/RESTfulApi";

const interactiveTools = [
  {
    name: "Filter above",
    toolComponent: (
      property,
      propertyValue,
      containerWidth,
      handleFilterAbove,
      index,
      minValue,
      maxValue,
      handleFilterBelow
    ) => {
      return (
        <CustomizedSlider
          key={index}
          minValue={minValue}
          maxValue={maxValue}
          defaultValue={propertyValue}
          name={`Filter ${property} above ${propertyValue}`}
          containerWidth={containerWidth}
          handleChangeValue={handleFilterAbove}
        />
      );
    },
  },
  {
    name: "Filter below",
    toolComponent: (
      property,
      propertyValue,
      containerWidth,
      handleFilterAbove,
      index,
      minValue,
      maxValue,
      handleFilterBelow
    ) => {
      return (
        <CustomizedSlider
          key={index}
          minValue={minValue}
          maxValue={maxValue}
          name={`Filter ${property} below ${propertyValue}`}
          containerWidth={containerWidth}
          handleChangeValue={handleFilterBelow}
        />
      );
    },
  },
  {
    name: "ANOVA",
    toolComponent: (currentColor, index, runANOVAscript) => (
      <a href="https://journaldataprocessing-production.up.railway.app/jobs/ANOVA/READ">
        <button
          key={index}
          type="button"
          style={{
            backgroundColor: currentColor,
            color: "white",
            borderRadius: "10px",
          }}
          className="text-44 p-3 w-24 hover:drop-shadow-xl mr-5"
        >
          ANOVA
        </button>
      </a>
    ),
  },
];

/**
 * this is a tab which allows to filter different properties
 * @param {*} props - this should contain
 * { property, containerWidth, containerHeight }
 * @returns ``<PropertyTab/>
 */
const PropertyTab = (props) => {
  const { property, containerWidth, containerHeight } = props;
  const [selectedTools, setSelectedTools] = useState([]);
  const [maxPropertyValue, setMaxPropertyValue] = useState(10);
  const [minPropertyValue, setMinPropertyValue] = useState(1);
  const [propertyValue, setPropertyValue] = useState(0);

  const { currentColor } = useStateContext();
  const runANOVAscript = () => {
    const api = new RESTfulApiInterface()
    api.putResource("jobs/ANOVA")
    // const data = ...
    // const parser = new DOMParser();
    // const svgDoc = parser.parseFromString(data, "image/svg+xml");
  };

  const handleSelectedTool = (toolID) => {
    selectedTools.push(toolID);
    setSelectedTools(
      selectedTools.map((toolID) => {
        return toolID;
      })
    );

    setMaxPropertyValue(Math.max(...props.tabularFiles[property]));
    setMinPropertyValue(Math.min(...props.tabularFiles[property]));
  };

  const handleFilterAbove = (e) => {
    setPropertyValue(e.target.value);
    props.filterAbove(property, e.target.value);
  };

  const handleFilterBelow = (e) => {
    setPropertyValue(e.target.value);
    props.filterBelow(property, e.target.value);
  };

  return (
    <div
      style={{
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        maxHeight: "400px",
        minHeight: `180px`,
        height: `${parseFloat(containerHeight) - 180}px`,
      }}
    >
      <SelectToolBar
        handleSelectedTool={handleSelectedTool}
        containerWidth={containerWidth}
        interactiveTools={interactiveTools.map((tool) => {
          return tool.name;
        })}
      />
      {selectedTools.map((toolID, index) => {
        let tool = interactiveTools[toolID];
        if (tool.name === "ANOVA") {
          return tool.toolComponent(currentColor, index, runANOVAscript);
        } else {
          return tool.toolComponent(
            property,
            propertyValue,
            containerWidth,
            handleFilterAbove,
            index,
            minPropertyValue,
            maxPropertyValue,
            handleFilterBelow
          );
        }
      })}
    </div>
  );
};

export default PropertyTab;
