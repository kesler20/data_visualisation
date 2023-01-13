import React from "react";
import ThemeSwitch from "../switches/ThemeSwitch";
import { useStateContext } from "../../contexts/ContextProvider";
import "./Footer.css";
import { ThemeSettingBtn } from "../../App";
import { Edit } from "@material-ui/icons";
import { Save } from "@material-ui/icons";
import { Add } from "@material-ui/icons";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InsightsIcon from "@mui/icons-material/Insights";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Nav from "../speedial/Nav";
import { AiOutlinePoweroff } from "react-icons/ai";

const dashboardActions = [
  { icon: <Save />, name: "Save Dashboard" },
  { icon: <Edit />, name: "Edit Dashboard" },
  { icon: <Add />, name: "Add Plot" },
];

const accountActions = [
  { icon: <InsightsIcon />, name: "Create Client" },
  { icon: <DashboardIcon />, name: "Create Dashboard" },
  { icon: <UploadFileIcon />, name: "Upload File" },
];

const spacingForButtons = (page) => {
  if (page === "/dashboard") {
    return "mb-56";
  } else if (page === "/real_time") {
      return "mb-[300px] mr-12 ";
  } else if (page === "/account") {
    return "mb-56";
  } else {
    return "mb-12";
  }
};

const ButtonFactory = (page) => {
  if (page === "/dashboard") {
    return <Nav actions={dashboardActions} />;
  } else if (page === "/real_time") {
    return (
      <div className="custom powerBtn" style={{ width: "50px", height: "50px"}}>
        <AiOutlinePoweroff />
      </div>
    );
  } else if (page === "/account") {
    return <Nav actions={accountActions} />;
  } else {
    return <ThemeSettingBtn />;
  }
};

const Footer = (props) => {
  const { screenSize, setMode, mode } = useStateContext();

  const handleMobileThemeSwitch = () => {
    if (mode === "Dark") {
      setMode({ target: { value: "Light" } });
    } else if (mode === "Light") {
      setMode({ target: { value: "Dark" } });
    } else {
      const currentMode = localStorage.getItem("themeMode");
      if (currentMode === "Light") {
        setMode({ target: { value: "Dark" } });
      } else {
        setMode({ target: { value: "Light" } });
      }
    }
  };

  return (
    <div
      className={`${
        window.location.pathname === "/dashboard" ? "" : "mt-24"
      }`}
    >
      {screenSize <= 400 ? (
        <div
          id="mobile-navbar"
          className="opacity-75 w-full h-[60px] pl-5 flex justify-around items-center bg-white dark:bg-secondary-dark-bg rounded-t-[25px]"
        >
          <div>{props.hamburgerBtn}</div>
          <div className={`${spacingForButtons(window.location.pathname)}`}>
            {ButtonFactory(window.location.pathname)}
          </div>
          <div >
            <ThemeSwitch
              customFunc={handleMobileThemeSwitch}
              checked={mode === "Dark"}
            />
          </div>
        </div>
      ) : (
        <p className="dark:text-gray-200 text-gray-700 text-center m-20"></p>
      )}
    </div>
  );
};

export default Footer;
