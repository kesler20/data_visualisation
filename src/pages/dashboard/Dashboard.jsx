import React, { useState, useEffect } from "react";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import PlotComponent from "./dashboard_components/PlotComponent";
import Nav from "./dashboard_components/dashboard_speedial/Nav";
import DashboardTitle from "./dashboard_components/DashboardTitle";
import "./Dashboard.css";
import initialLayout, {
  initialDashboard,
} from "../../default_data/dashboardDefaultData";
import CommandLineModel, { subOptions } from "../../models/CommandLineModel";
import { convertFilesToTabularFormat } from "../../models/DataProcessing";
import { userFileNames, userFiles } from "../../models/CommandLineModel";
import InteractivityPanel from "./dashboard_components/interactivity_panel/InteractivityPanel";
import { Switch } from "@material-ui/core";
import { BuildRounded } from "@material-ui/icons";
import { Delete } from "@material-ui/icons";
import { useStateContext } from "../../contexts/ContextProvider";
import { db } from "../../contexts/ContextProvider";
import { initialActions } from "../../default_data/dashboardDefaultData";

// design decisions
// to add a tool add another object to the potMetadata array with a name property of tool
// the name of tools will allow us to expand the addResizableComponent function depending on the name of the tool
// thereby allowing us to add various tools
// this is done when the add tool speedial button is clicked in the handleNavBtnClicked method
// this is becuase if the tool object in the plotMetadata array is empty, a plotComponent will be displayed
// otherwise an interactivity panel will be returned by the addResizableComponent function

const ResponsiveGridLayout = WidthProvider(Responsive);

export const getUserFileId = (selectedFilename) => {
  const selectedFile = userFiles.filter(
    (file) => file.resource_name === selectedFilename
  )[0];
  return userFiles.indexOf(selectedFile);
};

/**
 * The Dashboard container is used to manipulate the data within the Dashboard page
 *
 * State:
 * - dataGrid - this is an object containing {x,y,w,h} used by (RGL) to set the grid dimensions and positions
 * this has to be passed to the GridLayout child component
 * - plotKeys - this is an array of integers which is used to create unique keys and plot ids for plotly
 * - mode - the dashboard can be in one of two modes ['edit','view']
 */
const Dashboard = () => {
  const { screenSize, currentMode, setMode, dashboards, setDashboards } =
    useStateContext();

  /**
   * this is a modified useStoredValue
   * @param {*} defaultValue
   * @param {*} key
   * @returns
   */
  const useStoredDashboard = (defaultValue, key) => {
    const [value, setValue] = useState(() => {
      const storedState = db.readResourceFromLocalStorage(key);
      const valueFromStorage = defaultValue.importDashboardData(storedState);
      return storedState.length === 0 ? defaultValue : valueFromStorage;
    });

    useEffect(() => {
      const valueToStore = defaultValue.importDashboardData(value);
      db.createResourceInLocalStorage(key, valueToStore);
    });
    return [value, setValue];
  };

  // -------------representational states
  const [viewMode, setViewMode] = useState("edit");
  const [currentLayout, setCurrentLayout] = useState([]);
  const [responsiveLayout, setResponsiveLayout] = useState(
    initialLayout,
    "responsiveLayout"
  );
  const [actions, setActions] = useState(initialActions);

  // -------------data flow states
  // command line model
  const [commandLineData, setCommandLineData] = useState(
    new CommandLineModel()
  );
  // dashboard model
  const [dashboardData, setDashboardData] = useStoredDashboard(
    initialDashboard,
    "dashboard"
  );

  // -------------global states
  const [currentAxis, setCurrentAxis] = useState([]);
  const [tabularFiles, setTabularFiles] = useState({});
  const [currentUserSelection, setCurrentUserSelection] = useState("");

  useEffect(() => {
    const dataGridFromStorage = dashboardData.plots.map((plotMetadata) => {
      return plotMetadata.dataGrid;
    });
    setResponsiveLayout({
      ...initialLayout,
      lg: dataGridFromStorage,
      md: dataGridFromStorage,
    });
  }, []);

  // only allow dave mode on mobile view
  useEffect(() => {
    if (screenSize <= 400) {
      setViewMode("save");
    }
  }, []);

  // update the tools button on the nav when the dashboard loads
  useEffect(() => {
    updateToolsBtn();
  }, []);

  // re-render dashboard when the userSelections and the layout of the dashboard change
  useEffect(() => {
    if (
      currentLayout !== [] ||
      currentUserSelection !== "" ||
      actions !== initialActions ||
      Object.keys(tabularFiles).length === 0
    ) {
      // the position of the currentLayout should correspond to the position of the dataGrids in the plots
      const { plots } = dashboardData;

      dashboardData.plots = plots.map((plotMetadata, plotID) => {
        plotMetadata.dataGrid =
          currentLayout[plotID] === undefined
            ? plotMetadata.dataGrid
            : currentLayout[plotID];
        return plotMetadata;
      });
      setDashboardData(dashboardData.buildDashboard());
    }
  }, [currentLayout, currentUserSelection, actions, tabularFiles]);

  /**
   * Handles the navbar click event of Add Plot, Save/ Edit Dashboard
   *
   * @param btnName name of the btn being clicked i.e. "Add Plot"
   *
   * @returns
   * - if the btnName variable does not match any of the cases
   * a "nav clicked" message will be logged
   */
  const handleNavBtnClicked = (btnName) => {
    // trigger re-render
    setCurrentUserSelection(btnName);

    if (btnName === "Add Plot") {
      // add the plot to the dashboard
      setDashboardData(dashboardData.addPlot());
    } else if (btnName === "Add Tools" || btnName === "Remove Tools") {
      // if the bnt of the remove or the add tool is clicked,
      updateToolsBtn();
    } else if (btnName === "Save Dashboard") {
      // save to the dashboards
      setViewMode("save");
      db.createResourceInLocalStorage("dashboard", dashboardData);
      if (
        db
          .readResourceFromLocalStorage("dashboards")
          .some((dashboard) => dashboard.title === dashboardData.title)
      ) {
        db.updateResourceInLocalStorage(
          "dashboards",
          "title",
          dashboardData.title,
          dashboardData
        );
      } else {
        db.saveResourceToLocalStorage("dashboards", dashboardData);
      }
    } else if (btnName === "Edit Dashboard") {
      setViewMode("edit");
    } else {
      console.log("nav clicked");
    }
  };

  const updateToolsBtn = () => {
    // toggle the tools btn icon and tooltip as well as its functionality
    if (
      dashboardData.plots.some(
        (plotMetadata) => plotMetadata.tools.name !== undefined
      )
    ) {
      setDashboardData(dashboardData.removeTool());
      // set the button on the navbar to add tools
      setActions((prevState) =>
        prevState.map((action) => {
          if (action.name === "Remove Tools") {
            return { icon: <BuildRounded />, name: "Add Tools" };
          } else {
            return action;
          }
        })
      );
    } else {
      setDashboardData(dashboardData.addTool());
      // set the button on the navbar to delete
      setActions((prevState) =>
        prevState.map((action) => {
          if (action.name === "Add Tools") {
            return { icon: <Delete />, name: "Remove Tools" };
          } else {
            return action;
          }
        })
      );
    }
  };

  /**
   * this is triggered when the delete button on a plot command line is clicked
   * @param {*} plotKey - the index of the plot in the dashboard
   */
  const handleRemovePlot = (plotKey) => {
    // trigger re-render
    setCurrentUserSelection(plotKey);
    setDashboardData(dashboardData.removePlot(plotKey));
  };

  /**
   * this is triggered when the used selects an option in the hamburger menu dropdown
   *
   * compound updates such a updating the axis
   * (an update which requires data from the selection and the selectedOption) can be implemented
   * using an array if there are the right control in plage
   * initially you push one piece of information to the array when the user selects an option form the
   * hamburger menu, then you push the other when the user selects the option from the main drop down menu
   *
   * @param {*} selection - this is the option selected by the user which will be used
   * to change the state of the command line model
   */
  const handleOptionSelected = (selection) => {
    // update the command line model
    setCommandLineData(commandLineData.changeState(selection));

    // update the global variables
    if (selection === "Select X axis") {
      setCurrentAxis(["x"]);
    } else if (selection === "Select Y axis") {
      setCurrentAxis(["y"]);
    } else if (selection === "Select Z axis") {
      setCurrentAxis(["z"]);
    } else if (selection === "Select Color") {
      setCurrentAxis(["color"]);
    } else if (selection === "Select Size") {
      setCurrentAxis(["size"]);
    } else {
      console.log(selection);
    }

    // update state
    setCurrentUserSelection(selection);
  };

  const handleThemeSwitch = () => {
    if (currentMode === "Light") {
      setMode({ target: { value: "Dark" } });
    } else {
      setMode({ target: { value: "Light" } });
    }
  };

  /**
   * this is used to handle the user selection of the options on main drown menu
   * @param {*} selectedOption
   */
  const handleSubOptionSelected = (selectedOption, plotID) => {
    // update the command line model
    setCommandLineData(commandLineData.changeCurrentFile(selectedOption));

    const { plotSchema } = dashboardData.plots[plotID];

    /**
     * handle user files selection
     * if the selectedOption is in the fileNames array
     * update the currentFile global variable
     * update the tabularFiles with the relevant columns of data
     * update the layout of the plot with a new title
     */
    if (userFileNames.indexOf(selectedOption) !== -1) {
      setTabularFiles(
        convertFilesToTabularFormat(userFiles)[getUserFileId(selectedOption)]
      );
      // save to local storage for filtering
      db.createResourceInLocalStorage(
        "dataToFilter",
        convertFilesToTabularFormat(userFiles)[getUserFileId(selectedOption)]
      );
      plotSchema.filename = selectedOption;
    }

    /**
     * handle axis selection
     * check if the selectedOption correspond to one of the columns of the file
     * to update the axis a compound update is required
     * therefore the currentAxis is used as selected dimension
     * if no value was pushed to the currentAxis then this will throw an alert
     */
    const columns = Object.keys(tabularFiles);
    if (columns.indexOf(selectedOption) !== -1) {
      plotSchema.axis = plotSchema.axis === undefined ? [] : plotSchema.axis;
      plotSchema.axis = plotSchema.axis.filter((axis) => {
        if (axis.length !== 0) {
          return axis[0] !== currentAxis[0];
        } else {
          return false;
        }
      });
      plotSchema.axis.push([
        currentAxis[0],
        tabularFiles[selectedOption],
        selectedOption,
      ]);
    }

    /**
     * handle plot selection
     * check if the selectedOption is in the plot array
     * update the trace builder
     */
    if (subOptions["Select a Plot"].indexOf(selectedOption) !== -1) {
      plotSchema.plotType = selectedOption;
    }

    /**
     * handle the theme of the plot
     */
    if (subOptions["Select a Theme"].indexOf(selectedOption) !== -1) {
      plotSchema.theme = selectedOption;
    }

    /**
     * updating the layout and the plot object of the correct plot
     */
    dashboardData.plots[plotID].plotSchema = plotSchema;
    setDashboardData(dashboardData.buildDashboard());
    // update state
    setCurrentUserSelection(selectedOption);
  };

  /**
   * this takes the userFiles, converts it to tabularFiles, filters the tabular files
   * and updates the state tabularFiles
   * @param {*} property - a string indicating which column to apply the transformation too
   * @param {*} value - a number indicating what will be filtered above too
   */
  const filterAbove = (property, value) => {
    let tabularFilterFromStorage =
      db.readResourceFromLocalStorage("dataToFilter");

    // instead of filtering replace the rest with nan values
    const filteredTabularData = tabularFilterFromStorage[property].map(
      (data) => {
        if (data >= value) {
          return data;
        } else {
          return NaN;
        }
      }
    );

    // update the plots
    dashboardData.plots.forEach((plotMetadata) => {
      plotMetadata.plotSchema.axis.forEach((axe) => {
        if (axe[2] === property) {
          axe = axe.splice(1, 1, filteredTabularData);
        }
      });
    });
    setDashboardData((prevState) => dashboardData);

    // update the dashboard
    setTabularFiles((prevState) => {
      prevState[property] = filteredTabularData;
      return { ...prevState };
    });
  };

  /**
   * this takes the userFiles, converts it to tabularFiles, filters the tabular files
   * and updates the state tabularFiles
   * @param {*} property - a string indicating which column to apply the transformation too
   * @param {*} value - a number indicating what will be filtered above too
   */
  const filterBelow = (property, value) => {
    let tabularFilterFromStorage =
      db.readResourceFromLocalStorage("dataToFilter");

    // instead of filtering replace the rest with nan values
    const filteredTabularData = tabularFilterFromStorage[property].map(
      (data) => {
        if (data <= value) {
          return data;
        } else {
          return NaN;
        }
      }
    );

    // update the plots
    dashboardData.plots.forEach((plotMetadata) => {
      plotMetadata.plotSchema.axis.forEach((axe) => {
        if (axe[2] === property) {
          axe = axe.splice(1, 1, filteredTabularData);
        }
      });
    });
    setDashboardData((prevState) => dashboardData);

    // update the dashboard
    setTabularFiles((prevState) => {
      prevState[property] = filteredTabularData;
      return { ...prevState };
    });
  };

  /**
   * this method is used to select whether a plot object or an interactive tool should be added to the grid layout
   * @param {*} object - this is a string, when the string is "plot"
   * a plot component will be returned else an interactivity tool
   * @param {*} objectProps - this is an object which should have
   * all the props used by the component that is returned the object should have the following properties:
   * - id,
   * - dataGrid,
   * -  mode,
   * -  plot,
   * -  handleRemovePlot,
   * -  commandLineData,
   * -  handleOptionSelected,
   * -  handleSubOptionSelected,
   * @returns ``<PlotComponent/> / <InteractivityPanel/>``
   */
  const addResizableComponent = (object, objectProps) => {
    const {
      id,
      dataGrid,
      viewMode,
      plotSchema,
      handleRemovePlot,
      commandLineData,
      handleOptionSelected,
      handleSubOptionSelected,
      tabularFiles,
    } = objectProps;

    return object === "plot" ? (
      <PlotComponent
        // required props for react, react grid layout, plotly
        key={id}
        data-grid={dataGrid}
        plotID={id}
        // representational properties
        viewMode={viewMode}
        // structural properties
        plotSchema={plotSchema}
        onRemoveBtnClicked={handleRemovePlot}
        // data processing properties
        commandLineData={commandLineData}
        onOptionSelected={handleOptionSelected}
        onSubOptionSelected={handleSubOptionSelected}
        currentUserSelection={currentUserSelection}
      />
    ) : (
      <InteractivityPanel
        key={id}
        tabularFiles={tabularFiles}
        filterAbove={filterAbove}
        filterBelow={filterBelow}
        viewMode={viewMode}
        currentUserSelection={currentUserSelection}
      />
    );
  };

  return (
    <div className="w-full bg-white dark:bg-black">
      <div className="flex flex-col w-full" id="main-dash">
        {/* dashboard navbar  */}
        <div
          className={
            currentMode === "Light"
              ? "dashboard__nav--light"
              : "dashboard__nav--dark"
          }
        >
          <div className="flex justify-between items-center w-full">
            <div className="h-full w-full flex justify-center items-center pl-22">
              <DashboardTitle
                viewMode={viewMode}
                theme={currentMode}
                currentDashboardTitle={dashboardData.title}
                onTitleChange={(e) =>
                  setDashboardData(dashboardData.addTitle(e.target.value))
                }
              />
            </div>
            <Switch onClick={handleThemeSwitch} />
          </div>
        </div>

        {/* dashboard plots */}
        <div
          className="ml-16 pb-44 pt-10 md:pt-0"
          style={{
            backgroundColor: `${
              currentMode === "Light"
                ? dashboardData.bgColor
                : dashboardData.darkBgColor
            }`,
          }}
        >
          {/* grid layout */}
          <ResponsiveGridLayout
            className="layout"
            layouts={responsiveLayout}
            onLayoutChange={setCurrentLayout}
            onResize={setCurrentLayout}
            breakpoints={{ lg: 1800, md: 1200, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 36, md: 12, sm: 6, xs: 4, xxs: 2 }}
          >
            {dashboardData.plots.map((plotMetadata, id) => {
              const { plotSchema, dataGrid, tools } = plotMetadata;
              const objectProps = {
                id,
                dataGrid,
                viewMode,
                plotSchema,
                handleRemovePlot,
                commandLineData,
                handleOptionSelected,
                handleSubOptionSelected,
                tabularFiles,
              };
              if (Object.keys(tools).length === 0) {
                return addResizableComponent("plot", objectProps);
              } else {
                return addResizableComponent(tools.name, objectProps);
              }
            })}
          </ResponsiveGridLayout>
        </div>

        {/* dashboard speed dial */}
        <Nav
          onNavBtnClicked={(btnName) => handleNavBtnClicked(btnName)}
          actions={actions}
        />
      </div>
    </div>
  );
};

export default Dashboard;

//TODO: perhaps add a preview mode ?
//TODO: simplify the architecture by having a single source of truth on the dashboard structures
// TODO: pass dashboard structure as a prop
// TODO: once that you change the state the changes remain, find a solution which does not remember the previous selections
// TODO: add popups alerting the user on whether something was successful or unsuccessful for most of the user actions
