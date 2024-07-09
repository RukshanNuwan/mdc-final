export const wetSectionColumns = [
  { field: "primary_batch_number", headerName: "Batch#", width: 100 },
  {
    field: "wet_kernel_weight",
    headerName: "Kernel weight",
    width: 150,
    renderCell: (params) => {
      return <div>{params.row.wet_kernel_weight}kg</div>;
    },
  },
  {
    field: "wet_added_at",
    headerName: "Date & Time",
    width: 200,
    renderCell: (params) => {
      return (
        <div>
          {new Date(params.row.wet_added_at?.toDate()).toLocaleString()}
        </div>
      );
    },
  },
  {
    field: "blancher_in_time",
    headerName: "Blancher in time",
    width: 200,
  },
];

export const cutterSectionColumns = [
  { field: "primary_batch_number", headerName: "Wet batch #", width: 100 },
  {
    field: "wet_added_at",
    headerName: "Date & Time",
    width: 200,
    renderCell: (params) => {
      return (
        <div>
          {new Date(params.row.wet_added_at?.toDate()).toLocaleString()}
        </div>
      );
    },
  },
  {
    field: "expeller_finish_time",
    headerName: "Expeller finish time",
    width: 150,
  },
  { field: "cutter_expeller_delay_time", headerName: "Delay time", width: 150 },
  { field: "status", headerName: "Status", width: 130 },
  {
    field: "location",
    headerName: "Location",
    width: 130,
    renderCell: (params) => {
      return (
        <div>
          {params.row.location === "mdc"
            ? "SD 03"
            : params.row.location === "araliya_kele"
            ? "SD 04"
            : "-"}
        </div>
      );
    },
  },
];

export const mixingSectionColumns = [
  { field: "wet_batch_number", headerName: "Wet batch", width: 100 },
  { field: "batchNumber", headerName: "Mixing Batch", width: 100 },
  {
    field: "timeStamp",
    headerName: "Date & Time",
    width: 200,
    renderCell: (params) => {
      return (
        <div>{new Date(params.row.timeStamp?.toDate()).toLocaleString()}</div>
      );
    },
  },
  { field: "milkRecovery", headerName: "Milk recovery", width: 150 },
  { field: "feedingStartTime", headerName: "Feed start time", width: 150 },
  { field: "status", headerName: "Status", width: 150 },
];

export const sprayDryerSectionColumns = [
  { field: "batchNumber", headerName: "Batch", width: 100 },
  {
    field: "timeStamp",
    headerName: "Date & Time",
    width: 200,
    renderCell: (params) => {
      return (
        <div>{new Date(params.row.timeStamp?.toDate()).toLocaleString()}</div>
      );
    },
  },
  { field: "powderSprayStartTime", headerName: "Start time", width: 150 },
  { field: "recipeName", headerName: "Order", width: 150 },
  { field: "powderQuantity", headerName: "Powder quantity", width: 150 },
  { field: "status", headerName: "Status", width: 150 },
];

export const laboratorySectionColumns = [
  { field: "batchNumber", headerName: "Batch", width: 100 },
  {
    field: "timeStamp",
    headerName: "Date & Time",
    width: 200,
    renderCell: (params) => {
      return (
        <div>{new Date(params.row.timeStamp?.toDate()).toLocaleString()}</div>
      );
    },
  },
  { field: "status", headerName: "Status", width: 150 },
  { field: "rawMilkPh", headerName: "Raw milk pH", width: 100 },
  { field: "mixMilkPh", headerName: "Mix milk pH", width: 100 },
  { field: "rawMilkTSS", headerName: "Raw milk TSS", width: 150 },
  { field: "mixMilkTSS", headerName: "Mix milk TSS", width: 150 },
];
