import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ListGroup } from "react-bootstrap";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import "./dashboard.css";
import { db } from "../../config/firebase.config";
import TotalCard from "../card/TotalCard";

const Dashboard = () => {
  const [dailyProductionData, setDailyProductionData] = useState({});
  const [productionDataByDate, setProductionDataByDate] = useState([]);
  const [sd3Data, setSd3Data] = useState({});
  const [sd4Data, setSd4Data] = useState({});
  const [sd3LabData, setSd3LabData] = useState({});
  const [sd4LabData, setSd4LabData] = useState({});
  const [sd3Status, setSd3Status] = useState(false);
  const [sd4Status, setSd4Status] = useState(false);
  const [breakdowns, setBreakdowns] = useState([]);
  const [date, setDate] = useState();
  const [isCutterBreakdown, setIsCutterBreakdown] = useState(false);
  const [isSd3Breakdown, setIsSd3Breakdown] = useState(false);
  const [isSd4Breakdown, setIsSd4Breakdown] = useState(false);
  const [totalBatchesInSd3, setTotalBatchesInSd3] = useState(0);
  const [totalBatchesInSd4, setTotalBatchesInSd4] = useState(0);
  const [totalMilkAmountInSd3, setTotalMilkAmountInSd3] = useState(0);
  const [totalMilkAmountInSd4, setTotalMilkAmountInSd4] = useState(0);
  const [totalPowderQuantityInSd3, setTotalPowderQuantityInSd3] = useState(0);
  const [totalPowderQuantityInSd4, setTotalPowderQuantityInSd4] = useState(0);

  let totalBatchesInMdc = 0;
  let totalBatchesInAraliyaKele = 0;

  const calculateRemainingBatches = (totalBatches) => {
    if (totalBatchesInSd3 || totalBatchesInSd4) {
      const currentTotalBatchCount = totalBatchesInSd3 + totalBatchesInSd4;
      const res = totalBatches - currentTotalBatchCount;
      return res.toString();
    } else {
      return "-";
    }
  };

  useEffect(() => {
    const fetchDate = async () => {
      try {
        const q = query(
          collection(db, "daily_production"),
          orderBy("timeStamp", "desc"),
          limit(1)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setDate(doc.data().date);
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchDate();
  }, []);

  useEffect(() => {
    const fetchProductionDataByDate = async () => {
      if (date) {
        try {
          const q = query(
            collection(db, "production_data"),
            where("date", "==", date),
            orderBy("wet_added_at", "desc")
          );
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let list = [];
            querySnapshot.forEach((doc) => {
              list.push({ id: doc.id, ...doc.data() });
            });

            setProductionDataByDate(list);
          });

          return () => {
            unsubscribe();
          };
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchProductionDataByDate();
  }, [date]);

  useEffect(() => {
    const fetchId = async () => {
      if (date) {
        try {
          const q = query(
            collection(db, "daily_production"),
            where("date", "==", date),
            orderBy("timeStamp", "desc")
          );
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let list = [];
            querySnapshot.forEach((doc) => {
              list.push({ id: doc.id, ...doc.data() });
            });

            setDailyProductionData(list[0]);
          });

          return () => {
            unsubscribe();
          };
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchId();
  }, [date]);

  useEffect(() => {
    const fetchCurrentSdData = async () => {
      if (date) {
        try {
          const q = query(
            collection(db, "production_data"),
            where("sd_status", "==", "updated"),
            where("location", "==", "mdc"),
            where("date", "==", date),
            orderBy("wet_added_at", "desc"),
            limit(1)
          );
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const list = [];
            querySnapshot.forEach((doc) => {
              list.push(doc.data());
            });

            setSd3Data(list[0]);
          });

          return () => {
            unsubscribe();
          };
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchCurrentSdData();
  }, [date]);

  useEffect(() => {
    const fetchCurrentSdData = async () => {
      if (date) {
        try {
          const q = query(
            collection(db, "production_data"),
            where("sd_status", "==", "updated"),
            where("location", "==", "araliya_kele"),
            where("date", "==", date),
            orderBy("wet_added_at", "desc"),
            limit(1)
          );
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const list = [];
            querySnapshot.forEach((doc) => {
              list.push(doc.data());
            });

            setSd4Data(list[0]);
          });

          return () => {
            unsubscribe();
          };
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchCurrentSdData();
  }, [date]);

  useEffect(() => {
    const fetchSd3LabData = async () => {
      if (date) {
        try {
          const q = query(
            collection(db, "production_data"),
            where("lab_status", "==", "completed"),
            where("date", "==", date),
            where("location", "==", "mdc"),
            orderBy("wet_added_at", "desc"),
            limit(1)
          );
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const list = [];
            querySnapshot.forEach((doc) => {
              list.push(doc.data());
            });
            setSd3LabData(list[0]);
          });

          return () => {
            unsubscribe();
          };
        } catch (error) {
          console.log(error);
        }
      }
    };

    const fetchSd4LabData = async () => {
      if (date) {
        try {
          const q = query(
            collection(db, "production_data"),
            where("lab_status", "==", "completed"),
            where("date", "==", date),
            where("location", "==", "araliya_kele"),
            orderBy("wet_added_at", "desc"),
            limit(1)
          );
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const list = [];
            querySnapshot.forEach((doc) => {
              list.push(doc.data());
            });
            setSd4LabData(list[0]);
          });

          return () => {
            unsubscribe();
          };
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchSd3LabData();
    fetchSd4LabData();
  }, [date]);

  useEffect(() => {
    const fetchBreakdowns = async () => {
      try {
        const q = query(
          collection(db, "breakdowns"),
          where("breakdown_date", "==", date),
          orderBy("timeStamp", "desc")
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const list = [];
          querySnapshot.forEach((doc) => {
            list.push(doc.data());
          });
          setBreakdowns(list);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.log(error);
      }
    };

    fetchBreakdowns();
  }, [date]);

  useEffect(() => {
    if (breakdowns.length > 0) {
      breakdowns.forEach((breakdown) => {
        if (breakdown.breakdown_section_name === "cutter") {
          setIsCutterBreakdown(true);
        } else {
          setIsCutterBreakdown(false);
        }

        if (
          breakdown.breakdown_section_name === "sd" &&
          breakdown.location === "mdc"
        ) {
          setIsSd3Breakdown(true);
        } else {
          setIsSd3Breakdown(false);
        }

        if (
          breakdown.breakdown_section_name === "sd" &&
          breakdown.location === "araliya_kele"
        ) {
          setIsSd4Breakdown(true);
        } else {
          setIsSd4Breakdown(false);
        }
      });
    }
  }, [breakdowns]);

  console.log("breakdowns ->", breakdowns);

  useEffect(() => {
    const handleStatus = () => {
      if (sd3Data?.sd_status && sd3Data?.sd_status !== "completed")
        setSd3Status(true);
      else setSd3Status(false);

      if (sd4Data?.sd_status && sd4Data?.sd_status !== "completed")
        setSd4Status(true);
      else setSd4Status(false);
    };

    handleStatus();
  }, [sd3Data?.sd_status, sd4Data?.sd_status, sd3Data]);

  useEffect(() => {
    let totalMilkAmountInMdc = 0;
    let totalMilkAmountInAraliyaKele = 0;
    let totalPowderQuantityInMdc = 0;
    let totalPowderQuantityInAraliyaKele = 0;

    if (productionDataByDate.length > 0) {
      productionDataByDate.forEach((data) => {
        if (data.location === "mdc") {
          totalBatchesInMdc++;
          totalMilkAmountInMdc += Number(data.mixing_milk_quantity);
          totalPowderQuantityInMdc += Number(data.sd_total_powder_quantity);
        } else {
          totalBatchesInAraliyaKele++;
          totalMilkAmountInAraliyaKele += Number(data.mixing_milk_quantity);
          totalPowderQuantityInAraliyaKele += Number(
            data.sd_total_powder_quantity
          );
        }
      });
    }

    setTotalBatchesInSd3(totalBatchesInMdc);
    setTotalBatchesInSd4(totalBatchesInAraliyaKele);
    setTotalMilkAmountInSd3(totalMilkAmountInMdc);
    setTotalMilkAmountInSd4(totalMilkAmountInAraliyaKele);
    setTotalPowderQuantityInSd3(totalPowderQuantityInMdc);
    setTotalPowderQuantityInSd4(totalPowderQuantityInAraliyaKele);
  }, [productionDataByDate, totalBatchesInMdc, totalBatchesInAraliyaKele]);

  const renderCurrentBatchNumberInSd = (location) => {
    let currentBatchNumber = 0;

    productionDataByDate.forEach((data) => {
      if (data.location === location) {
        if (data.sd_status && data.sd_status !== "ongoing") {
          currentBatchNumber++;
        }
      }
    });

    return currentBatchNumber;
  };

  return (
    <section>
      <div className="dashboardContainer">
        <div className="row">
          <div className="col-md-4">
            <TotalCard
              value_1={totalMilkAmountInSd3}
              value_2={totalMilkAmountInSd4}
              text="milk amount"
            />
          </div>

          <div className="col-md-4">
            <TotalCard
              value_1={totalPowderQuantityInSd3}
              value_2={totalPowderQuantityInSd4}
              text="powder quantity"
            />
          </div>

          <div className="col-md-4">
            <div className="sectionContainer">
              <span className="sectionTitle sectionTitleYellow text-uppercase">
                Wet section
              </span>

              <p className="sectionHeading text-white">Total coconut</p>

              <p className="sectionMainValue text-center">
                {dailyProductionData?.totalCoconut || "-"}
              </p>

              <div className="col-12">
                <div className="sectionSubHeadingContainer d-flex justify-content-between mt-2">
                  <p className="sectionSubHeading">In-house kernel</p>
                  <p className="sectionSubValue fw-bold">
                    {dailyProductionData?.totalKernelWeight || "-"}
                    Kg
                  </p>
                </div>

                <div className="sectionSubHeadingContainer d-flex justify-content-between">
                  <p className="sectionSubHeading">Outside kernel</p>
                  <p className="sectionSubValue fw-bold">
                    {dailyProductionData?.outsideKernelQuantity || "-"}
                    Kg
                  </p>
                </div>

                <div className="sectionSubHeadingContainer d-flex justify-content-between">
                  <p className="sectionSubHeading">Total batch count</p>
                  <p className="sectionSubValue fw-bold">
                    {dailyProductionData?.totalKernelWeight &&
                    dailyProductionData?.outsideKernelQuantity &&
                    dailyProductionData?.desiccatedCoconutQuantity
                      ? Math.round(
                          (dailyProductionData?.totalKernelWeight +
                            Number(
                              dailyProductionData?.outsideKernelQuantity
                            )) /
                            300 -
                            Number(
                              dailyProductionData?.desiccatedCoconutQuantity
                            )
                        )
                      : dailyProductionData?.totalKernelWeight
                      ? Math.round(dailyProductionData?.totalKernelWeight / 300)
                      : "-"}
                  </p>
                </div>

                <div className="sectionSubHeadingContainer d-flex justify-content-between">
                  <p className="sectionSubHeading">Remaining batches</p>
                  <p className="sectionSubValue fw-bold">
                    {calculateRemainingBatches(
                      dailyProductionData?.totalKernelWeight &&
                        Math.round(dailyProductionData?.totalKernelWeight / 300)
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-xs-2">
          <div className="col-md-4">
            <div className="sectionContainer">
              <div className="d-flex justify-content-between">
                <span className="sectionTitle sectionTitleYellow text-uppercase">
                  Spray Dryer - 03
                </span>

                <span
                  className={`status ${sd3Status && "running"} ${
                    isSd3Breakdown && "stopped"
                  }`}
                >
                  <p
                    className={`${
                      sd3Status && !isSd3Breakdown ? "d-block" : "d-none"
                    }`}
                  >
                    Running
                  </p>
                  <p className={`${isSd3Breakdown ? "d-block" : "d-none"}`}>
                    Stopped
                  </p>
                </span>
              </div>

              <p className="sectionHeading text-white">Batch number</p>

              <p className="sectionMainValue text-center">
                {renderCurrentBatchNumberInSd("mdc")}
              </p>

              <div className="col-12 sectionDetailsContainer">
                <div className="sectionSubHeadingContainer d-flex justify-content-between mt-2">
                  <p className="sectionSubHeading">Last batch free flowing</p>

                  <p className="sectionSubValue text-capitalize fw-bold">
                    {sd3LabData?.lab_powder_free_flowing ? (
                      <CheckIcon className="textSuccessGreen" />
                    ) : sd3LabData?.lab_powder_free_flowing === false ? (
                      <CloseIcon className="text-danger" />
                    ) : (
                      <p>-</p>
                    )}
                  </p>
                </div>

                <div className="sectionSubHeadingContainer d-flex justify-content-between">
                  <p className="sectionSubHeading">Last batch solubility</p>

                  <p className="sectionSubValue text-capitalize fw-bold">
                    {sd3LabData?.lab_powder_solubility ? (
                      <CheckIcon className="textSuccessGreen" />
                    ) : sd3LabData?.lab_powder_solubility === false ? (
                      <CloseIcon className="text-danger" />
                    ) : (
                      <p>-</p>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mt-xs-2">
            <div className="sectionContainer">
              <span className="sectionTitle sectionTitleYellow text-uppercase">
                Lab - SD 03
              </span>

              <div className="smallText my-2 text-white">
                Showing last batch data
              </div>

              <div className="row mt-3">
                <div className="col-6 border-end">
                  <span className="subSectionHeading">Raw milk</span>

                  <div className="col-12 mt-2">
                    <div className="col d-flex align-items-center justify-content-between">
                      <p className="text-white">pH</p>

                      <p className="subSectionValue">
                        {sd3LabData?.lab_raw_ph || "-"}
                      </p>
                    </div>

                    <div className="col d-flex align-items-center justify-content-between">
                      <p className="text-white">TSS</p>

                      <p className="subSectionValue">
                        {sd3LabData?.lab_raw_tss || "-"}
                      </p>
                    </div>

                    <div className="col d-flex align-items-center justify-content-between">
                      <p className="text-white">Fat</p>

                      <p className="subSectionValue">
                        {sd3LabData?.lab_raw_fat || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <span className="subSectionHeading">Mix milk</span>
                  <div className="col-12 mt-2">
                    <div className="col d-flex align-items-center justify-content-between">
                      <p className="text-white">pH</p>

                      <p className="subSectionValue">
                        {sd3LabData?.lab_mix_ph || "-"}
                      </p>
                    </div>

                    <div className="col d-flex align-items-center justify-content-between">
                      <p className="text-white">TSS</p>

                      <p className="subSectionValue">
                        {sd3LabData?.lab_mix_tss || "-"}
                      </p>
                    </div>

                    <div className="col d-flex align-items-center justify-content-between">
                      <p className="text-white">Fat</p>

                      <p className="subSectionValue">
                        {sd3LabData?.lab_mix_fat || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mt-xs-2">
            <div className="sectionContainer">
              <div className="d-flex justify-content-between">
                <span className="sectionTitle sectionTitleYellow text-uppercase">
                  Cutter section
                </span>

                <span className={`status ${isCutterBreakdown && "stopped"}`}>
                  <p className={`${isCutterBreakdown ? "d-block" : "d-none"}`}>
                    Stopped
                  </p>
                </span>
              </div>

              <p className="sectionHeading text-white">Total batch count</p>

              <p className="sectionMainValue text-center">
                {totalBatchesInSd3 + totalBatchesInSd4 || 0}
              </p>

              <div className="col-12 mt-4 sectionDetailsContainer">
                <div className="sectionSubHeadingContainer d-flex justify-content-between mt-2">
                  <p className="sectionSubHeading">SD 03 batch count</p>
                  <p className="sectionSubValue text-capitalize fw-bold">
                    {totalBatchesInSd3 || 0}
                  </p>
                </div>

                <div className="sectionSubHeadingContainer d-flex justify-content-between">
                  <p className="sectionSubHeading">SD 04 batch count</p>
                  <p className="sectionSubValue fw-bold">
                    {totalBatchesInSd4 || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row my-2">
          <div className="col-md-4">
            <div className="sectionContainer">
              <div className="d-flex justify-content-between">
                <span className="sectionTitle sectionTitleYellow text-uppercase">
                  Spray Dryer - 04
                </span>

                <span
                  className={`status ${sd4Status && "running"} ${
                    isSd4Breakdown && "stopped"
                  }`}
                >
                  <p
                    className={`${
                      sd4Status && !isSd4Breakdown ? "d-block" : "d-none"
                    }`}
                  >
                    Running
                  </p>
                  <p className={`${isSd4Breakdown ? "d-block" : "d-none"}`}>
                    Stopped
                  </p>
                </span>
              </div>

              <p className="sectionHeading text-white">Batch number</p>

              <p className="sectionMainValue text-center">
                {renderCurrentBatchNumberInSd("araliya_kele")}
              </p>

              <div className="col-12 sectionDetailsContainer">
                <div className="sectionSubHeadingContainer d-flex justify-content-between mt-2">
                  <p className="sectionSubHeading">Last batch free flowing</p>

                  <p className="sectionSubValue text-capitalize fw-bold">
                    {sd4LabData?.lab_powder_free_flowing ? (
                      <CheckIcon className="textSuccessGreen" />
                    ) : sd4LabData?.lab_powder_free_flowing === false ? (
                      <CloseIcon className="text-danger" />
                    ) : (
                      <p>-</p>
                    )}
                  </p>
                </div>

                <div className="sectionSubHeadingContainer d-flex justify-content-between">
                  <p className="sectionSubHeading">Last batch solubility</p>

                  <p className="sectionSubValue text-capitalize fw-bold">
                    {sd4LabData?.lab_powder_solubility ? (
                      <CheckIcon className="textSuccessGreen" />
                    ) : sd4LabData?.lab_powder_solubility === false ? (
                      <CloseIcon className="text-danger" />
                    ) : (
                      <p>-</p>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mt-xs-2">
            <div className="sectionContainer">
              <span className="sectionTitle sectionTitleYellow text-uppercase">
                Lab - SD 04
              </span>

              <div className="smallText my-2 text-white">
                Showing last batch data
              </div>

              <div className="row mt-3">
                <div className="col-6 border-end">
                  <span className="subSectionHeading">Raw milk</span>
                  <div className="col-12 mt-2">
                    <div className="col d-flex align-items-center justify-content-between">
                      <p className="text-white">pH</p>

                      <p className="subSectionValue">
                        {sd4LabData?.lab_raw_ph || "-"}
                      </p>
                    </div>

                    <div className="col d-flex align-items-center justify-content-between">
                      <p className="text-white">TSS</p>

                      <p className="subSectionValue">
                        {sd4LabData?.lab_raw_tss || "-"}
                      </p>
                    </div>

                    <div className="col d-flex align-items-center justify-content-between">
                      <p className="text-white">Fat</p>

                      <p className="subSectionValue">
                        {sd4LabData?.lab_raw_fat || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <span className="subSectionHeading">Mix milk</span>
                  <div className="col-12 mt-2">
                    <div className="col d-flex align-items-center justify-content-between">
                      <p className="text-white">pH</p>

                      <p className="subSectionValue">
                        {sd4LabData?.lab_mix_ph || "-"}
                      </p>
                    </div>

                    <div className="col d-flex align-items-center justify-content-between">
                      <p className="text-white">TSS</p>

                      <p className="subSectionValue">
                        {sd4LabData?.lab_mix_tss || "-"}
                      </p>
                    </div>

                    <div className="col d-flex align-items-center justify-content-between">
                      <p className="text-white">Fat</p>

                      <p className="subSectionValue">
                        {sd4LabData?.lab_mix_fat || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mt-xs-2">
            <div className="sectionContainer overflow-auto">
              <span className="sectionTitle sectionTitlePink text-uppercase">
                Breakdowns
              </span>

              {breakdowns && breakdowns.length > 0 ? (
                <ListGroup variant="flush" className="mt-2">
                  {breakdowns?.map((breakdown, index) => (
                    <ListGroup.Item
                      key={index}
                      className="breakdownItemWrapper"
                    >
                      <div className="d-flex justify-content-between">
                        <p className="fw-bold textLightBlue text-capitalize">
                          {breakdown.breakdown_section_name}{" "}
                          {breakdown.location &&
                            ` | ${
                              breakdown.location === "mdc" ? "SD 03" : "SD 04"
                            }`}
                        </p>
                        <p
                          className={`sectionSubHeadingContainer
                              ${
                                breakdown.status === "ongoing"
                                  ? "stopped"
                                  : "running"
                              }
                            `}
                        >
                          {breakdown.status}
                        </p>
                      </div>
                      <p className="smallText text-white">
                        {breakdown.breakdownDetails}
                      </p>
                      <div className="d-flex justify-content-between sectionSubHeadingContainer">
                        <p className="text-secondary">
                          Informed to :{" "}
                          <span className="fw-bold text-capitalize tooltipText">
                            {breakdown.informedTo}
                          </span>
                        </p>

                        <div>
                          <p className="text-secondary text-sm">
                            Start time :
                            <span className="fw-bold text-capitalize textSuccessGreen">
                              {breakdown.startTime}
                            </span>
                          </p>

                          {breakdown.finishTime && (
                            <p className="text-secondary text-sm">
                              End time :
                              <span className="fw-bold text-capitalize textSuccessGreen">
                                {breakdown.finishTime}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-white text-center mt-5">No breakdowns</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
