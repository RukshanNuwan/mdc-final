export const wetSectionColumns = [
  { field: "batchNumber", headerName: "Batch", width: 100 },
  { field: "kernelWeight", headerName: "Kernel weight", width: 150 },
  {
    field: "date",
    headerName: "Date",
    width: 160,
  },
  {
    field: "blancherInTime",
    headerName: "Blancher in time",
    width: 200,
  },
];

export const cutterSectionColumns = [
  { field: "batchNumber", headerName: "Wet batch no", width: 100 },
  { field: "date", headerName: "Date", width: 150 },
  {
    field: "expellerFinishTime",
    headerName: "Expeller finish time",
    width: 150,
  },
  { field: "expellerDelayTime", headerName: "Delay time", width: 150 },
  { field: "status", headerName: "Status", width: 130 },
  {
    field: "location",
    headerName: "Location",
    width: 130,
    renderCell: (params) => {
      return (
        <div>{params.row.location === "mdc" ? "MDC" : "Araliya Kele"}</div>
      );
    },
  },
];

export const mixingSectionColumns = [
  { field: "wet_batch_number", headerName: "Wet batch", width: 100 },
  { field: "batchNumber", headerName: "Mixing Batch", width: 100 },
  { field: "date", headerName: "Date", width: 150 },
  { field: "milkRecovery", headerName: "Milk recovery", width: 150 },
  { field: "feedingStartTime", headerName: "Feed start time", width: 150 },
  { field: "status", headerName: "Status", width: 150 },
];

export const sprayDryerSectionColumns = [
  { field: "batchNumber", headerName: "Batch", width: 100 },
  { field: "date", headerName: "Date", width: 150 },
  { field: "powderSprayStartTime", headerName: "Start time", width: 150 },
  { field: "recipeName", headerName: "Order", width: 150 },
  { field: "powderQuantity", headerName: "Powder quantity", width: 150 },
  { field: "status", headerName: "Status", width: 150 },
];

export const laboratorySectionColumns = [
  { field: "batchNumber", headerName: "Batch", width: 100 },
  { field: "date", headerName: "Date", width: 150 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "rawMilkPh", headerName: "Raw milk pH", width: 100 },
  { field: "mixMilkPh", headerName: "Mix milk pH", width: 100 },
  { field: "rawMilkTSS", headerName: "Raw milk TSS", width: 150 },
  { field: "mixMilkTSS", headerName: "Mix milk TSS", width: 150 },
];
