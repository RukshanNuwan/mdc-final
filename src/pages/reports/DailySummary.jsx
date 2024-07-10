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

  // Fetch daily production data by date
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
    } catch (error) {
      console.log(error);
    }
  };

  const renderTotalPowderQuantity = () => {
    if (isNaN(dailyProductionDataByDate?.totalPowderQuantityInMdc)) {
      return dailyProductionDataByDate?.totalPowderQuantityInAraliyaKele;
    }

    if (isNaN(dailyProductionDataByDate?.totalPowderQuantityInAraliyaKele)) {
      return dailyProductionDataByDate?.totalPowderQuantityInMdc;
    }

    return (
      dailyProductionDataByDate?.totalPowderQuantityInMdc +
      dailyProductionDataByDate?.totalPowderQuantityInAraliyaKele
    );
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
                          <p>{date}</p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p className="fw-bold">Total coconut count</p>
                        </div>
                        <div className="col-6">
                          <p>
                            {dailyProductionDataByDate?.totalCoconut
                              ? dailyProductionDataByDate?.totalCoconut
                              : "-"}
                          </p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p className="fw-bold">Kernel weight</p>
                        </div>
                        <div className="col-6">
                          <p>
                            {dailyProductionDataByDate?.totalKernelWeight
                              ? dailyProductionDataByDate?.totalKernelWeight
                              : "-"}
                            kg
                          </p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p className="fw-bold">Total milk batch count</p>
                        </div>
                        <div className="col-6">
                          <p>
                            {dailyProductionDataByDate?.totalBatchCountInMdc ||
                            dailyProductionDataByDate?.totalBatchCountInAraliyaKele
                              ? dailyProductionDataByDate?.totalBatchCountInMdc +
                                dailyProductionDataByDate?.totalBatchCountInAraliyaKele
                              : "-"}
                          </p>
                        </div>

                        <div className="col-6 d-flex justify-content-end">
                          <p className="subText">SD 03</p>
                        </div>
                        <div className="col-6">
                          <p className="subText">
                            {dailyProductionDataByDate?.totalBatchCountInMdc
                              ? dailyProductionDataByDate?.totalBatchCountInMdc
                              : "-"}
                          </p>
                        </div>

                        <div className="col-6 d-flex justify-content-end">
                          <p className="subText">SD 04</p>
                        </div>
                        <div className="col-6">
                          <p className="subText">
                            {dailyProductionDataByDate?.totalBatchCountInAraliyaKele
                              ? dailyProductionDataByDate?.totalBatchCountInAraliyaKele
                              : "-"}
                          </p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p className="fw-bold">Total milk amount</p>
                        </div>
                        <div className="col-6">
                          <p>
                            {dailyProductionDataByDate?.totalMilkAmountInMdc ||
                            dailyProductionDataByDate?.totalMilkAmountInAraliyaKele
                              ? dailyProductionDataByDate?.totalMilkAmountInMdc +
                                dailyProductionDataByDate?.totalMilkAmountInAraliyaKele
                              : "-"}
                            kg
                          </p>
                        </div>

                        <div className="col-6 d-flex justify-content-end">
                          <p className="subText">SD 03</p>
                        </div>
                        <div className="col-6">
                          <p className="subText">
                            {dailyProductionDataByDate?.totalMilkAmountInMdc
                              ? dailyProductionDataByDate?.totalMilkAmountInMdc
                              : "-"}
                            kg
                          </p>
                        </div>

                        <div className="col-6 d-flex justify-content-end">
                          <p className="subText">SD 04</p>
                        </div>
                        <div className="col-6">
                          <p className="subText">
                            {dailyProductionDataByDate?.totalMilkAmountInAraliyaKele
                              ? dailyProductionDataByDate?.totalMilkAmountInAraliyaKele
                              : "-"}
                            kg
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
                          <p>{renderTotalPowderQuantity()}kg</p>
                        </div>

                        <div className="col-6 d-flex justify-content-end">
                          <p className="subText">SD 03</p>
                        </div>
                        <div className="col-6">
                          <p className="subText">
                            {dailyProductionDataByDate?.totalPowderQuantityInMdc
                              ? dailyProductionDataByDate?.totalPowderQuantityInMdc
                              : "-"}
                            kg
                          </p>
                        </div>

                        <div className="col-6 d-flex justify-content-end">
                          <p className="subText">SD 04</p>
                        </div>
                        <div className="col-6">
                          <p className="subText">
                            {dailyProductionDataByDate?.totalPowderQuantityInAraliyaKele
                              ? dailyProductionDataByDate?.totalPowderQuantityInAraliyaKele
                              : "-"}
                            kg
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
                    <Card body className="mb-2">
                      <ReportDataTable data={productionData} />
                    </Card>
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
