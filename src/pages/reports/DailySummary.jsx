import { useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link } from "react-router-dom";
import { Card, Col, Form, Row, Spinner } from "react-bootstrap";

import { db } from "../../config/firebase.config";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Footer from "../../components/footer/Footer";
import ReportDataTable from "../../components/dataTable/ReportDataTable";
import BackToTop from "../../components/backToTop/BackToTop";

const DailySummary = () => {
  const [date, setDate] = useState();
  const [location, setLocation] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [dailyProductionDataByDate, setDailyProductionDataByDate] = useState(
    {}
  );
  const [productionData, setProductionData] = useState([]);
  const [totalBatchesInSd3, setTotalBatchesInSd3] = useState(0);
  const [totalBatchesInSd4, setTotalBatchesInSd4] = useState(0);
  const [totalMilkAmountInSd3, setTotalMilkAmountInSd3] = useState(0);
  const [totalMilkAmountInSd4, setTotalMilkAmountInSd4] = useState(0);
  const [totalPowderQuantityInSd3, setTotalPowderQuantityInSd3] = useState(0);
  const [totalPowderQuantityInSd4, setTotalPowderQuantityInSd4] = useState(0);

  const setTotalValues = (list) => {
    if (list.length > 0) {
      let totalBatchesInMdc = 0;
      let totalBatchesInAraliyaKele = 0;
      let totalMilkAmountInMdc = 0;
      let totalMilkAmountInAraliyaKele = 0;
      let totalPowderQuantityInMdc = 0;
      let totalPowderQuantityInAraliyaKele = 0;

      list.forEach((item) => {
        if (item.location === "mdc") {
          totalBatchesInMdc++;
          totalMilkAmountInMdc += Number(item.mixing_milk_quantity);
          totalPowderQuantityInMdc += Number(item.sd_total_powder_quantity);
        } else {
          totalBatchesInAraliyaKele++;
          totalMilkAmountInAraliyaKele += Number(item.mixing_milk_quantity);
          totalPowderQuantityInAraliyaKele += Number(
            item.sd_total_powder_quantity
          );
        }
      });

      setTotalBatchesInSd3(totalBatchesInMdc);
      setTotalBatchesInSd4(totalBatchesInAraliyaKele);
      setTotalMilkAmountInSd3(totalMilkAmountInMdc);
      setTotalMilkAmountInSd4(totalMilkAmountInAraliyaKele);
      setTotalPowderQuantityInSd3(totalPowderQuantityInMdc);
      setTotalPowderQuantityInSd4(totalPowderQuantityInAraliyaKele);
    }
  };

  const fetchDailyProductionDataByDate = async () => {
    try {
      const q = query(
        collection(db, "daily_production"),
        where("date", "==", date)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) {
          setDailyProductionDataByDate({
            id: doc.id,
            ...doc.data(),
          });
        } else {
          setDailyProductionDataByDate({});
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProductionDataByDate = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "production_data"),
        where("date", "==", date),
        orderBy("wet_added_at", "asc")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) list.push({ id: doc.id, ...doc.data() });
      });

      setProductionData(list);
      setTotalValues(list);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProductionDataByDateAndLocation = async () => {
    setProductionData([]);

    try {
      const list = [];
      const q = query(
        collection(db, "production_data"),
        where("date", "==", date),
        where("location", "==", location),
        orderBy("wet_added_at", "asc")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) list.push({ id: doc.id, ...doc.data() });
      });

      setProductionData(list);
      setTotalValues(list);
    } catch (error) {
      console.log(error);
    }
  };

  const renderMilkExpellerEfficiency = () => {
    let sum = 0;
    let index = 0;

    productionData.forEach((data) => {
      if (data?.mixing_milk_recovery)
        sum = sum + Number(data?.mixing_milk_recovery);
      index++;
    });

    return (sum / index).toFixed(2);
  };

  // Calculate milk powder recovery
  // const renderPowderRecovery = () => {
  //   let sum = 0;
  //   let index = 0;

  //   sdDataByDate.forEach((data) => {
  //     if (data.powderRecovery) sum = sum + Number(data.powderRecovery);
  //     index++;
  //   });

  //   return (sum / index).toFixed(2);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (date) {
      fetchDailyProductionDataByDate().then(() => setIsLoading(false));
      fetchProductionDataByDate().then(() => setIsLoading(false));
    }

    if (date && location)
      fetchProductionDataByDateAndLocation().then(() => setIsLoading(false));

    if (!date && !location) setIsLoading(false);
  };

  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="col-md-12">
            <Breadcrumb title="Reports / Daily summary" />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="mb-2">
                <Link
                  to="/reports"
                  className="d-flex align-items-center customBackBtn"
                >
                  <ArrowBackIosIcon fontSize="small" /> Back
                </Link>
              </div>

              <div className="card-body formWrapper">
                <p className="display-6 mb-4 text-white">Daily summary</p>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="date"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Date</Form.Label>
                      <Form.Control
                        type="date"
                        className="customInput"
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="type"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Location</Form.Label>
                      <Form.Select
                        className="customInput"
                        onChange={(e) => setLocation(e.target.value)}
                      >
                        <option>Select location</option>
                        <option value="mdc">SD - 03</option>
                        <option value="araliya_kele">SD - 04</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} className="d-flex align-items-end">
                      <button type="submit" className="btn-submit customBtn">
                        {isLoading ? (
                          <div className="d-flex align-items-center gap-2">
                            <Spinner animation="border" size="sm" />
                            <p>Generating...</p>
                          </div>
                        ) : (
                          "Generate"
                        )}
                      </button>
                    </Form.Group>
                  </Row>
                </Form>

                <hr className="custom-hr-yellow" />

                <div className="report-container">
                  {dailyProductionDataByDate && (
                    <div className="summary-container">
                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p className="fw-bold">Date</p>
                        </div>
                        <div className="col-6">
                          <p>{date || "-"}</p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p className="fw-bold">Total coconut count</p>
                        </div>
                        <div className="col-6">
                          <p>
                            {dailyProductionDataByDate?.totalCoconut || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p className="fw-bold">Total kernel quantity</p>
                        </div>
                        <div className="col-6">
                          <p>
                            {dailyProductionDataByDate.totalKernelWeight ||
                            dailyProductionDataByDate.outsideKernelQuantity
                              ? dailyProductionDataByDate.totalKernelWeight +
                                Number(
                                  dailyProductionDataByDate.outsideKernelQuantity
                                )
                              : "-"}
                            Kg
                          </p>
                        </div>

                        <div className="col-6 d-flex justify-content-end">
                          <p className="subText">In-house kernel</p>
                        </div>
                        <div className="col-6">
                          <p className="subText">
                            {dailyProductionDataByDate.totalKernelWeight || "-"}
                            Kg
                          </p>
                        </div>

                        <div className="col-6 d-flex justify-content-end">
                          <p className="subText">Outside kernel</p>
                        </div>
                        <div className="col-6">
                          <p className="subText">
                            {dailyProductionDataByDate.outsideKernelQuantity ||
                              "-"}
                            Kg
                          </p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p className="fw-bold">Total DC batch count</p>
                        </div>
                        <div className="col-6">
                          <p>
                            {dailyProductionDataByDate.desiccatedCoconutQuantity ||
                              "-"}
                          </p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p className="fw-bold">Total milk batch count</p>
                        </div>
                        <div className="col-6">
                          <p>
                            {totalBatchesInSd3 || totalBatchesInSd4
                              ? totalBatchesInSd3 + totalBatchesInSd4
                              : "-"}
                          </p>
                        </div>

                        <div className="col-6 d-flex justify-content-end">
                          <p className="subText">SD 03</p>
                        </div>
                        <div className="col-6">
                          <p className="subText">{totalBatchesInSd3 || "-"}</p>
                        </div>

                        <div className="col-6 d-flex justify-content-end">
                          <p className="subText">SD 04</p>
                        </div>
                        <div className="col-6">
                          <p className="subText">{totalBatchesInSd4 || "-"}</p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p className="fw-bold">Total milk amount</p>
                        </div>
                        <div className="col-6">
                          <p>
                            {totalMilkAmountInSd3 || totalMilkAmountInSd4
                              ? totalMilkAmountInSd3 + totalMilkAmountInSd4
                              : "-"}
                            Kg
                          </p>
                        </div>

                        <div className="col-6 d-flex justify-content-end">
                          <p className="subText">SD 03</p>
                        </div>
                        <div className="col-6">
                          <p className="subText">
                            {totalMilkAmountInSd3 || "-"}
                            Kg
                          </p>
                        </div>

                        <div className="col-6 d-flex justify-content-end">
                          <p className="subText">SD 04</p>
                        </div>
                        <div className="col-6">
                          <p className="subText">
                            {totalMilkAmountInSd4 || "-"}
                            Kg
                          </p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p className="fw-bold">Avg. expeller efficiency</p>
                        </div>
                        <div className="col-6">
                          <span className="sectionTitle sectionTitleBlue">
                            {renderMilkExpellerEfficiency()}%
                          </span>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p className="fw-bold">Total powder quantity</p>
                        </div>
                        <div className="col-6">
                          <p>
                            {totalPowderQuantityInSd3 ||
                            totalPowderQuantityInSd4
                              ? totalPowderQuantityInSd3 +
                                totalPowderQuantityInSd4
                              : "-"}
                            Kg
                          </p>
                        </div>

                        <div className="col-6 d-flex justify-content-end">
                          <p className="subText">SD 03</p>
                        </div>
                        <div className="col-6">
                          <p className="subText">
                            {totalPowderQuantityInSd3 || "-"}
                            Kg
                          </p>
                        </div>

                        <div className="col-6 d-flex justify-content-end">
                          <p className="subText">SD 04</p>
                        </div>
                        <div className="col-6">
                          <p className="subText">
                            {totalPowderQuantityInSd4 || "-"}
                            Kg
                          </p>
                        </div>
                      </div>

                      {/* <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p className="fw-bold">Avg. powder recovery</p>
                        </div>
                        <div className="col-6">
                          <span className="sectionTitle sectionTitleBlue">
                            {renderPowderRecovery()}%
                          </span>
                        </div>
                      </div> */}
                    </div>
                  )}

                  <div className="table-container">
                    {productionData.length > 0 ? (
                      <Card body className="mb-2">
                        <ReportDataTable data={productionData} />
                      </Card>
                    ) : (
                      <p className="text-center">No data found</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </>
  );
};

export default DailySummary;
