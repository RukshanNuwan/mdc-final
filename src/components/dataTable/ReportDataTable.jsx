import { useRef } from "react";
import { Table } from "react-bootstrap";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { DownloadTableExcel } from "react-export-table-to-excel";

import "./dataTable.css";
import useCurrentDate from "../../hooks/useCurrentDate";

const ReportDataTable = ({ dataSet }) => {
  const tableRef = useRef(null);

  const currentDate = useCurrentDate();

  return (
    <div
      style={{ height: "100%", width: "100%" }}
      className="mt-2 d-flex flex-column"
    >
      <DownloadTableExcel
        filename={`${currentDate} summery report`}
        sheet={`${currentDate}`}
        currentTableRef={tableRef.current}
      >
        <button className="mb-2 customBtn customBtnPrint">Export excel</button>
      </DownloadTableExcel>

      <Table responsive striped="columns" bordered hover ref={tableRef}>
        <tbody>
          <tr>
            <th className="bg-info">Wet batch #</th>
            {dataSet?.wet_data?.map((item, index) => (
              <td key={index}>{item.batchNumber}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Batch #</th>
            {dataSet?.mixing_data?.map((item, index) => (
              <td key={index}>{item.batchNumber}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Location</th>
            {dataSet?.mixing_data?.map((item, index) => (
              <td key={index}>
                {item.location === "mdc" ? "SD - 03" : "SD - 04"}
              </td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Order name</th>
            {dataSet?.mixing_data?.map((item, index) => (
              <td key={index}>{item.recipeName}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Kernel weight</th>
            {dataSet?.wet_data?.map((item, index) => (
              <td key={index}>{item.kernelWeight}kg</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Wet load time</th>
            {dataSet?.wet_data?.map((item, index) => (
              <td key={index}>{item.blancherInTime}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Cutter start time</th>
            {dataSet?.cutter_data?.map((item, index) => (
              <td key={index}>{item.expellerStartTime}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Expeller finish time</th>
            {dataSet?.cutter_data?.map((item, index) => (
              <td key={index}>{item.expellerFinishTime}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Milk weight</th>
            {dataSet?.mixing_data?.map((item, index) => (
              <td key={index}>{item.milkQuantity}kg</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Efficiency</th>
            {dataSet?.mixing_data?.map((item, index) => (
              <td
                key={index}
                className={`${
                  item.milkRecovery < 75 ? "text-danger" : "text-success"
                }`}
              >
                {item.milkRecovery}%
              </td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Raw pH</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>{item.rawMilkPh}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Raw TSS</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>{item.rawMilkTSS}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Raw fat</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>{item.rawMilkFat}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Taste</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>
                {item.rawMilkTaste ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Color</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>
                {item.rawMilkColor ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Odor</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>
                {item.rawMilkOdor ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Mix pH</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>{item.mixMilkPh}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Mix TSS</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>{item.mixMilkTSS}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Mix fat</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>{item.mixMilkFat}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Taste</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>
                {item.rawMilkTaste ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Color</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>
                {item.rawMilkColor ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Odor</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>
                {item.rawMilkOdor ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Raw milk in time</th>
            {dataSet?.mixing_data?.map((item, index) => (
              <td key={index}>{item.rawMilkInTime}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Mix start time</th>
            {dataSet?.mixing_data?.map((item, index) => (
              <td key={index}>{item.mixingStartTime}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Mix finish time</th>
            {dataSet?.mixing_data?.map((item, index) => (
              <td key={index}>{item.mixingFinishTime}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Feed tank in time</th>
            {dataSet?.mixing_data?.map((item, index) => (
              <td key={index}>{item.feedTankInTime}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Feed start time</th>
            {dataSet?.mixing_data?.map((item, index) => (
              <td key={index}>{item.feedingStartTime}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Powder spray start time</th>
            {dataSet?.sd_data?.map((item, index) => (
              <td key={index}>{item.powderSprayStartTime}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Powder spray finish time</th>
            {dataSet?.sd_data?.map((item, index) => (
              <td key={index}>{item.powderSprayFinishTime}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Powder spray finish time</th>
            {dataSet?.sd_data?.map((item, index) => (
              <td key={index}>{item.powderSprayFinishTime}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Quantity</th>
            {dataSet?.sd_data?.map((item, index) => (
              <td key={index}>
                {item.powderQuantity ? item.powderQuantity : "-"}kg
              </td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">RP</th>
            {dataSet?.sd_data?.map((item, index) => (
              <td key={index}>{item.rp}kg</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Inlet temp</th>
            {dataSet?.sd_data?.map((item, index) => (
              <td key={index}>{item.inletTemp}&deg;C</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Outlet temp</th>
            {dataSet?.sd_data?.map((item, index) => (
              <td key={index}>{item.outletTemp}&deg;C</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Pressure pump</th>
            {dataSet?.mixing_data?.map((item, index) => (
              <td key={index}>{item.pressurePumpValue}MPa</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Moisture</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>{item.milkPowderMoisture}%</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Fat</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>{item.milkPowderFat}</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Fat layer</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>{item.milkPowderFatLayer}cm</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Time</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>{item.milkPowderTime}min</td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Powder taste</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>
                {item.powderTaste ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Powder color</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>
                {item.powderColor ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Powder Odor</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>
                {item.powderOdor ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Solubility</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>
                {item.powderSolubility ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
            ))}
          </tr>
          <tr>
            <th className="bg-info">Free flowing</th>
            {dataSet?.lab_data?.map((item, index) => (
              <td key={index}>
                {item.powderFreeFlowing ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <CloseIcon className="text-danger" />
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default ReportDataTable;
