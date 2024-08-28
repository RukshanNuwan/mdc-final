import { Table } from "react-bootstrap";
import * as XLSX from "xlsx";
import { useRef } from "react";

import "./dataTable.css";
import { calculateTimeDifferenceForReports } from "../../utils";

const BreakdownReportTable = ({ data }) => {
  const tableRef = useRef(null);

  const exportToExcel = () => {
    const table = tableRef.current;
    const workbook = XLSX.utils.table_to_book(table, {
      sheet: `${data[0]?.breakdown_date}`,
    });
    XLSX.writeFile(
      workbook,
      `${data[0]?.breakdown_date} - ${data[0]} breakdown report.xlsx`
    );
  };

  return (
    <div
      style={{ height: "100%", width: "100%" }}
      className="mt-2 d-flex flex-column"
    >
      <button className="mb-2 customBtn customBtnPrint" onClick={exportToExcel}>
        Export excel
      </button>

      <Table responsive bordered hover size="sm" ref={tableRef}>
        <thead>
          <tr className="text-center">
            <th>Date</th>
            <th>Section</th>
            <th>Location</th>
            <th>Status</th>
            <th>Details</th>
            <th>Start time</th>
            <th>Finish time</th>
            <th>Breakdown time</th>
            <th>Informed to</th>
            <th>Supervisor name</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((item, index) => {
            return (
              <tr key={index} className="text-center text-capitalize">
                <td>{item.breakdown_date}</td>
                <td>{item.breakdown_section_name}</td>
                <td>{item.location === "mdc" ? "MDC" : "Araliya Kele"}</td>
                <td>{item.status}</td>
                <td>{item.breakdownDetails}</td>
                <td>{item.startTime}</td>
                <td>{item.finishTime}</td>
                <td>
                  {calculateTimeDifferenceForReports(
                    item.startTime,
                    item.finishTime
                  )}
                </td>
                <td>{item.informedTo}</td>
                <td>{item.supervisorName}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default BreakdownReportTable;
