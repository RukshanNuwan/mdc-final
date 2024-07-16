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
            <th colSpan={2} className="text-center daily-summery-bg-red">
              Batch number
            </th>
            <th colSpan={7} className="daily-summery-bg-red"></th>
            <th colSpan={6} className="text-center daily-summery-bg-blue">
              Raw milk
            </th>
            <th colSpan={5}></th>
            <th colSpan={6} className="text-center daily-summery-bg-green">
              Mix milk
            </th>
            <th colSpan={11}></th>
            <th colSpan={9} className="text-center daily-summery-bg-purple">
              Milk powder
            </th>
          </tr>
          <tr className="text-center">
            <th className="daily-summery-bg-red">Wet</th>
            <th className="daily-summery-bg-red">SD</th>
            <th className="daily-summery-bg-red">Location</th>
            <th className="daily-summery-bg-red">Order name</th>
            <th className="daily-summery-bg-red">Kernel weight</th>
            <th className="daily-summery-bg-red">Wet load time</th>
            <th className="daily-summery-bg-red">Cutter start time</th>
            <th className="daily-summery-bg-red">Milk weight</th>
            <th className="daily-summery-bg-red">Efficiency</th>
            <th className="daily-summery-bg-blue">Raw pH</th>
            <th className="daily-summery-bg-blue">Raw TSS</th>
            <th className="daily-summery-bg-blue">Raw fat</th>
            <th className="daily-summery-bg-blue">Taste</th>
            <th className="daily-summery-bg-blue">Color</th>
            <th className="daily-summery-bg-blue">Odor</th>
            <th className="daily-summery-bg-orange">Bowser in time</th>
            <th className="daily-summery-bg-orange">Batches in bowser</th>
            <th className="daily-summery-bg-orange">Filling hole cleaning</th>
            <th className="daily-summery-bg-orange">Output tap cleaning</th>
            <th className="daily-summery-bg-orange">Overall condition</th>
            <th className="daily-summery-bg-green">Mix pH</th>
            <th className="daily-summery-bg-green">Mix TSS</th>
            <th className="daily-summery-bg-green">Mix fat</th>
            <th className="daily-summery-bg-green">Taste</th>
            <th className="daily-summery-bg-green">Color</th>
            <th className="daily-summery-bg-green">Odor</th>
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
            <th className="daily-summery-bg-purple">Milk powder pH</th>
            <th className="daily-summery-bg-purple">Moisture</th>
            <th className="daily-summery-bg-purple">Fat</th>
            <th className="daily-summery-bg-purple">Fat layer</th>
            <th className="daily-summery-bg-purple">Time</th>
            <th className="daily-summery-bg-purple">Taste</th>
            <th className="daily-summery-bg-purple">Color</th>
            <th className="daily-summery-bg-purple">Odor</th>
            <th className="daily-summery-bg-purple">Solubility</th>
            <th className="daily-summery-bg-purple">Free flowing</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((item, index) => (
            <tr key={index} className="text-center text-capitalize">
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
              <td>{item.sd_4_bowser_in_time}</td>
              <td>{item.sd_4_batches_in_bowser}</td>
              <td>
                {item.sd_4_is_bowser_filling_hole_cleaned ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
              <td>
                {item.sd_4_is_bowser_output_tap_cleaned ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
              <td>{item.sd_4_bowser_overall_condition}</td>
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
              <td>{item.lab_powder_ph}</td>
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
