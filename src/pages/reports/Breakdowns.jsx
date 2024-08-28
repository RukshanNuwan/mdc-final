import { useEffect, useState } from "react";
import { Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import BackToTop from "../../components/backToTop/BackToTop";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import { db } from "../../config/firebase.config";
import BreakdownReportTable from "../../components/dataTable/BreakdownReportTable";
import { calculateTimeDifference } from "../../utils";

const Breakdowns = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [breakdownsInDb, setBreakdownsInDb] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const fetchBreakdownsByStartDate = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "breakdowns"),
        where("breakdown_date", "==", startDate),
        orderBy("timeStamp", "desc")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) list.push({ id: doc.id, ...doc.data() });
      });

      setBreakdownsInDb(list);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBreakdownsByDateRange = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "breakdowns"),
        where("breakdown_date", ">=", startDate),
        where("breakdown_date", "<=", endDate),
        orderBy("timeStamp", "desc")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) list.push({ id: doc.id, ...doc.data() });
      });

      setBreakdownsInDb(list);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (startDate) fetchBreakdownsByStartDate().then(() => setIsLoading(false));
    if (startDate && endDate)
      fetchBreakdownsByDateRange().then(() => setIsLoading(false));

    if (!startDate && !endDate) setIsLoading(false);
  };

  useEffect(() => {
    const calculateTotalBreakdownTime = () => {
      let totalHours = 0;
      let totalMinutes = 0;

      breakdownsInDb.forEach((breakdown) => {
        const timeDifference = calculateTimeDifference(
          breakdown.startTime,
          breakdown.finishTime
        );

        totalHours += timeDifference.hours;
        totalMinutes += timeDifference.minutes;

        totalHours += Math.floor(totalMinutes / 60);
        totalMinutes = totalMinutes % 60;

        setTotalHours(totalHours);
        setTotalMinutes(totalMinutes);
      });
    };

    if (breakdownsInDb.length > 0) calculateTotalBreakdownTime();
  }, [breakdownsInDb]);

  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="col-md-12">
            <Breadcrumb title="Reports / Breakdowns" />
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
                <p className="display-6 mb-4 text-white">Breakdowns</p>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="startDate"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Start date</Form.Label>
                      <Form.Control
                        type="date"
                        className="customInput"
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="endDate"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">End date</Form.Label>
                      <Form.Control
                        type="date"
                        className="customInput"
                        onChange={(e) => setEndDate(e.target.value)}
                      />
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

                    <Form.Group as={Col} className="d-flex align-items-end">
                      <button type="reset" className="customBtn customBtnPrint">
                        Reset
                      </button>
                    </Form.Group>
                  </Row>
                </Form>

                <hr className="custom-hr-yellow" />

                <div className="report-container">
                  {breakdownsInDb && (
                    <div className="summary-container">
                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p>Start date</p>
                        </div>
                        <div className="col-6">
                          <p className="fw-bold">{startDate || "-"}</p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p>End date</p>
                        </div>
                        <div className="col-6">
                          <p className="fw-bold">{endDate || "-"}</p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 d-flex justify-content-end">
                          <p>Total breakdown time</p>
                        </div>
                        <div className="col-6">
                          <p className="fw-bold">
                            {totalHours || 0}h {totalMinutes || 0}m
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="table-container">
                    {breakdownsInDb.length > 0 ? (
                      <Card body className="mb-2">
                        <BreakdownReportTable data={breakdownsInDb} />
                      </Card>
                    ) : (
                      <p className="text-center">No breakdowns found</p>
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

export default Breakdowns;
