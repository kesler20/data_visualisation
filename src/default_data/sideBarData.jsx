import { AiOutlineCloudUpload, AiFillControl } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { BiTestTube, BiUserCircle } from "react-icons/bi";
import { RiDragDropFill } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";

export const links = [
  {
    title: "Dashboard",
    links: [
      {
        name: "Process Overview",
        icon: <MdDashboard />,
        link: "process",
      },
      {
        name: "Account Summary",
        icon: <BiUserCircle />,
        link: "account",
      },
    ],
  },
  {
    title: "Pages",
    links: [
      {
        name: "File Upload",
        icon: <AiOutlineCloudUpload />,
        link: "upload",
      },
      {
        name: "Dashboard Builder",
        icon: <RiDragDropFill />,
        link: "dashboard",
      },
      {
        name: "Experimental Feature",
        icon: <BiTestTube />,
        link: "experimental",
      },
      {
        name: "Data Streams",
        icon: <AiFillControl />,
        link: "real_time",
      },
    ],
  },
  {
    title: "Feedback",
    links: [
      {
        name: "editor",
        icon: <FiEdit />,
        link: "editor",
      },
    ],
  },
];
