import MQTTClient from "../models/MQTTClient";

export const defaultUserClients = [
  new MQTTClient(
    0,
    "tff/data",
    "tff/control",
    true,
    10,
    { value: 0, visible: false },
    1,
    true,
    "TFF-1"
  ),
  new MQTTClient(
    1,
    "ivt/data",
    "ivt/control",
    true,
    10,
    { value: 0, visible: false },
    1,
    true,
    "IVT-1"
  ),
  new MQTTClient(
    2,
    "pcc/data",
    "pcc/control",
    true,
    10,
    { value: 0, visible: false },
    1,
    true,
    "PCC-1"
  )
];

export const processClients = [
  {
    amount: "10 pas",
    title: "TFF-1",
    desc: "Purity",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
  },
  {
    amount: "98%",
    desc: "Conductivity",
    title: "Akta pcc PCC-1",
    iconColor: "rgb(0, 194, 146)",
    iconBg: "rgb(235, 250, 242)",
    pcColor: "red-600",
  },
  {
    amount: "20 mg",
    title: "IVT Reactor",
    desc: "Yield",
    iconColor: "rgb(255, 244, 229)",
    iconBg: "rgb(254, 201, 15)",
  },
  {
    amount: "10 pas",
    title: "TFF-2",
    desc: "Purity",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
  },
  {
    amount: "98%",
    title: "Formulation (LNP)",
    desc: "Purity",
    iconColor: "rgb(0, 194, 146)",
    iconBg: "rgb(235, 250, 242)",
    pcColor: "red-600",
  },
  {
    amount: "98%",
    title: "TFF-3",
    desc: "Purity",
    iconColor: "rgb(255, 244, 229)",
    iconBg: "rgb(254, 201, 15)",
  },
];
