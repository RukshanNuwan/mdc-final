import { useRef } from "react";
import { Table } from "react-bootstrap";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { DownloadTableExcel } from "react-export-table-to-excel";

import "./dataTable.css";

const ReportDataTable = ({ data }) => {
  const tableRef = useRef(null);

  return (
    <div
      style={{ height: "100%", width: "100%" }}
      className="mt-2 d-flex flex-column"
    >
      <DownloadTableExcel
        filename={`${data[0]?.date} summery report`}
        sheet={`${data[0]?.date}`}
        currentTableRef={tableRef.current}
      >
        <button className="mb-2 customBtn customBtnPrint">Export excel</button>
      </DownloadTableExcel>

      <Table responsive bordered hover size="sm" ref={tableRef}>
        <thead>
          <tr>
            <th>Wet batch #</th>
            <th>Batch #</th>
            <th>Location</th>
            <th>Order name</th>
            <th>Kernel weight</th>
            <th>Wet load time</th>
            <th>Cutter start time</th>
            <th>Milk weight</th>
            <th>Efficiency</th>
            <th>Raw pH</th>
            <th>Raw TSS</th>
            <th>Raw fat</th>
            <th>Taste</th>
            <th>Color</th>
            <th>Odor</th>
            <th>Mix pH</th>
            <th>Mix TSS</th>
            <th>Mix fat</th>
            <th>Taste</th>
            <th>Color</th>
            <th>Odor</th>
            <th>Raw milk in time</th>
            <th>Mix start time</th>
            <th>Mix finish time</th>
            <th>Feed tank in time</th>
            <th>Feed start time</th>
            <th>Powder spray start time</th>
            <th>Powder spray finish time</th>
            <th>RP</th>
            <th>Inlet temp</th>
            <th>Outlet temp</th>
            <th>Pressure pump</th>
            <th>Moisture</th>
            <th>Fat</th>
            <th>Fat layer</th>
            <th>Time</th>
            <th>Taste</th>
            <th>Color</th>
            <th>Odor</th>
            <th>Solubility</th>
            <th>Free flowing</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((item, index) => (
            <tr key={index}>
              <td>{item.primary_batch_number}</td>
              <td>{item.batch_number}</td>
              <td>{item.location === "mdc" ? "SD - 03" : "SD - 04"}</td>
              <td>{item.order_name}</td>
              <td>{item.wet_kernel_weight}kg</td>
              <td>{item.blancher_in_time}</td>
              <td>{item.cutter_expeller_start_time}</td>
              <td>{item.mixing_milk_quantity}kg</td>
              <td
                className={`${
                  item.mixing_milk_recovery < 75
                    ? "text-danger"
                    : "text-success"
                }`}
              >
                {item.mixing_milk_recovery}%
              </td>
              <td>{item.lab_raw_ph}</td>
              <td>{item.lab_raw_tss}</td>
              <td>{item.lab_raw_fat}</td>
              <td>
                {item.lab_row_taste ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
              <td>
                {item.lab_row_color ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
              <td>
                {item.lab_row_odor ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
              <td>{item.lab_mix_ph}</td>
              <td>{item.lab_mix_tss}</td>
              <td>{item.lab_mix_fat}</td>
              <td>
                {item.lab_mix_taste ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
              <td>
                {item.lab_mix_color ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
              <td>
                {item.lab_mix_odor ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
              <td>{item.expeller_finish_time}</td>
              <td>{item.mixing_mix_start_time}</td>
              <td>{item.mixing_mix_finish_time}</td>
              <td>{item.mixing_feeding_tank_in_time}</td>
              <td>{item.mixing_feed_start_time}</td>
              <td>{item.sd_powder_spray_start_time}</td>
              <td>{item.sd_batch_finish_time}</td>
              <td>{item.sd_rp_quantity}kg</td>
              <td>{item.sd_inlet_temp}&deg;C</td>
              <td>{item.sd_outlet_temp}&deg;C</td>
              <td>{item.mixing_pressure_pump_value}MPa</td>
              <td>{item.lab_powder_moisture}%</td>
              <td>{item.lab_powder_fat}</td>
              <td>{item.lab_powder_fat_layer}cm</td>
              <td>{item.lab_powder_fat_layer_time}min</td>
              <td>
                {item.lab_powder_taste ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
              <td>
                {item.lab_powder_color ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
              <td>
                {item.lab_powder_odor ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
              <td>
                {item.lab_powder_solubility ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
              <td>
                {item.lab_powder_free_flowing ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ReportDataTable;
