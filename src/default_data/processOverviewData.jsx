import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { FiBarChart } from "react-icons/fi";
import { BsBoxSeam } from "react-icons/bs";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { HiOutlineRefresh } from "react-icons/hi";

// reactor performance data
export const SparklineAreaData = [
  { x: 1, yval: 2 },
  { x: 2, yval: 6 },
  { x: 3, yval: 8 },
  { x: 4, yval: 5 },
  { x: 5, yval: 10 },
];

// dashboard data
export const initialApplicationData = [
  {
    icon: <MdOutlineSupervisorAccount />,
    amount: `${process.env.REACT_APP_VERSION}`,
    title: "Journal Version",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
    pcColor: "green-600",
  },
  {
    icon: <BsBoxSeam />,
    amount: "96",
    title: "Journal Clients",
    iconColor: "rgb(255, 244, 229)",
    iconBg: "rgb(254, 201, 15)",
    pcColor: "green-600",
  },
  {
    icon: <FiBarChart />,
    amount: "423,39",
    title: "Dashboards",
    iconColor: "rgb(228, 106, 118)",
    iconBg: "rgb(255, 244, 229)",
    pcColor: "green-600",
  },
  {
    icon: <HiOutlineRefresh />,
    amount: "354",
    title: "Controlled Channels",
    iconColor: "rgb(0, 194, 146)",
    iconBg: "rgb(235, 250, 242)",
    pcColor: "green-600",
  },
];

export const dropdownData = [
  {
    Id: "1",
    Time: "Lab 1",
  },
  {
    Id: "2",
    Time: "Lab 2",
  },
  {
    Id: "3",
    Time: "Lab 3",
  },
];

// pie chart with percentages
export const ecomPieChartData = [
  { x: "2018", y: 18, text: "35%" },
  { x: "2019", y: 18, text: "15%" },
  { x: "2020", y: 18, text: "25%" },
  { x: "2021", y: 18, text: "25%" },
];

export const DropDown = (props) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent
      id="time"
      fields={{ text: "Time", value: "Id" }}
      style={{ border: "none", color: props.currentMode === "Dark" && "white" }}
      value="1"
      dataSource={dropdownData}
      popupHeight="220px"
      popupWidth="120px"
    />
  </div>
);
