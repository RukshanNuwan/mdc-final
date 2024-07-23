export const wetSectionColumns = [
  { field: "primary_batch_number", headerName: "Batch#", width: 100 },
  {
    field: "wet_kernel_weight",
    headerName: "Kernel weight",
    width: 150,
    renderCell: (params) => {
      return <div>{params.row.wet_kernel_weight}Kg</div>;
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
  { field: "cutter_status", headerName: "Status", width: 130 },
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
  { field: "primary_batch_number", headerName: "Wet batch #", width: 100 },
  { field: "batch_number", headerName: "Mixing Batch #", width: 130 },
  {
    field: "wet_added_at",
    headerName: "Date & Time",
    width: 200,
    renderCell: (params) => {
      return (
        <div>
          {params.row.mixing_added_at &&
            new Date(params.row.mixing_added_at?.toDate()).toLocaleString()}
        </div>
      );
    },
  },
  {
    field: "mixing_milk_recovery",
    headerName: "Milk recovery",
    width: 120,
    renderCell: (params) => {
      return (
        <div
          className={`${
            params.row.mixing_milk_recovery > 75
              ? "text-success"
              : "text-danger"
          }`}
        >
          {params.row.mixing_milk_recovery}%
        </div>
      );
    },
  },
  {
    field: "mixing_feed_start_time",
    headerName: "Feed start time",
    width: 150,
  },
  { field: "mixing_status", headerName: "Status", width: 150 },
];

export const sprayDryerSectionColumns = [
  { field: "batch_number", headerName: "Batch #", width: 100 },
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
  { field: "sd_powder_spray_start_time", headerName: "Start time", width: 150 },
  { field: "order_name", headerName: "Order", width: 150 },
  {
    field: "sd_total_powder_quantity",
    headerName: "Powder quantity",
    width: 150,
  },
  { field: "sd_status", headerName: "Status", width: 150 },
];

export const laboratorySectionColumns = [
  { field: "batch_number", headerName: "Batch #", width: 100 },
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
  { field: "lab_status", headerName: "Status", width: 130 },
  { field: "lab_raw_ph", headerName: "Raw milk pH", width: 110 },
  { field: "lab_mix_ph", headerName: "Mix milk pH", width: 110 },
  { field: "lab_raw_tss", headerName: "Raw milk TSS", width: 150 },
  { field: "lab_mix_tss", headerName: "Mix milk TSS", width: 150 },
];
