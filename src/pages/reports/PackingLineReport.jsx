import { useState } from "react";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import PackingLineReportTable from "../../components/dataTable/PackingLineReportTable";
import { db } from "../../config/firebase.config";

const PackingLineReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tCode, setTCode] = useState("");
  const [sdCode, setSdCode] = useState("");
  const [packingDate, setPackingDate] = useState();
  const [packingData, setPackingData] = useState([]);

  const fetchPackingData = async () => {
    setPackingData([]);

    try {
      const list = [];
      const q = query(
        collection(db, "packing_line_data"),
        where("packing_packing_batch_code", "==", tCode),
        where("packing_line_date", "==", packingDate),
        orderBy("packing_line_added_at", "asc")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) list.push({ id: doc.id, ...doc.data() });
      });

      setPackingData(list);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPackingDataByTCode = async () => {
    setPackingData([]);

    try {
      const list = [];
      const q = query(
        collection(db, "packing_line_data"),
        where("packing_packing_batch_code", "==", tCode),
        orderBy("packing_line_added_at", "asc")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) list.push({ id: doc.id, ...doc.data() });
      });

      setPackingData(list);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPackingDataBySdCode = async () => {
    setPackingData([]);

    try {
      const list = [];
      const q = query(
        collection(db, "packing_line_data"),
        where("production_batch_code", "==", sdCode),
        orderBy("packing_line_added_at", "asc")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) list.push({ id: doc.id, ...doc.data() });
      });

      setPackingData(list);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (tCode && packingDate) fetchPackingData();
    if (tCode && !packingDate) fetchPackingDataByTCode();
    if (sdCode && !packingDate && !tCode) fetchPackingDataBySdCode();
  };

  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
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
                <p className="display-6 mb-4 text-white">Packing line</p>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="tCode"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">T code</Form.Label>
                      <Form.Control
                        type="text"
                        className="customInput"
                        onChange={(e) => setTCode(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="sdCode"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">SD batch code</Form.Label>
                      <Form.Control
                        type="text"
                        required
                        className="customInput"
                        onChange={(e) => setSdCode(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="packingDate"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Packing date</Form.Label>
                      <Form.Control
                        type="date"
                        className="customInput"
                        onChange={(e) => setPackingDate(e.target.value)}
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
                  </Row>
                </Form>

                <hr className="custom-hr-yellow" />

                <div className="report-container">
                  <div className="table-container">
                    {packingData?.length > 0 ? (
                      <Card body className="mb-2">
                        <PackingLineReportTable
                          packingData={packingData}
                          packingDate={packingDate}
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
    </>
  );
};

export default PackingLineReport;
