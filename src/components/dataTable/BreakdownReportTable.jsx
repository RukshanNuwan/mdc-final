import { useRef } from "react";
import { Table } from "react-bootstrap";
import { DownloadTableExcel } from "react-export-table-to-excel";

import "./dataTable.css";

const BreakdownReportTable = ({ data }) => {
  const tableRef = useRef(null);

  const calculateTimeDifference = (startTime, endTime) => {
    if (startTime && endTime) {
      let date1 = new Date(`1970-01-01T${startTime}:00`);
      let date2 = new Date(`1970-01-01T${endTime}:00`);

      let diff = date2 - date1;

      if (diff < 0) {
        date2.setDate(date2.getDate() + 1);
        diff = date2 - date1;
      }

      let hours = Math.floor(diff / 3600000);
      let minutes = Math.floor((diff % 3600000) / 60000);

      return `${hours}h ${minutes}m`;
    }
  };

  const convertTimeStampIntoTime = (timeStamp) => {
    const firestoreTimestamp = timeStamp;
    const date = firestoreTimestamp.toDate();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");

    const timeString = `${formattedHours}:${formattedMinutes}`;

    return timeString;
  };

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
                <td>{convertTimeStampIntoTime(item.timeStamp)}</td>
                <td>{item.finishTime}</td>
                <td>
                  {calculateTimeDifference(
                    convertTimeStampIntoTime(item.timeStamp),
                    item.finishTime
                  )}
                </td>
                <td>{item.informedTo}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default BreakdownReportTable;
