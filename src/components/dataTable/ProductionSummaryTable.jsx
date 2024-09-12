import { useEffect, useRef, useState } from "react";
import { Table } from "react-bootstrap";
import * as XLSX from "xlsx";

const ProductionSummaryTable = ({
  productionData,
  dailyProductionData,
  startDate,
  endDate,
}) => {
  const [dailyProductionDataArray, setDailyProductionDataArray] = useState([]);
  const [productionDataArray, setProductionDataArray] = useState([]);
  const [mergedDataArray, setMergedDataArray] = useState([]);

  const [sd03PowderQuantity, setSd03PowderQuantity] = useState(0);
  const [sd03PowderRecovery, setSd03PowderRecovery] = useState(0);
  const [sd04PowderQuantity, setSd04PowderQuantity] = useState(0);
  const [sd04PowderRecovery, setSd04PowderRecovery] = useState(0);

  const tableRef = useRef(null);

  useEffect(() => {
    const dailyProductionArray = dailyProductionData.map((item) => {
      return {
        date: item.date,
        cut_nuts: item.totalCoconut,
        kernel_weight: item.totalKernelWeight,
        outside_kernel: item.outsideKernelQuantity,
      };
    });

    const productionDataArray = productionData.map((item) => {
      return {
        date: item.date,
        expeller_recovery: item.mixing_milk_recovery,
        sd03_powder_quantity:
          item.location === "mdc" && item.sd_total_powder_quantity,
        sd03_powder_recovery:
          item.location === "mdc" && item.sd_powder_recovery,
        sd04_powder_quantity:
          item.location === "araliya_kele" && item.sd_total_powder_quantity,
        sd04_powder_recovery:
          item.location === "araliya_kele" && item.sd_powder_recovery,
      };
    });

    // TODO:
    // loop production data -> set expeller recovery
    // loop production data -> set sd03_powder_quantity
    // loop production data -> set sd03_powder_recovery
    // loop production data -> set sd04_powder_quantity
    // loop production data -> set sd04_powder_recovery

    // console.log("productionDataArray -> ", productionDataArray);

    // productionDataArray.map((data, index) => {
    //   console.log("data -> ", data);

    //   return {
    //     // if() { }
    //   };
    // });

    setDailyProductionDataArray(dailyProductionArray);
    setProductionDataArray(productionDataArray);

    // if (dailyProductionArray.length > 0 && productionDataArray.length > 0) {
    //   const mergedArray = dailyProductionDataArray.reduce(
    //     (acc, primaryItem) => {
    //       const matchingItem = productionDataArray.find(
    //         (secondaryItem) => secondaryItem.date === primaryItem.date
    //       );

    //       if (matchingItem) {
    //         acc.push({ ...primaryItem, ...matchingItem });
    //       } else {
    //         acc.push(primaryItem);
    //       }

    //       return acc;
    //     },
    //     []
    //   );

    //   productionDataArray.forEach((secondaryItem) => {
    //     const existsInDailyProductionDataArray = dailyProductionDataArray.some(
    //       (primaryItem) => primaryItem.date === secondaryItem.date
    //     );

    //     if (!existsInDailyProductionDataArray) mergedArray.push(secondaryItem);
    //   });

    //   setMergedDataArray(mergedArray);
    // }
  }, [dailyProductionData, productionData]);

  // console.log("dailySummaryDataArray -> ", dailyProductionDataArray);

  const exportReport = () => {
    const table = tableRef.current;
    const workbook = XLSX.utils.table_to_book(table, {
      sheet: `${startDate} - ${endDate}`,
    });
    XLSX.writeFile(
      workbook,
      `${startDate} - ${endDate} production summary.xlsx`
    );
  };

  return (
    <div
      style={{ height: "100%", width: "100%" }}
      className="mt-2 d-flex flex-column"
    >
      <button className="mb-2 customBtn customBtnPrint" onClick={exportReport}>
        Export
      </button>

      <Table responsive bordered hover size="sm" ref={tableRef}>
        <thead>
          <tr className="text-center">
            <th>Date</th>
            <th>Cut nuts</th>
            <th>Kernel weight</th>
            <th>Outside kernel</th>
            <th>Kernel recovery</th>
            <th>Expeller recovery</th>
            <th>SD 03 powder quantity</th>
            <th>SD 03 recovery</th>
            <th>SD 04 powder quantity</th>
            <th>SD 04 recovery</th>
          </tr>
        </thead>

        <tbody>{}</tbody>
      </Table>
    </div>
  );
};

export default ProductionSummaryTable;
