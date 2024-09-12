import { useRef } from "react";
import { Table } from "react-bootstrap";
import * as XLSX from "xlsx";

const PackingLineReportTable = ({ packingData, packingDate }) => {
  const tableRef = useRef(null);

  const getBatchNumber = (batchCode) => {
    if (batchCode) {
      const batchCodeArr = batchCode.split("");
      const batchNumber = batchCodeArr.slice(9, 11).join("");

      return batchNumber;
    }
  };

  const exportToExcel = () => {
    const table = tableRef.current;
    const workbook = XLSX.utils.table_to_book(table, {
      sheet: `${packingDate}`,
    });
    XLSX.writeFile(workbook, `${packingDate} packing line report.xlsx`);
  };

  return (
    <div
      className="mt-2 d-flex flex-column"
      style={{ height: "100%", width: "100%" }}
    >
      <button className="mb-2 customBtn customBtnPrint" onClick={exportToExcel}>
        Export excel
      </button>

      <Table responsive bordered hover size="sm" ref={tableRef}>
        <thead>
          <tr className="text-center">
            <th>Production date</th>
            <th>Production batch code</th>
            <th>SD batch #</th>
            <th>Bag numbers</th>
            <th>JS #</th>
            <th>Type</th>
            <th>Packing date</th>
            <th>T code</th>
            <th>Range</th>
            <th>Time range</th>
          </tr>
        </thead>

        <tbody>
          {packingData?.map((item, index) => {
            return (
              <tr key={index} className="text-center text-capitalize">
                <td>{item.packing_production_date}</td>
                <td>{item.production_batch_code}</td>
                <td>{getBatchNumber(item.production_batch_code)}</td>
                <td>{item.packing_bag_numbers.join(", ")}</td>
                <td>{item.packing_job_sheet_number}</td>
                <td>
                  {item.packing_type === "packing_type_20" ? "20kg" : "Other"}
                </td>
                <td>{item.packing_line_date || "-"}</td>
                <td>{item.packing_packing_batch_code}</td>
                <td>
                  {item.packing_bag_number_range_start} {" - "}
                  {item.packing_bag_number_range_end}
                </td>
                <td>
                  {item.packing_packet_time_range_start || "-"} {" - "}
                  {item.packing_packet_time_range_end || "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default PackingLineReportTable;
