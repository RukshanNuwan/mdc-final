import { useState } from "react";
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

const Breakdowns = () => {
  const [date, setDate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [breakdownsInDb, setBreakdownsInDb] = useState([]);

  const fetchBreakdownsByDate = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "breakdowns"),
        where("breakdown_date", "==", date),
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

  console.log("breakdownsInDb -> ", breakdownsInDb);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (date) fetchBreakdownsByDate().then(() => setIsLoading(false));
  };

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
                        onChange={(e) => setLocation(e.target.value)}
                      >
                        <option>Select location</option>
                        <option value="mdc">SD - 03</option>
                        <option value="araliya_kele">SD - 04</option>
                      </Form.Select>
                    </Form.Group> */}

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
