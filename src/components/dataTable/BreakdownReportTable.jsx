import { useRef } from "react";
import { Table } from "react-bootstrap";
import { DownloadTableExcel } from "react-export-table-to-excel";

import "./dataTable.css";
import { calculateTimeDifferenceForReports } from "../../utils";

const BreakdownReportTable = ({ data }) => {
  const tableRef = useRef(null);

  return (
    <div
      style={{ height: "100%", width: "100%" }}
      className="mt-2 d-flex flex-column"
    >
      <DownloadTableExcel
        filename={`${data[0]?.date} breakdowns report`}
        sheet={`${data[0]?.date}`}
        currentTableRef={tableRef.current}
      >
        <button className="mb-2 customBtn customBtnPrint">Export excel</button>
      </DownloadTableExcel>

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
