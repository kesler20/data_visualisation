import React, { forwardRef, useEffect } from "react";
import { useStateContext } from "../../../contexts/ContextProvider";
import PlotBuilder from "../../../models/PlotBuilder";
import PlotCommandLine from "./plot_command_line/PlotCommandLine";
// import D3SizeBar from "../d3_size_bar/D3SizeBar";
/**
 * This component represents the Plotly graph which is resizable and draggable
 *  - forwardRef takes a component as an argument and it references it to a DOM Element
 *  - this is used to integrate the Plotly graph as a react grid layout grid item child
 *  - therefore we need to pass style, className, ref and the other props to the div with the plot ID
 *  @see section on custom components from  https://github.com/react-grid-layout/react-grid-layout
 */
const PlotComponent = forwardRef(({ style, className, ...props }, ref) => {
  const { currentMode } = useStateContext();

  useEffect(() => {
    const { axis, plotType, theme, filename } = props.plotSchema;
    const plotly = new PlotBuilder(`plot-${props.plotID}`);

    // add the initial trace
    plotly.addTrace("scatter", "");
    plotly.addPlotTitle(filename);

    // add the plot type
    const plotTypeActionPlan = {
      "Scatter Plot": (plotly) => plotly.addScatterPlot(0),
      "Line Plot": (plotly) => plotly.addLinePlot(0),
      "Pie Chart": (plotly) => plotly.addPieChart(0),
      Histogram: (plotly) => plotly.addHistogram(0),
      "Box Plot": (plotly) => plotly.addBoxPlot(0),
      BarChart: (plotly) => plotly.addBarChart(0),
      Heatmap: (plotly) => plotly.addHeatmap(0),
      "3D Plot": (plotly) => plotly.add3DPlot(0),
    };
    plotTypeActionPlan[plotType](plotly);

    // add data to the axis
    axis.forEach((axe) => {
      //push the trace id

      if (axe[0] === "color") {
        plotly.addColorDimension(axe[1], axe[2], 0);
      } else if (axe[0] === "size") {
        plotly.addSizeDimension(axe[1], 0);
      } else {
        plotly.addAxisDimension(...axe, 0);
        // add extra axis for other plots
        if (plotly.plotData[0].type === "pie") {
          plotly.addLabelsAndValues(0);
        }
        if (plotly.plotData[0].type === "heatmap") {
          plotly.addArrayData(0);
        }
      }
    });

    // edit the plot according to the viewMode
    if (props.viewMode !== "edit") {
      plotly.removeModeBar();
    }

    // add themes
    const themeActionPlan = {
      transparent: (plotly) => {
        plotly.removeAllAxis().addLightMode();
      },
      default: (plotly) => {
        plotly.addBackgroundColor("#eaeaf2", "#edf3f4");
      },
      light: (plotly) => {
        plotly.addBackgroundColor("white", "#edf3f4");
      },
      gray: (plotly) => {
        plotly.addBackgroundColor("#e5ecf6", "#d6dde6");
      },
      seaborn: (plotly) => {
        plotly.addBackgroundColor("#e5ecf6", "white", "white");
      },
    };
    currentMode === "Dark"
      ? plotly.addDarkMode()
      : themeActionPlan[theme](plotly);
    
    // plot the constructed graph
    plotly.constructInitialPlot();
  });

  return (
    // display the plot with the command line and the handle if the viewMode is edit, otherwise display the plot
    <div>
      {props.viewMode === "edit" ? (
        <div
          style={{ ...style }}
          className={className}
          ref={ref}
          id={`plot-${props.plotID}`}
          {...props}
        >
          {
            <React.Fragment>
              <PlotCommandLine
                onOptionSelected={props.onOptionSelected}
                onSubOptionSelected={(selectedOption) =>
                  props.onSubOptionSelected(selectedOption, props.plotID)
                }
                commandLineData={props.commandLineData}
                onDeleteBtnClicked={() =>
                  props.onRemoveBtnClicked(props.plotID)
                }
              />
              {props.children[1]}
            </React.Fragment>
          }
        </div>
      ) : (
        <div
          style={{ ...style }}
          className={className}
          ref={ref}
          id={`plot-${props.plotID}`}
        >
          {/* {props.plotSchema.axis
            .map((currentAxis) => {
              return currentAxis[0];
            })
            .indexOf("size") !== -1 ? (
            <div
              style={{ ...style }}
              className={className + "relative"}
              ref={ref}
              {...props}
            >
              <D3SizeBar
              className="absolute bottom-0"
                s={props.plotSchema.axis[2][1]}
                saxis={props.plotSchema.axis[2][2]}
                font={"Arial, sans serif"}
              />
            </div>
          ) : (
            <></>
          )} */}
        </div>
      )}
    </div>
  );
});

export default PlotComponent;

// TODO: on hover add the text that says what the variables are if there is color and size
//TODO: remove all this many props and make sure that there is no state for the components
// TODO: think about how to push the state up to the container
// add D3 sizes
