import React from "react";
import { links, pageLinks } from "../../data/links";
import Divider from "../divider/Divider";
import { NavLink } from "react-router-dom";

const SidebarIcon = (props) => {
  return (
    <div className="sidebar-icon group">
      {props.icon}{" "}
      <span className="sidebar-tooltip scale-0 group-hover:scale-100">
        {props.tooltip}
      </span>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col bg-gray-50 text-white shadow-lg pt-24">
      {links.map((link, index) => {
        return (
          <a href="https://github.com/kesler20/data_visualisation">
            <SidebarIcon key={index} icon={link.icon} tooltip={link.name} />;
          </a>
        );
      })}
      <Divider />
      {pageLinks.map((link, index) => {
        return (
          <NavLink to={`${link.name}`}>
            <SidebarIcon key={index} icon={link.icon} tooltip={link.name} />;
          </NavLink>
        );
      })}
    </div>
  );
};

export default Sidebar;
