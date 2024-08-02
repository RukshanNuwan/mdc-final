const productionNavList = [
  {
    _id: 1,
    name: "Wet Section",
    icon: "bi bi-circle",
    path: "/wet-section",
  },
  {
    _id: 2,
    name: "Cutter Section",
    icon: "bi bi-bullseye",
    path: "/cutter-section",
  },
  {
    _id: 3,
    name: "Mixing Section",
    icon: "bi bi-basket",
    path: "/mixing-section",
  },
  {
    _id: 4,
    name: "Spray Dryer",
    icon: "bi bi-box-seam",
    path: "/sd-section",
  },
  {
    _id: 5,
    name: "Laboratory",
    icon: "bi bi-file-earmark-spreadsheet-fill",
    path: "/lab-section",
  },
];

const packingLinesNavList = [
  {
    _id: 1,
    name: "Packing Lines",
    icon: "bi bi-box-fill",
    path: "/packing-lines",
  }
];

const otherNavList = [
  {
    _id: 1,
    name: "Reports",
    icon: "bi bi-file-text",
    path: "/reports",
  },
  {
    _id: 2,
    name: "Back tracing",
    icon: "bi bi-sign-turn-left",
    path: "/complaints",
  },
  // {
  //   _id: 3,
  //   name: "Orders",
  //   icon: "bi bi-truck",
  //   path: "/orders",
  // },
];

export { packingLinesNavList, productionNavList, otherNavList };
