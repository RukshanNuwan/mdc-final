import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link } from "react-router-dom";
import { Card, Col, Form, Row, Spinner } from "react-bootstrap";

import { db } from "../../config/firebase.config";
import UseCurrentDate from "../../hooks/useCurrentDate";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Footer from "../../components/footer/Footer";
import ReportDataTable from "../../components/dataTable/ReportDataTable";
import BackToTop from "../../components/backToTop/BackToTop";

import {
  cutterSectionColumns,
  laboratorySectionColumns,
  mixingSectionColumns,
  sprayDryerSectionColumns,
  wetSectionColumns,
} from "../../data/reportDataTableSource";

const DailySummery = () => {
  const [date, setDate] = useState();
  const [location, setLocation] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [dailyProductionDataByDate, setDailyProductionDataByDate] = useState(
    {}
  );
  const [wetDataByDate, setWetDataByDate] = useState([]);
  const [cutterDataByDate, setCutterDataByDate] = useState([]);
  const [mixingDataByDateAndLocation, setMixingDataByDateAndLocation] =
    useState([]);
  const [labDataByDateAndLocation, setLabDataByDateAndLocation] = useState([]);
  const [sdDataByDateAndLocation, setSdDataByDateAndLocation] = useState([]);

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

  // Fetch wet data by date and location
  const fetchWetDataByDate = async () => {
    try {
      const list = [];
      const q = query(collection(db, "wet_section"), where("date", "==", date));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) list.push({ id: doc.id, ...doc.data() });
      });

      setWetDataByDate(list);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch cutter data by date and location
  const fetchCutterDataByDate = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "cutter_section"),
        where("date", "==", date)
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
  const fetchMixingDataByDateAndLocation = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "mixing_section"),
        where("date", "==", date),
        where("location", "==", location)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) list.push({ id: doc.id, ...doc.data() });
      });

      setMixingDataByDateAndLocation(list);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch lab data by date and location
  const fetchLabDataByDateAndLocation = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "lab_section"),
        where("date", "==", date),
        where("location", "==", location)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) list.push({ id: doc.id, ...doc.data() });
      });

      setLabDataByDateAndLocation(list);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch sd data by date and location
  const fetchSdDataByDateAndLocation = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "sd_section"),
        where("date", "==", date),
        where("location", "==", location)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) list.push({ id: doc.id, ...doc.data() });
      });

      setSdDataByDateAndLocation(list);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (date) {
      fetchDailyProductionDataByDate().then(() => setIsLoading(false));
      fetchWetDataByDate().then(() => setIsLoading(false));
      fetchCutterDataByDate().then(() => setIsLoading(false));
    }

    if (date && location) {
      fetchMixingDataByDateAndLocation().then(() => setIsLoading(false));
      fetchLabDataByDateAndLocation().then(() => setIsLoading(false));
      fetchSdDataByDateAndLocation().then(() => setIsLoading(false));
    }
  };

  const handlePrint = () => {
    alert("Not implemented yet");
  };

  return (
    // TODO: Create daily summery report view and implement to download that report as pdf / excel formats
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="col-md-12">
            <Breadcrumb title="Reports / Daily summery" />
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
                {/* <div className="d-flex justify-content-between"> */}
                <p className="display-6 mb-4 text-white">Daily summery</p>

                {/* <div>
                    <button
                      type="button"
                      className="btn-submit customBtn customBtnPrint"
                      onClick={handlePrint}
                    >
                      Print
                    </button>
                  </div> */}
                {/* </div> */}

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
                        defaultValue=""
                        onChange={(e) => setLocation(e.target.value)}
                      >
                        <option disabled value="">
                          Select location
                        </option>
                        <option value="mdc">SD - 03</option>
                        <option value="araliya_kele">SD - 04</option>
                      </Form.Select>
                    </Form.Group>

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
                    <div className="summery-container">
                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p className="fw-bold">Date</p>
                        </div>
                        <div className="col-6">
                          <p>{date}</p>
                        </div>
                      </div>

                      {location && (
                        <div className="row">
                          <div className="col-6 d-flex justify-content-end">
                            <p className="fw-bold">Location</p>
                          </div>
                          <div className="col-6">
                            <p>{location === "mdc" ? "SD - 03" : "SD - 04"}</p>
                          </div>
                        </div>
                      )}

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
                      <span className="sectionTitle sectionTitleBlue text-uppercase">
                        Wet section
                      </span>

                      <ReportDataTable
                        dataSet={wetDataByDate}
                        columnName={wetSectionColumns}
                      />
                    </Card>

                    <Card body className="mb-2">
                      <span className="sectionTitle sectionTitleBlue text-uppercase">
                        Cutter section
                      </span>

                      <ReportDataTable
                        dataSet={cutterDataByDate}
                        columnName={cutterSectionColumns}
                      />
                    </Card>

                    <Card body className="mb-2">
                      <span className="sectionTitle sectionTitleBlue text-uppercase">
                        Mixing section
                      </span>

                      <ReportDataTable
                        dataSet={mixingDataByDateAndLocation}
                        columnName={mixingSectionColumns}
                      />
                    </Card>

                    <Card body className="mb-2">
                      <span className="sectionTitle sectionTitleBlue text-uppercase">
                        Spray dryer
                      </span>

                      <ReportDataTable
                        dataSet={sdDataByDateAndLocation}
                        columnName={sprayDryerSectionColumns}
                      />
                    </Card>

                    <Card body className="mb-2">
                      <span className="sectionTitle sectionTitleBlue text-uppercase">
                        Laboratory
                      </span>

                      <ReportDataTable
                        dataSet={labDataByDateAndLocation}
                        columnName={laboratorySectionColumns}
                      />
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

export default DailySummery;
