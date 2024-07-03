import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export const wetSectionColumns = [
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
  { field: "batchNumber", headerName: "Batch #", width: 100 },
  { field: "tankNumber", headerName: "Tank #", width: 100 },
  {
    field: "blancherInTime",
    headerName: "Blancher in time",
    width: 150,
  },
  { field: "kernelWeight", headerName: "Kernel Weight", width: 100 },
];

export const cutterSectionColumns = [
  { field: "batchNumber", headerName: "Batch #", width: 100 },
  {
    field: "location",
    headerName: "Location",
    width: 130,
    renderCell: (params) => {
      return <div>{params.row.location === "mdc" ? "SD 03" : "SD 04"}</div>;
    },
  },
  {
    field: "blancherStartTime",
    headerName: "Blancher start time",
    width: 150,
  },
  { field: "cutterFinishTime", headerName: "Cutter finish time", width: 150 },
  { field: "expellerStartTime", headerName: "Expeller start time", width: 150 },
  {
    field: "expellerFinishTime",
    headerName: "Expeller finish time",
    width: 150,
  },
  {
    field: "expellerProcessTime",
    headerName: "Process time",
    width: 150,
    renderCell: (params) => {
      return (
        <div>
          {`${
            params.row.expellerProcessTime?.hours
              ? params.row.expellerProcessTime?.hours
              : "-"
          }hr ${
            params.row.expellerProcessTime?.minutes
              ? params.row.expellerProcessTime?.minutes
              : "-"
          }min`}
        </div>
      );
    },
  },
  { field: "expellerDelayTime", headerName: "Delay time", width: 150 },
];

export const mixingSectionColumns = [
  { field: "batchNumber", headerName: "Batch #", width: 100 },
  { field: "wet_batch_number", headerName: "Wet batch #", width: 100 },
  { field: "milkQuantity", headerName: "Milk quantity", width: 100 },
  {
    field: "additionalCratesCount",
    headerName: "Additional crates",
    width: 100,
  },
  {
    field: "milkRecovery",
    headerName: "Milk recovery",
    width: 100,
    renderCell: (params) => {
      return (
        <div
          className={`${
            Number(params.row.milkRecovery) < 75
              ? "text-danger"
              : "text-success"
          }`}
        >{`${params.row.milkRecovery}%`}</div>
      );
    },
  },
  {
    field: "recipeName",
    headerName: "Order",
    width: 150,
    renderCell: (params) => {
      return <div className="text-uppercase">{params.row.recipeName}</div>;
    },
  },
  { field: "rawMilkInTime", headerName: "Raw in time", width: 100 },
  { field: "mixingTankInTime", headerName: "Mix in time", width: 100 },
  { field: "mixingStartTime", headerName: "Mix start time", width: 100 },
  { field: "mixingFinishTime", headerName: "Mix finish time", width: 100 },
  { field: "feedTankInTime", headerName: "Feed tank in time", width: 100 },
  { field: "feedingStartTime", headerName: "Feed start time", width: 100 },
];

export const sprayDryerSectionColumns = [
  { field: "batchNumber", headerName: "Batch #", width: 100 },
  { field: "powderSprayStartTime", headerName: "Start time", width: 100 },
  { field: "powderSprayFinishTime", headerName: "Finish time", width: 100 },
  {
    field: "expectedPowderQuantity",
    headerName: "Expected powder",
    width: 100,
    renderCell: (params) => {
      return <div>{params.row.expectedPowderQuantity}Kg</div>;
    },
  },
  {
    field: "powderQuantity",
    headerName: "Quantity",
    width: 100,
    renderCell: (params) => {
      return <div>{params.row.powderQuantity}Kg</div>;
    },
  },
  {
    field: "rp",
    headerName: "RP",
    width: 100,
    renderCell: (params) => {
      return <div>{params.row.rp}kg</div>;
    },
  },
  {
    field: "powderRecovery",
    headerName: "Recovery",
    width: 100,
    renderCell: (params) => {
      return (
        <div
          className={`${
            Number(params.row.powderRecovery) < 75
              ? "text-danger"
              : "text-success"
          }`}
        >
          {params.row.powderRecovery}%
        </div>
      );
    },
  },
  {
    field: "atomizerSize",
    headerName: "Atomizer size",
    width: 100,
    renderCell: (params) => {
      return <div>{params.row.atomizerSize}mm</div>;
    },
  },
  {
    field: "inletTemp",
    headerName: "Inlet temp",
    width: 100,
    renderCell: (params) => {
      return <div>{params.row.inletTemp}&deg;C</div>;
    },
  },
  {
    field: "outletTemp",
    headerName: "Outlet temp",
    width: 100,
    renderCell: (params) => {
      return <div>{params.row.outletTemp}&deg;C</div>;
    },
  },
];

export const laboratorySectionColumns = [
  { field: "batchNumber", headerName: "Batch #", width: 100 },
  {
    field: "recipeName",
    headerName: "Order",
    width: 120,
    renderCell: (params) => {
      return <div className="text-uppercase">{params.row.recipeName}</div>;
    },
  },
  { field: "sampleInTime", headerName: "Sample in time", width: 100 },
  { field: "testStartTime", headerName: "Test start time", width: 100 },
  { field: "rawMilkPh", headerName: "Raw pH", width: 100 },
  { field: "rawMilkFat", headerName: "Raw fat", width: 100 },
  { field: "rawMilkTSS", headerName: "Raw TSS", width: 100 },
  {
    field: "rawMilkColor",
    headerName: "Raw color",
    width: 100,
    renderCell: (params) => {
      return (
        <div>
          {params.row.rawMilkColor ? (
            <CheckIcon className="text-success" />
          ) : (
            <CloseIcon className="text-danger" />
          )}
        </div>
      );
    },
  },
  {
    field: "rawMilkOdor",
    headerName: "Raw odor",
    width: 100,
    renderCell: (params) => {
      return (
        <div>
          {params.row.rawMilkOdor ? (
            <CheckIcon className="text-success" />
          ) : (
            <CloseIcon className="text-danger" />
          )}
        </div>
      );
    },
  },
  {
    field: "rawMilkTaste",
    headerName: "Raw taste",
    width: 100,
    renderCell: (params) => {
      return (
        <div>
          {params.row.rawMilkTaste ? (
            <CheckIcon className="text-success" />
          ) : (
            <CloseIcon className="text-danger" />
          )}
        </div>
      );
    },
  },
  { field: "mixMilkPh", headerName: "Mix pH", width: 100 },
  { field: "mixMilkFat", headerName: "Mix fat", width: 100 },
  { field: "mixMilkTSS", headerName: "Mix TSS", width: 100 },
  {
    field: "mixMilkColor",
    headerName: "Mix color",
    width: 100,
    renderCell: (params) => {
      return (
        <div>
          {params.row.mixMilkColor ? (
            <CheckIcon className="text-success" />
          ) : (
            <CloseIcon className="text-danger" />
          )}
        </div>
      );
    },
  },
  {
    field: "mixMilkOdor",
    headerName: "Mix odor",
    width: 100,
    renderCell: (params) => {
      return (
        <div>
          {params.row.mixMilkOdor ? (
            <CheckIcon className="text-success" />
          ) : (
            <CloseIcon className="text-danger" />
          )}
        </div>
      );
    },
  },
  {
    field: "mixMilkTaste",
    headerName: "Mix taste",
    width: 100,
    renderCell: (params) => {
      return (
        <div>
          {params.row.mixMilkTaste ? (
            <CheckIcon className="text-success" />
          ) : (
            <CloseIcon className="text-danger" />
          )}
        </div>
      );
    },
  },
  { field: "milkPowderMoisture", headerName: "Powder moisture", width: 100 },
  { field: "milkPowderFat", headerName: "Powder fat", width: 100 },
  {
    field: "milkPowderFatLayer",
    headerName: "Fat layer",
    width: 100,
    renderCell: (params) => {
      return <div>{params.row.milkPowderFatLayer}cm</div>;
    },
  },
  {
    field: "milkPowderTime",
    headerName: "Time",
    width: 100,
    renderCell: (params) => {
      return <div>{params.row.milkPowderTime}mins</div>;
    },
  },
  { field: "bulkDensity", headerName: "Bulk density", width: 100 },
  {
    field: "powderColor",
    headerName: "Powder color",
    width: 100,
    renderCell: (params) => {
      return (
        <div>
          {params.row.powderColor ? (
            <CheckIcon className="text-success" />
          ) : (
            <CloseIcon className="text-danger" />
          )}
        </div>
      );
    },
  },
  {
    field: "powderOdor",
    headerName: "Powder odor",
    width: 100,
    renderCell: (params) => {
      return (
        <div>
          {params.row.powderOdor ? (
            <CheckIcon className="text-success" />
          ) : (
            <CloseIcon className="text-danger" />
          )}
        </div>
      );
    },
  },
  {
    field: "powderTaste",
    headerName: "Powder taste",
    width: 100,
    renderCell: (params) => {
      return (
        <div>
          {params.row.powderTaste ? (
            <CheckIcon className="text-success" />
          ) : (
            <CloseIcon className="text-danger" />
          )}
        </div>
      );
    },
  },
  {
    field: "powderFreeFlowing",
    headerName: "Free flowing",
    width: 100,
    renderCell: (params) => {
      return (
        <div>
          {params.row.powderFreeFlowing ? (
            <CheckIcon className="text-success" />
          ) : (
            <CloseIcon className="text-danger" />
          )}
        </div>
      );
    },
  },
  {
    field: "powderSolubility",
    headerName: "Solubility",
    width: 100,
    renderCell: (params) => {
      return (
        <div>
          {params.row.powderSolubility ? (
            <CheckIcon className="text-success" />
          ) : (
            <CloseIcon className="text-danger" />
          )}
        </div>
      );
    },
  },
];
