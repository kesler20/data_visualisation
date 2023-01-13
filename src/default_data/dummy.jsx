import React from "react";
import { BsShield, BsGraphUp } from "react-icons/bs";
import { MdDashboard } from "react-icons/md";
import NotificationModel from "../models/NotificationModel";

export const EditorData = () => (
  <div>
    <h3>
      Here you can request any new feature that you would like the dashboard to
      have if you have existing code which you would like to include into the
      dashboard, you can paste a link to its github repo below
    </h3>
  </div>
);

export const barPrimaryXAxis = {
  valueType: "Category",
  interval: 1,
  majorGridLines: { width: 0 },
};
export const barPrimaryYAxis = {
  majorGridLines: { width: 0 },
  majorTickLines: { width: 0 },
  lineStyle: { width: 0 },
  labelStyle: { color: "transparent" },
};

export const userProfileData = [
  {
    icon: <MdDashboard />,
    destination: "/account",
    title: "My Profile",
    desc: "Account Summary",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
  },
  {
    icon: <BsShield />,
    title: "Create a Dashboard",
    destination: "/dashboard",
    desc: "Use the dashboard builder",
    iconColor: "rgb(0, 194, 146)",
    iconBg: "rgb(235, 250, 242)",
  },
  {
    icon: <BsGraphUp />,
    title: "Monitor Process",
    destination: "/real_time",
    desc: "Monitor process real-time",
    iconColor: "rgb(255, 244, 229)",
    iconBg: "rgb(254, 201, 15)",
  },
];

export const initialNotifications = [
  new NotificationModel([
    "Welcome to wizapp v0.3",
    "this is the latest version of the wizapp",
  ]),
];
