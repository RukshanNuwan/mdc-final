import { Table } from "react-bootstrap";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import * as XLSX from "xlsx";

import "./dataTable.css";
import { calculateTimeDifferenceForReports } from "../../utils";

const ReportDataTable = ({ data }) => {
  const exportToExcel = () => {
    const table = document.getElementById("tblSummary");
    const workbook = XLSX.utils.table_to_book(table, {
      sheet: `${data[0]?.date}`,
    });
    XLSX.writeFile(workbook, `${data[0]?.date} summary report.xlsx`);
  };

  return (
    <div
      style={{ height: "100%", width: "100%" }}
      className="mt-2 d-flex flex-column"
    >
      <button className="mb-2 customBtn customBtnPrint" onClick={exportToExcel}>
        Export excel
      </button>

      <Table responsive bordered hover size="sm" id="tblSummary">
        <thead>
          <tr>
            <th colSpan={2} className="text-center daily-summery-bg-red">
              Batch number
            </th>
            <th colSpan={7} className="text-center daily-summery-bg-red">
              Wet
            </th>
            <th colSpan={3} className="text-center">
              Cutter
            </th>
            <th colSpan={6} className="text-center daily-summery-bg-blue">
              Raw milk
            </th>
            <th colSpan={7}></th>
            <th colSpan={11} className="text-center daily-summery-bg-green">
              Mix milk
            </th>
            <th colSpan={15} className="text-center">
              Spray dryer
            </th>
            <th colSpan={13} className="text-center daily-summery-bg-purple">
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
            <th>Expeller finish time</th>
            <th>Process time</th>
            <th>Delay time</th>
            <th className="daily-summery-bg-blue">Raw pH</th>
            <th className="daily-summery-bg-blue">Raw TSS</th>
            <th className="daily-summery-bg-blue">Raw fat</th>
            <th className="daily-summery-bg-blue">Taste</th>
            <th className="daily-summery-bg-blue">Color</th>
            <th className="daily-summery-bg-blue">Odor</th>
            <th className="daily-summery-bg-orange">Bowser load time</th>
            <th className="daily-summery-bg-orange">Bowser in time</th>
            <th className="daily-summery-bg-orange">Delay time</th>
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
            <th className="daily-summery-bg-green">Mix issues informed to</th>
            <th className="daily-summery-bg-green">Details</th>
            <th className="daily-summery-bg-green">Sample in time</th>
            <th className="daily-summery-bg-green">Test start time</th>
            <th className="daily-summery-bg-green">Time difference</th>
            <th>Raw milk in time</th>
            <th>Mix start time</th>
            <th>Mix finish time</th>
            <th>Feed tank in time</th>
            <th>Feed start time</th>
            <th>Powder spray start time</th>
            <th>Powder spray finish time</th>
            <th>Process time</th>
            <th>Powder quantity</th>
            <th>RP</th>
            <th>Inlet temp</th>
            <th>Outlet temp</th>
            <th>Pressure pump</th>
            <th>Steam pressure</th>
            <th>Nozzle size</th>
            <th className="daily-summery-bg-purple">Milk powder pH</th>
            <th className="daily-summery-bg-purple">Moisture</th>
            <th className="daily-summery-bg-purple">Fat</th>
            <th className="daily-summery-bg-purple">Fat layer</th>
            <th className="daily-summery-bg-purple">Time</th>
            <th className="daily-summery-bg-purple">Bulk density</th>
            <th className="daily-summery-bg-purple">Taste</th>
            <th className="daily-summery-bg-purple">Color</th>
            <th className="daily-summery-bg-purple">Odor</th>
            <th className="daily-summery-bg-purple">Solubility</th>
            <th className="daily-summery-bg-purple">Free flowing</th>
            <th className="daily-summery-bg-purple">
              Powder issue informed to
            </th>
            <th className="daily-summery-bg-purple">Details</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((item, index) => {
            return (
              <tr key={index} className="text-center text-capitalize">
                <td>{item.primary_batch_number}</td>
                <td>{item.batch_number}</td>
                <td>{item.location === "mdc" ? "SD - 03" : "SD - 04"}</td>
                <td>{item.order_name}</td>
                <td>{item.wet_kernel_weight}Kg</td>
                <td>{item.blancher_in_time}</td>
                <td>{item.cutter_expeller_start_time}</td>
                <td>{item.mixing_milk_quantity}Kg</td>
                <td
                  className={`${
                    item.mixing_milk_recovery < 75
                      ? "text-danger"
                      : "text-success"
                  }`}
                >
                  {item.mixing_milk_recovery}%
                </td>
                <td>{item.expeller_finish_time}</td>
                <td>
                  {item.cutter_expeller_process_time?.hours < 10
                    ? `0${item.cutter_expeller_process_time?.hours}`
                    : item.cutter_expeller_process_time?.hours}
                  :
                  {item.cutter_expeller_process_time?.minutes < 10
                    ? `0${item.cutter_expeller_process_time?.minutes}`
                    : item.cutter_expeller_process_time?.minutes}
                </td>
                <td>{item.cutter_expeller_delay_time}</td>
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
                <td>{item.cutter_bowser_load_time || "-"}</td>
                <td>{item.sd_4_bowser_in_time || "-"}</td>
                {item.location === "araliya_kele" ? (
                  <td>
                    {calculateTimeDifferenceForReports(
                      item?.cutter_bowser_load_time,
                      item?.sd_4_bowser_in_time
                    )}
                  </td>
                ) : (
                  <td>-</td>
                )}
                <td>{item.sd_4_batches_in_bowser || "-"}</td>
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
                <td>{item.sd_4_bowser_overall_condition || "-"}</td>
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
                <td>{item.lab_mix_issue_informed_to || "-"}</td>
                <td>{item.lab_mix_issue_details || "-"}</td>
                <td>{item.lab_sample_in_time}</td>
                <td>{item.lab_test_start_time}</td>
                <td>
                  {calculateTimeDifferenceForReports(
                    item.lab_sample_in_time,
                    item.lab_test_start_time
                  )}
                </td>
                <td>{item.expeller_finish_time}</td>
                <td>{item.mixing_mix_start_time}</td>
                <td>{item.mixing_mix_finish_time}</td>
                <td>{item.mixing_feeding_tank_in_time}</td>
                <td>{item.mixing_feed_start_time}</td>
                <td>{item.sd_powder_spray_start_time}</td>
                <td>{item.sd_batch_finish_time}</td>
                <td>
                  {calculateTimeDifferenceForReports(
                    item.sd_powder_spray_start_time,
                    item.sd_batch_finish_time
                  )}
                </td>
                <td>{item.sd_total_powder_quantity}Kg</td>
                <td>{item.sd_rp_quantity}Kg</td>
                <td>{item.sd_inlet_temp}&deg;C</td>
                <td>{item.sd_outlet_temp}&deg;C</td>
                <td>{item.mixing_pressure_pump_value}MPa</td>
                <td>{item.mixing_steam_pressure_value}MPa</td>
                <td>{item.sd_atomizer_size}</td>
                <td>{item.lab_powder_ph || "-"}</td>
                <td>{item.lab_powder_moisture}%</td>
                <td>{item.lab_powder_fat}</td>
                <td>{item.lab_powder_fat_layer}cm</td>
                <td>{item.lab_powder_fat_layer_time}min</td>
                <td>{item.lab_powder_bulk_density}</td>
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
                <td>{item.lab_powder_issue_informed_to || "-"}</td>
                <td>{item.lab_powder_issue_details || "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default ReportDataTable;
