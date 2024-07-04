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
  const [isLoading, setIsLoading] = useState(false);
  const [dailyProductionDataByDate, setDailyProductionDataByDate] = useState(
    {}
  );
  const [wetDataByDate, setWetDataByDate] = useState([]);
  const [cutterDataByDate, setCutterDataByDate] = useState([]);
  const [mixingDataByDate, setMixingDataByDate] = useState([]);
  const [labDataByDate, setLabDataByDate] = useState([]);
  const [sdDataByDate, setSdDataByDate] = useState([]);

  const generalDataByDate = {};

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

  // Fetch wet data by date
  const fetchWetDataByDate = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "wet_section"),
        where("date", "==", date),
        orderBy("timeStamp", "asc")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) list.push({ id: doc.id, ...doc.data() });
      });

      setWetDataByDate(list);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch cutter data by date
  const fetchCutterDataByDate = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "cutter_section"),
        where("date", "==", date),
        orderBy("timeStamp", "asc")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) list.push({ id: doc.id, ...doc.data() });
      });

      setCutterDataByDate(list);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch mixing data by date and location
  const fetchMixingDataByDate = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "mixing_section"),
        where("date", "==", date),
        orderBy("timeStamp", "asc")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) list.push({ id: doc.id, ...doc.data() });
      });

      setMixingDataByDate(list);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch lab data by date and location
  const fetchLabDataByDate = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "lab_section"),
        where("date", "==", date),
        orderBy("timeStamp", "asc")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) list.push({ id: doc.id, ...doc.data() });
      });

      setLabDataByDate(list);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch sd data by date and location
  const fetchSdDataByDate = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "sd_section"),
        where("date", "==", date),
        orderBy("timeStamp", "asc")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) list.push({ id: doc.id, ...doc.data() });
      });

      setSdDataByDate(list);
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

  // TODO: Get sd data (sd status = completed)
  // Get sdData.wet_mixing_batch_id -> mixing object
  // Get sdData.lab_batch_id -> lab object
  // Get mixing.cutter_batch_id -> cutter object

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (date) {
      fetchDailyProductionDataByDate().then(() => setIsLoading(false));
      fetchWetDataByDate().then(() => setIsLoading(false));
      fetchCutterDataByDate().then(() => setIsLoading(false));
      fetchMixingDataByDate().then(() => setIsLoading(false));
      fetchLabDataByDate().then(() => setIsLoading(false));
      fetchSdDataByDate().then(() => setIsLoading(false));
    }
  };

  if (
    wetDataByDate.length > 0 &&
    cutterDataByDate.length > 0 &&
    mixingDataByDate.length > 0 &&
    labDataByDate.length > 0 &&
    sdDataByDate.length > 0
  ) {
    generalDataByDate.daily_production_data = dailyProductionDataByDate;
    generalDataByDate.wet_data = wetDataByDate;
    generalDataByDate.cutter_data = cutterDataByDate;
    generalDataByDate.mixing_data = mixingDataByDate;
    generalDataByDate.lab_data = labDataByDate;
    generalDataByDate.sd_data = sdDataByDate;
  }

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

                {/* <div>
                    <button
                      type="button"
                      className="btn-submit customBtn customBtnPrint"
                      onClick={handlePrint}
                    >
                      Print
                    </button>
                  </div> */}

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

                    {/* <Form.Group
                      as={Col}
                      md="4"
                      controlId="type"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Location</Form.Label>
                      <Form.Select
                        className="customInput"
                        defaultValue=""
                        onChange={(e) => setLocation(e.target.value)}
                      >
                        <option disabled value="">
                          Select location
                        </option>
                        <option value="mdc">SD - 03</option>
                        <option value="araliya_kele">SD - 04</option>
                      </Form.Select>
                    </Form.Group> */}

                    <Form.Group as={Col} className="d-flex align-items-end">
                      <button type="submit" className="btn-submit customBtn">
                        {isLoading ? (
                          <div className="d-flex align-items-center gap-2">
                            <Spinner animation="border" size="sm" />
                            <p className="text-capitalize">Loading...</p>
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

                      {/* {location && (
                        <div className="row">
                          <div className="col-6 d-flex justify-content-end">
                            <p className="fw-bold">Location</p>
                          </div>
                          <div className="col-6">
                            <p>{location === "mdc" ? "SD - 03" : "SD - 04"}</p>
                          </div>
                        </div>
                      )} */}

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
                      </div>

                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p className="fw-bold">Total powder quantity</p>
                        </div>
                        <div className="col-6">
                          <p>{renderTotalPowderQuantity()}kg</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="table-container">
                    <Card body className="mb-2">
                      <ReportDataTable dataSet={generalDataByDate} />
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
