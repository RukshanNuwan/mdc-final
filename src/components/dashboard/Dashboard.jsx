import { useEffect, useState } from "react";
import {
  collection,
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
import useCurrentDate from "../../hooks/useCurrentDate";

const Dashboard = () => {
  const [dailyProductionData, setDailyProductionData] = useState({});
  const [sdData, setSdData] = useState([]);
  const [mdcLabData, setMDCLabData] = useState({});
  const [araliyaKeleLabData, setAraliyaKeleLabData] = useState({});
  const [mdcStatus, setMdcStatus] = useState(false);
  const [araliyaKeleStatus, setAraliyaKeleStatus] = useState(false);
  const [breakdowns, setBreakdowns] = useState([]);
  const [isMDCBreakdown, setIsMDCBreaksown] = useState(false);
  const [isAraliyaKeleBreakdown, setIsAraliyaKeleBreaksown] = useState(false);

  const currentDate = useCurrentDate();

  // TODO: handle breakdowns

  const calculateRemainingBatches = (totalBatches) => {
    if (
      dailyProductionData?.totalBatchCountInMdc ||
      dailyProductionData?.totalBatchCountInAraliyaKele
    ) {
      const currentTotalBatchCount =
        dailyProductionData?.totalBatchCountInMdc +
        dailyProductionData?.totalBatchCountInAraliyaKele;
      const res = totalBatches - currentTotalBatchCount;
      return res.toString();
    } else {
      return "-";
    }
  };

  useEffect(() => {
    const fetchId = async () => {
      try {
        const q = query(
          collection(db, "daily_production"),
          // where("date", "==", currentDate)
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
    };

    fetchId();
  }, [currentDate]);

  useEffect(() => {
    const handleStatus = () => {
      // eslint-disable-next-line array-callback-return
      sdData.map((item) => {
        if (item?.location === "mdc") {
          setMdcStatus(true);
        } else if (item?.location === "araliya_kele") {
          setAraliyaKeleStatus(true);
        }
      });
    };

    handleStatus();
  }, [sdData]);

  useEffect(() => {
    const fetchCurrentSdData = async () => {
      try {
        const q = query(
          collection(db, "sd_section"),
          where("status", "==", "updated"),
          orderBy("timeStamp", "desc"),
          limit(1)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const list = [];
          querySnapshot.forEach((doc) => {
            list.push(doc.data());
          });
          setSdData(list);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurrentSdData();
  }, []);

  useEffect(() => {
    const fetchMDCLabData = async () => {
      try {
        const q = query(
          collection(db, "lab_section"),
          where("status", "==", "completed"),
          where("date", "==", dailyProductionData.date),
          where("location", "==", "mdc"),
          orderBy("timeStamp", "desc"),
          limit(1)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const list = [];
          querySnapshot.forEach((doc) => {
            list.push(doc.data());
          });
          setMDCLabData(list[0]);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAraliyaKeleLabData = async () => {
      try {
        const q = query(
          collection(db, "lab_section"),
          where("status", "==", "completed"),
          where("date", "==", dailyProductionData.date),
          where("location", "==", "araliya_kele"),
          orderBy("timeStamp", "desc"),
          limit(1)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const list = [];
          querySnapshot.forEach((doc) => {
            list.push(doc.data());
          });
          setAraliyaKeleLabData(list[0]);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.log(error);
      }
    };

    fetchMDCLabData();
    fetchAraliyaKeleLabData();
  }, [dailyProductionData?.date]);

  useEffect(() => {
    const fetchBreakdowns = async () => {
      try {
        const q = query(
          collection(db, "breakdowns"),
          where("date", "==", currentDate),
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
  }, [currentDate]);

  return (
    <section>
      <div className="dashboardContainer">
        <div className="row">
          <div className="col-md-4">
            <TotalCard
              value_1={dailyProductionData?.totalMilkAmountInMdc}
              value_2={dailyProductionData?.totalMilkAmountInAraliyaKele}
              text="milk amount"
            />
          </div>

          <div className="col-md-4">
            <TotalCard
              value_1={dailyProductionData?.totalPowderQuantityInMdc}
              value_2={dailyProductionData?.totalPowderQuantityInAraliyaKele}
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
                {dailyProductionData?.totalCoconut
                  ? dailyProductionData?.totalCoconut
                  : "-"}
              </p>

              <div className="col-12">
                <div className="sectionSubHeadingContainer d-flex justify-content-between mt-2">
                  <p className="sectionSubHeading">Kernel weight</p>
                  <p className="sectionSubValue fw-bold">
                    {dailyProductionData?.totalKernelWeight
                      ? dailyProductionData?.totalKernelWeight
                      : "-"}
                    kg
                  </p>
                </div>

                <div className="sectionSubHeadingContainer d-flex justify-content-between">
                  <p className="sectionSubHeading">Total batch count</p>
                  <p className="sectionSubValue fw-bold">
                    {dailyProductionData?.totalKernelWeight
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
                  className={`status ${mdcStatus && "running"} ${
                    isMDCBreakdown && "stopped"
                  }`}
                >
                  <p
                    className={`${
                      mdcStatus && !isMDCBreakdown ? "d-block" : "d-none"
                    }`}
                  >
                    Running
                  </p>
                  <p className={`${isMDCBreakdown ? "d-block" : "d-none"}`}>
                    Stopped
                  </p>
                </span>
              </div>

              <p className="sectionHeading text-white">Running batch</p>

              <p className="sectionMainValue text-center">
                {sdData &&
                  sdData.map(
                    (data) => data.location === "mdc" && data.batchNumber
                  )}
              </p>

              <div className="col-12 sectionDetailsContainer">
                <div className="sectionSubHeadingContainer d-flex justify-content-between mt-2">
                  <p className="sectionSubHeading">Last batch free flowing</p>

                  <p className="sectionSubValue text-capitalize fw-bold">
                    {mdcLabData?.powderFreeFlowing ? (
                      <CheckIcon className="textSuccessGreen" />
                    ) : mdcLabData?.powderFreeFlowing === false ? (
                      <CloseIcon className="text-danger" />
                    ) : (
                      <p>-</p>
                    )}
                  </p>
                </div>

                <div className="sectionSubHeadingContainer d-flex justify-content-between">
                  <p className="sectionSubHeading">Last batch solubility</p>

                  <p className="sectionSubValue text-capitalize fw-bold">
                    {mdcLabData?.powderSolubility ? (
                      <CheckIcon className="textSuccessGreen" />
                    ) : mdcLabData?.powderSolubility === false ? (
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
                        {mdcLabData?.rawMilkPh ? mdcLabData?.rawMilkPh : "-"}
                      </p>
                    </div>

                    <div className="col d-flex align-items-center justify-content-between">
                      <p className="text-white">TSS</p>

                      <p className="subSectionValue">
                        {mdcLabData?.rawMilkTSS ? mdcLabData?.rawMilkTSS : "-"}
                      </p>
                    </div>

                    <div className="col d-flex align-items-center justify-content-between">
                      <p className="text-white">Fat</p>

                      <p className="subSectionValue">
                        {mdcLabData?.rawMilkFat ? mdcLabData?.rawMilkFat : "-"}
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
                        {mdcLabData?.mixMilkPh ? mdcLabData?.mixMilkPh : "-"}
                      </p>
                    </div>

                    <div className="col d-flex align-items-center justify-content-between">
                      <p className="text-white">TSS</p>

                      <p className="subSectionValue">
                        {mdcLabData?.mixMilkTSS ? mdcLabData?.mixMilkTSS : "-"}
                      </p>
                    </div>

                    <div className="col d-flex align-items-center justify-content-between">
                      <p className="text-white">Fat</p>

                      <p className="subSectionValue">
                        {mdcLabData?.mixMilkFat ? mdcLabData?.mixMilkFat : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mt-xs-2">
            <div className="sectionContainer">
              <span className="sectionTitle sectionTitleYellow text-uppercase">
                Cutter section
              </span>

              <p className="sectionHeading text-white">Total batch count</p>

              <p className="sectionMainValue text-center">
                {dailyProductionData?.totalBatchCountInMdc ||
                dailyProductionData?.totalBatchCountInAraliyaKele
                  ? dailyProductionData?.totalBatchCountInMdc +
                    dailyProductionData?.totalBatchCountInAraliyaKele
                  : 0}
              </p>

              <div className="col-12 mt-4 sectionDetailsContainer">
                <div className="sectionSubHeadingContainer d-flex justify-content-between mt-2">
                  <p className="sectionSubHeading">SD 03 batch count</p>
                  <p className="sectionSubValue text-capitalize fw-bold">
                    {dailyProductionData?.totalBatchCountInMdc
                      ? dailyProductionData?.totalBatchCountInMdc
                      : 0}
                  </p>
                </div>

                <div className="sectionSubHeadingContainer d-flex justify-content-between">
                  <p className="sectionSubHeading">SD 04 batch count</p>
                  <p className="sectionSubValue fw-bold">
                    {dailyProductionData?.totalBatchCountInAraliyaKele
                      ? dailyProductionData?.totalBatchCountInAraliyaKele
                      : 0}
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
                  className={`status ${araliyaKeleStatus && "running"} ${
                    isAraliyaKeleBreakdown && "stopped"
                  }`}
                >
                  <p
                    className={`${
                      araliyaKeleStatus && !isAraliyaKeleBreakdown
                        ? "d-block"
                        : "d-none"
                    }`}
                  >
                    Running
                  </p>
                  <p
                    className={`${
                      isAraliyaKeleBreakdown ? "d-block" : "d-none"
                    }`}
                  >
                    Stopped
                  </p>
                </span>
              </div>

              <p className="sectionHeading text-white">Running batch</p>

              <p className="sectionMainValue text-center">
                {sdData &&
                  sdData.map(
                    (data) =>
                      data.location === "araliya_kele" && data.batchNumber
                  )}
              </p>

              <div className="col-12 sectionDetailsContainer">
                <div className="sectionSubHeadingContainer d-flex justify-content-between mt-2">
                  <p className="sectionSubHeading">Last batch free flowing</p>

                  <p className="sectionSubValue text-capitalize fw-bold">
                    {araliyaKeleLabData?.powderFreeFlowing ? (
                      <CheckIcon className="textSuccessGreen" />
                    ) : araliyaKeleLabData?.powderFreeFlowing === false ? (
                      <CloseIcon className="text-danger" />
                    ) : (
                      <p>-</p>
                    )}
                  </p>
                </div>

                <div className="sectionSubHeadingContainer d-flex justify-content-between">
                  <p className="sectionSubHeading">Last batch solubility</p>

                  <p className="sectionSubValue text-capitalize fw-bold">
                    {araliyaKeleLabData?.powderSolubility ? (
                      <CheckIcon className="textSuccessGreen" />
                    ) : araliyaKeleLabData?.powderSolubility === false ? (
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
                        {araliyaKeleLabData?.rawMilkPh
                          ? araliyaKeleLabData?.rawMilkPh
                          : "-"}
                      </p>
                    </div>

                    <div className="col d-flex align-items-center justify-content-between">
                      <p className="text-white">TSS</p>

                      <p className="subSectionValue">
                        {araliyaKeleLabData?.rawMilkTSS
                          ? araliyaKeleLabData?.rawMilkTSS
                          : "-"}
                      </p>
                    </div>

                    <div className="col d-flex align-items-center justify-content-between">
                      <p className="text-white">Fat</p>

                      <p className="subSectionValue">
                        {araliyaKeleLabData?.rawMilkFat
                          ? araliyaKeleLabData?.rawMilkFat
                          : "-"}
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
                        {araliyaKeleLabData?.mixMilkPh
                          ? araliyaKeleLabData?.mixMilkPh
                          : "-"}
                      </p>
                    </div>

                    <div className="col d-flex align-items-center justify-content-between">
                      <p className="text-white">TSS</p>

                      <p className="subSectionValue">
                        {araliyaKeleLabData?.mixMilkTSS
                          ? araliyaKeleLabData?.mixMilkTSS
                          : "-"}
                      </p>
                    </div>

                    <div className="col d-flex align-items-center justify-content-between">
                      <p className="text-white">Fat</p>

                      <p className="subSectionValue">
                        {araliyaKeleLabData?.mixMilkFat
                          ? araliyaKeleLabData?.mixMilkFat
                          : "-"}
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
                          {breakdown.sectionName}{" "}
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
                              {breakdown.timeStamp?.toDate().toLocaleString()}
                            </span>
                          </p>

                          {breakdown.finishTime && (
                            <p className="text-secondary text-sm">
                              End time :
                              <span className="fw-bold text-capitalize textSuccessGreen">
                                {breakdown.updatedAt?.toDate().toLocaleString()}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-white text-center mt-5">No breakdown</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
