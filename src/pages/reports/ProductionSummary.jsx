import { useState } from "react";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Card, Col, Form, Row, Spinner } from "react-bootstrap";

import BackToTop from "../../components/backToTop/BackToTop";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import ProductionSummaryTable from "../../components/dataTable/ProductionSummaryTable";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../config/firebase.config";

const ProductionSummary = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [productionData, setProductionData] = useState([]);
  const [dailyProductionData, setDailyProductionData] = useState([]);

  const fetchProductionDataByDateRange = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "production_data"),
        where("date", ">=", startDate),
        where("date", "<=", endDate),
        orderBy("wet_added_at", "desc")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) list.push({ id: doc.id, ...doc.data() });
      });

      setProductionData(list);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDailyProductionDataByDateRange = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "daily_production"),
        where("date", ">=", startDate),
        where("date", "<=", endDate),
        orderBy("timeStamp", "desc")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) list.push({ id: doc.id, ...doc.data() });
      });
      setDailyProductionData(list);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (startDate && endDate) {
      fetchProductionDataByDateRange().then(() => setIsLoading(false));
      fetchDailyProductionDataByDateRange().then(() => setIsLoading(false));
    }
    if (!startDate && !endDate) setIsLoading(false);
  };

  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="col-md-12">
            <Breadcrumb title="Reports / Production summary" />
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
                <p className="display-6 mb-4 text-white">Production summary</p>

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
                      ></Form.Control>
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
                  <div className="table-container">
                    {productionData.length > 0 ? (
                      <Card body className="mb-2">
                        <ProductionSummaryTable
                          productionData={productionData}
                          dailyProductionData={dailyProductionData}
                          startDate={startDate}
                          endDate={endDate}
                        />
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

export default ProductionSummary;
