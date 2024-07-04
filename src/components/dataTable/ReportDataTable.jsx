import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import "./dataTable.css";

const ReportDataTable = ({ dataSet, columnName }) => {
  return (
    <div style={{ height: "100%", width: "100%" }} className="mt-2">
      <DataGrid
        rows={dataSet}
        columns={columnName}
        slots={{ toolbar: GridToolbar }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
          sorting: {
            sortModel: [{ field: "batchNumber", sort: "asc" }],
          },
        }}
        pageSizeOptions={[25, 50, 100, 500, 750]}
        getRowId={(row) => row.id}
      />
    </div>
  );
};

export default ReportDataTable;
