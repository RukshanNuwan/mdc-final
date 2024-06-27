import { useEffect, useState } from "react";
import {
  collection,
  doc,
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
  const [id, setId] = useState();
  const [dailyProductionData, setDailyProductionData] = useState({});
  const [cutterData, setCutterData] = useState([]);
  const [sdData, setSdData] = useState([]);
  const [labData, setLabData] = useState([]);
  const [mdcStatus, setMdcStatus] = useState(false);
  const [araliyaKeleStatus, setAraliyaKeleStatus] = useState(false);
  const [breakdowns, setBreakdowns] = useState([]);

  const currentDate = useCurrentDate();

  const calculateRemainingBatches = (totalBatches) => {
    const currentTotalBatchCount =
      dailyProductionData.totalBatchCountInMdc +
      dailyProductionData.totalBatchCountInAraliyaKele;
    const res = totalBatches - currentTotalBatchCount;
    return res.toString();
  };

  useEffect(() => {
    const fetchId = async () => {
      try {
        const q = query(
          collection(db, "daily_production"),
          orderBy("timeStamp", "desc")
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let list = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });

          setId(list[0].id);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.log(error);
      }
    };

    fetchId();
  }, []);

  useEffect(() => {
    const handleStatus = () => {
      if (sdData?.location === "mdc") {
        setMdcStatus(true);
      } else if (sdData?.location === "araliya_kele") {
        setAraliyaKeleStatus(true);
      }
    };

    handleStatus();
  }, [sdData?.location]);

  useEffect(() => {
    const fetchDailyProductionData = async () => {
      try {
        const unsubscribe = await onSnapshot(
          doc(db, "daily_production", id),
          (doc) => {
            setDailyProductionData(doc.data());
          }
        );

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.log(error);
      }
    };

    fetchDailyProductionData();
  }, [id]);

  useEffect(() => {
    const fetchCutterData = async () => {
      try {
        const q = query(
          collection(db, "cutter_section"),
          where("status", "==", "completed")
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let list = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });

          setCutterData(list);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.log(error);
      }
    };

    fetchCutterData();
  }, []);

  useEffect(() => {
    const fetchCurrentSdData = async () => {
      try {
        const q = query(
          collection(db, "sd_section"),
          where("status", "==", "updated")
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
    const fetchLabData = async () => {
      try {
        const q = query(
          collection(db, "lab_section"),
          where("status", "==", "completed"),
          orderBy("timeStamp", "desc")
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const list = [];
          querySnapshot.forEach((doc) => {
            list.push(doc.data());
          });
          setLabData(list);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.log(error);
      }
    };

    fetchLabData();
  }, []);

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
    <section className="dashboard section">
      <div className="dashboardContainer">
        <div className="row d-flex flex-row-reverse">
          <div className="col-md-4">
            <div className="col mb-2 sectionContainer">
              <span className="sectionTitle sectionTitleBlue text-uppercase">
                Wet section
              </span>
              <p className="sectionHeading sectionHeadingTextBlue">
                Total coconut
              </p>
              <p className="sectionMainValue">
                {dailyProductionData?.totalKernelWeight
                  ? dailyProductionData?.totalCoconut
                  : "---"}
              </p>

              <div className="col-12 sectionDetailsContainer">
                <div className="sectionSubHeadingContainer d-flex justify-content-between mt-2">
                  <p className="sectionSubHeading">Kernel weight</p>
                  <p className="sectionSubValue fw-bold">
                    {dailyProductionData?.totalKernelWeight
                      ? dailyProductionData?.totalKernelWeight
                      : "---"}
                    kg
                  </p>
                </div>

                <div className="sectionSubHeadingContainer d-flex justify-content-between">
                  <p className="sectionSubHeading">Total batch count</p>
                  <p className="sectionSubValue fw-bold">
                    {Math.round(
                      dailyProductionData?.totalKernelWeight
                        ? dailyProductionData?.totalKernelWeight / 300
                        : "---"
                    )}
                  </p>
                </div>

                <div className="sectionSubHeadingContainer d-flex justify-content-between">
                  <p className="sectionSubHeading">Remaining batches</p>
                  <p className="sectionSubValue fw-bold">
                    {calculateRemainingBatches(
                      Math.round(
                        dailyProductionData?.totalKernelWeight &&
                          dailyProductionData?.totalKernelWeight / 300
                      )
                    )}
                  </p>
                </div>
              </div>
            </div>

            <TotalCard
              value_1={dailyProductionData?.totalMilkAmountInMdc}
              value_2={dailyProductionData?.totalMilkAmountInAraliyaKele}
              text="milk amount"
            />

            <TotalCard
              value_1={dailyProductionData?.totalPowderQuantityInMdc}
              value_2={dailyProductionData?.totalPowderQuantityInAraliyaKele}
              text="powder quantity"
            />
          </div>

          <div className="col-md-8">
            <div className="row">
              <div className="col-md-5 pe-md-0">
                <div className="detailContainer mb-sm-2">
                  <div className="d-flex justify-content-between">
                    <span className="sectionTitle sectionTitlePurple text-uppercase">
                      SD 03
                    </span>
                    <span
                      className={`status ${
                        mdcStatus === true ? "running" : "stopped"
                      }`}
                    >
                      {mdcStatus ? "Running" : "Stopped"}
                    </span>
                  </div>

                  <p className="batchNumber text-center display-1">
                    {sdData &&
                      sdData.map(
                        (data) => data.location === "mdc" && data.batchNumber
                      )}
                  </p>

                  <div className="col-12 sectionDetailsContainer">
                    <div className="sectionSubHeadingContainer d-flex justify-content-between mt-2">
                      <p className="sectionSubHeading">
                        Last batch free flowing
                      </p>
                      <p className="sectionSubValue text-capitalize fw-bold">
                        {labData[0]?.location === "mdc" &&
                        labData[0]?.powderFreeFlowing ? (
                          <CheckIcon className="text-success" />
                        ) : (
                          <CloseIcon className="text-danger" />
                        )}
                      </p>
                    </div>

                    <div className="sectionSubHeadingContainer d-flex justify-content-between">
                      <p className="sectionSubHeading">Last batch solubility</p>
                      <p className="sectionSubValue text-capitalize fw-bold">
                        {labData[0]?.location === "mdc" &&
                        labData[0]?.powderSolubility ? (
                          <CheckIcon className="text-success" />
                        ) : (
                          <CloseIcon className="text-danger" />
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-7 pe-md-0 labDetailsContainer">
                <div className="labDetailContainer">
                  <span className="sectionTitle sectionTitleMaroon text-uppercase">
                    Lab - SD 03
                  </span>

                  <div className="row mt-3">
                    <div className="col-6 border-end">
                      <span className="subSectionHeading">Raw milk</span>
                      <div className="col-12 mt-2">
                        <div className="col d-flex align-items-center justify-content-around">
                          <p className="subSectionKey sectionBodyTextMaroon">
                            pH
                          </p>
                          {labData?.map((item, index) => {
                            return (
                              <p key={index} className="subSectionValue">
                                {item?.location === "mdc" && item?.rawMilkPh}
                              </p>
                            );
                          })}
                        </div>

                        <div className="col d-flex align-items-center justify-content-around">
                          <p className="subSectionKey sectionBodyTextMaroon">
                            TSS
                          </p>
                          {labData?.map((item, index) => {
                            return (
                              <p key={index} className="subSectionValue">
                                {item?.location === "mdc" && item?.rawMilkTSS}
                              </p>
                            );
                          })}
                        </div>

                        <div className="col d-flex align-items-center justify-content-around">
                          <p className="subSectionKey sectionBodyTextMaroon">
                            Fat
                          </p>
                          {labData?.map((item, index) => {
                            return (
                              <p key={index} className="subSectionValue">
                                {item?.location === "mdc" && item?.rawMilkFat}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <span className="subSectionHeading">Mix milk</span>
                      <div className="col-12 mt-2">
                        <div className="col d-flex align-items-center justify-content-around">
                          <p className="subSectionKey sectionBodyTextMaroon">
                            pH
                          </p>
                          {labData?.map((item, index) => {
                            return (
                              <p key={index} className="subSectionValue">
                                {item?.location === "mdc" && item?.mixMilkPh}
                              </p>
                            );
                          })}
                        </div>

                        <div className="col d-flex align-items-center justify-content-around">
                          <p className="subSectionKey sectionBodyTextMaroon">
                            TSS
                          </p>
                          {labData?.map((item, index) => {
                            return (
                              <p key={index} className="subSectionValue">
                                {item?.location === "mdc" && item?.mixMilkTSS}
                              </p>
                            );
                          })}
                        </div>

                        <div className="col d-flex align-items-center justify-content-around">
                          <p className="subSectionKey sectionBodyTextMaroon">
                            Fat
                          </p>
                          {labData?.map((item, index) => {
                            return (
                              <p key={index} className="subSectionValue">
                                {item?.location === "mdc" && item?.mixMilkFat}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-5 pe-md-0 mt-2">
                <div className="detailContainer">
                  <div className="d-flex justify-content-between">
                    <span className="sectionTitle sectionTitlePurple text-uppercase">
                      SD 04
                    </span>
                    <span
                      className={`status ${
                        araliyaKeleStatus === true ? "running" : "stopped"
                      }`}
                    >
                      {araliyaKeleStatus ? "Running" : "Stopped"}
                    </span>
                  </div>

                  <p className="batchNumber text-center display-1">
                    {sdData &&
                      sdData.map(
                        (data) =>
                          data.location === "araliya_kele" && data.batchNumber
                      )}
                  </p>

                  <div className="col-12 sectionDetailsContainer">
                    <div className="sectionSubHeadingContainer d-flex justify-content-between mt-2">
                      <p className="sectionSubHeading">
                        Last batch free flowing
                      </p>
                      <p className="sectionSubValue text-capitalize fw-bold">
                        {labData[0]?.location === "araliya_kele" &&
                        labData[0]?.powderFreeFlowing ? (
                          <CheckIcon className="text-success" />
                        ) : (
                          <CloseIcon className="text-danger" />
                        )}
                      </p>
                    </div>

                    <div className="sectionSubHeadingContainer d-flex justify-content-between">
                      <p className="sectionSubHeading">Last batch solubility</p>
                      <p className="sectionSubValue text-capitalize fw-bold">
                        {labData[0]?.location === "araliya_kele" &&
                        labData[0]?.powderSolubility ? (
                          <CheckIcon className="text-success" />
                        ) : (
                          <CloseIcon className="text-danger" />
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-7 pe-md-0 mt-2 labDetailsContainer">
                <div className="labDetailContainer">
                  <span className="sectionTitle sectionTitleMaroon text-uppercase">
                    Lab - SD 04
                  </span>

                  <div className="row mt-3">
                    <div className="col-6 border-end">
                      <span className="subSectionHeading">Raw milk</span>
                      <div className="col-12 mt-2">
                        <div className="col d-flex align-items-center justify-content-around">
                          <p className="subSectionKey sectionBodyTextMaroon">
                            pH
                          </p>
                          {labData?.map((item, index) => {
                            return (
                              <p key={index} className="subSectionValue">
                                {item.location === "araliya_kele" &&
                                  item?.rawMilkPh}
                              </p>
                            );
                          })}
                        </div>

                        <div className="col d-flex align-items-center justify-content-around">
                          <p className="subSectionKey sectionBodyTextMaroon">
                            TSS
                          </p>
                          {labData?.map((item, index) => {
                            return (
                              <p key={index} className="subSectionValue">
                                {item.location === "araliya_kele" &&
                                  item?.rawMilkTSS}
                              </p>
                            );
                          })}
                        </div>

                        <div className="col d-flex align-items-center justify-content-around">
                          <p className="subSectionKey sectionBodyTextMaroon">
                            Fat
                          </p>
                          {labData?.map((item, index) => {
                            return (
                              <p key={index} className="subSectionValue">
                                {item.location === "araliya_kele" &&
                                  item?.rawMilkFat}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <span className="subSectionHeading">Mix milk</span>
                      <div className="col-12 mt-2">
                        <div className="col d-flex align-items-center justify-content-around">
                          <p className="subSectionKey sectionBodyTextMaroon">
                            pH
                          </p>
                          {labData?.map((item, index) => {
                            return (
                              <p key={index} className="subSectionValue">
                                {item.location === "araliya_kele" &&
                                  item?.mixMilkPh}
                              </p>
                            );
                          })}
                        </div>

                        <div className="col d-flex align-items-center justify-content-around">
                          <p className="subSectionKey sectionBodyTextMaroon">
                            TSS
                          </p>
                          {labData?.map((item, index) => {
                            return (
                              <p key={index} className="subSectionValue">
                                {item.location === "araliya_kele" &&
                                  item?.mixMilkTSS}
                              </p>
                            );
                          })}
                        </div>

                        <div className="col d-flex align-items-center justify-content-around">
                          <p className="subSectionKey sectionBodyTextMaroon">
                            Fat
                          </p>
                          {labData?.map((item, index) => {
                            return (
                              <p key={index} className="subSectionValue">
                                {item.location === "araliya_kele" &&
                                  item?.mixMilkFat}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-5 pe-md-0">
                <div className="cutterContainer mb-sm-2">
                  <div className="d-flex justify-content-between">
                    <span className="sectionTitle sectionTitleGreen text-uppercase">
                      Cutter section
                    </span>
                  </div>
                  <p className="cutterBatchNumber text-center display-1">
                    {cutterData && cutterData.length}
                  </p>

                  <div className="col-12 sectionDetailsContainer">
                    <div className="sectionSubHeadingContainer d-flex justify-content-between mt-2">
                      <p className="sectionSubHeading">MDC batch count</p>
                      <p className="sectionSubValue text-capitalize fw-bold">
                        {dailyProductionData?.totalBatchCountInMdc
                          ? dailyProductionData?.totalBatchCountInMdc
                          : "---"}
                      </p>
                    </div>

                    <div className="sectionSubHeadingContainer d-flex justify-content-between">
                      <p className="sectionSubHeading">
                        Araliya kele batch count
                      </p>
                      <p className="sectionSubValue fw-bold">
                        {dailyProductionData?.totalBatchCountInAraliyaKele
                          ? dailyProductionData?.totalBatchCountInAraliyaKele
                          : "---"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-7 mb-xs-2 pe-md-0">
                <div className="breakdownContainer">
                  <span className="sectionTitle sectionTitleRed text-uppercase">
                    Breakdowns
                  </span>

                  {breakdowns && breakdowns.length > 0 ? (
                    <ListGroup variant="flush" className="mt-2">
                      {breakdowns?.map((breakdown, index) => (
                        <ListGroup.Item key={index}>
                          <div className="d-flex justify-content-between">
                            <p className="fw-bold text-capitalize">
                              {breakdown.sectionName}{" "}
                              {breakdown.location &&
                                ` | ${
                                  breakdown.location === "mdc"
                                    ? "MDC"
                                    : "Araliya Kele"
                                }`}
                            </p>
                            <p
                              className={`sectionSubHeadingContainer
                              ${
                                breakdown.status === "ongoing"
                                  ? "text-danger"
                                  : "text-success"
                              }
                            `}
                            >
                              {breakdown.status}
                            </p>
                          </div>
                          <p>{breakdown.breakdownDetails}</p>
                          <div className="d-flex justify-content-between sectionSubHeadingContainer">
                            <p className="text-secondary">
                              Informed to :{" "}
                              <span className="fw-bold text-capitalize">
                                {breakdown.informedTo}
                              </span>
                            </p>
                            <p className="text-secondary text-sm">
                              Delay time : [delay]
                            </p>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p>No breakdown</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
