import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link } from "react-router-dom";

import { db } from "../../config/firebase.config";
import UseCurrentDate from "../../hooks/useCurrentDate";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Footer from "../../components/footer/Footer";
import { Col, Form, Row, Spinner } from "react-bootstrap";

const DailySummery = () => {
  const [
    dailyProductionDataByDateAndLocation,
    setDailyProductionDataByDateAndLocation,
  ] = useState({});
  const [date, setDate] = useState();
  const [location, setLocation] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const currentDate = UseCurrentDate();

  const fetchDailyProductionDataByDate = async () => {
    try {
      const q = query(
        collection(db, "daily_production"),
        where("date", "==", currentDate)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setDailyProductionDataByDateAndLocation({
          id: doc.id,
          ...doc.data(),
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);
    if (date) fetchDailyProductionDataByDate().then(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!isLoading) console.log(dailyProductionDataByDateAndLocation);
  }, [isLoading, dailyProductionDataByDateAndLocation]);

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
                <p className="display-6 mb-4 text-white">Daily summery</p>

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
                        <option disabled selected>
                          Select location
                        </option>
                        <option value="mdc">SD - 03</option>
                        <option value="araliya_kele">SD - 04</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      className="d-flex align-items-end"
                    >
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
                  {dailyProductionDataByDateAndLocation && (
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
                            {dailyProductionDataByDateAndLocation.totalCoconut}
                          </p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p className="fw-bold">Kernel weight</p>
                        </div>
                        <div className="col-6">
                          <p>
                            {/* TODO: Calculate total kernel weight */}
                            {
                              dailyProductionDataByDateAndLocation.totalKernelWeight
                            }
                          </p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p className="fw-bold">Total batch count</p>
                        </div>
                        <div className="col-6">
                          <p>
                            {/* TODO: Calculate batch count */}
                            {
                              dailyProductionDataByDateAndLocation.totalBatchCount
                            }
                          </p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p className="fw-bold">Total milk amount</p>
                        </div>
                        <div className="col-6">
                          <p>
                            {/* TODO: Calculate total kernel weight */}
                            {
                              dailyProductionDataByDateAndLocation.totalMilkAmountInAraliyaKele
                            }
                          </p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p className="fw-bold">Total powder quantity</p>
                        </div>
                        <div className="col-6">
                          <p>
                            {/* TODO: Calculate total powder quantity */}
                            {
                              dailyProductionDataByDateAndLocation.totalMilkAmountInAraliyaKele
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="table-container">
                    {/* TODO: Implement MUI data table */}
                    {/* show all data batch-wise */}
                    data table
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DailySummery;
