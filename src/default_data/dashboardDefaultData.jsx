import DashboardBuilder from "../models/DashboardBuilder";
import { Edit } from "@material-ui/icons";
import { Save } from "@material-ui/icons";
import { Add } from "@material-ui/icons";
import { BuildRounded } from "@material-ui/icons";


// use the following or get them from the database
const initialDashboardTitle = "Default Title";
// this is the initial dashboardData.plots array
const initialDashboardMetadata = [
  {
    plotSchema: {
      axis: [],
      plotType: "Scatter Plot",
      theme: "light",
      filename: "",
    },
    dataGrid: { x: 0, y: 0, w: 4, h: 4 },
    tools: {},
  },
];
const initialDashboardBg = "white";
const initialDashboardDarkBg = "black";

// initialize the dashboard builder
export const initialDashboard = new DashboardBuilder(
  initialDashboardTitle,
  initialDashboardMetadata,
  initialDashboardBg,
  initialDashboardDarkBg
);

const initialLayout = {
  lg: [
    {
      w: 4,
      h: 4,
      x: 0,
      y: 0,
      i: "0",
    },
  ],

  md: [
    {
      w: 4,
      h: 4,
      x: 0,
      y: 0,
      i: "0",
    },
  ],

  sm: [
    {
      w: 4,
      h: 4,
      x: 0,
      y: 0,
      i: "0",
    },
  ],

  xs: [
    {
      w: 2,
      h: 4,
      x: 0,
      y: 0,
      i: "0",
    },
  ],
};

export default initialLayout;

export const initialActions = [
  { icon: <Save />, name: "Save Dashboard" },
  { icon: <Edit />, name: "Edit Dashboard" },
  { icon: <Add />, name: "Add Plot" },
  { icon: <BuildRounded />, name: "Add Tools" },
];
