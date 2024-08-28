import { useState } from "react";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import html2pdf from "html2pdf.js";

import BackToTop from "../../components/backToTop/BackToTop";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import { db } from "../../config/firebase.config";
import DataPill from "../../components/dataPIll/DataPill";

const Verifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tCode, setTCode] = useState("");
  const [checkedList, setCheckedList] = useState([]);

  const currentDate = new Date().toDateString().split("T");

  const fetchVerifiedData = async () => {
    try {
      const q = query(
        collection(db, "verification_data"),
        where("tCode", "==", tCode),
        orderBy("added_at", "desc")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setCheckedList(doc.data().checkedList);
      });

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCheckedList([]);

    fetchVerifiedData();
  };

  const options = {
    margin: 10,
    filename: `${currentDate}-verification-document.pdf`,
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["css", "legacy"] },
  };

  const handleClick = () => {
    const element = document.getElementById("pdfContent");
    html2pdf().from(element).set(options).save();
  };

  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="col-md-12">
            <Breadcrumb title="Reports / Verifications" />
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
                <p className="display-6 mb-4 text-white">Verifications</p>

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
                        placeholder="eg: MPSnD"
                        className="customInput"
                        onChange={(e) => setTCode(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group as={Col} className="d-flex align-items-end">
                      <button type="submit" className="btn-submit customBtn">
                        {isLoading ? (
                          <div className="d-flex align-items-center gap-2">
                            <Spinner animation="border" size="sm" />
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
                  {checkedList.length > 0 ? (
                    <div className="summary-container">
                      <div className="row">
                        <div className="col d-flex justify-content-end">
                          <button
                            className="customBtn customBtnPrint"
                            onClick={handleClick}
                          >
                            Print
                          </button>
                        </div>
                      </div>

                      <div id="pdfContent">
                        <div className="row">
                          <div className="col-2">
                            <p>Date : </p>
                          </div>
                          <div className="col-10">
                            <p className="fw-bold">{currentDate}</p>
                          </div>

                          <div className="col-2">
                            <p>T code : </p>
                          </div>
                          <div className="col-10">
                            <p className="fw-bold">{tCode}</p>
                          </div>
                        </div>

                        <div className="row mt-5">
                          <div className="col-12">
                            <p className="fw-bold">Items : </p>
                          </div>
                          <div className="col-12">
                            <span>{<DataPill data={checkedList} />}</span>
                          </div>
                        </div>

                        <div className="row mt-5">
                          <div className="col">
                            <div className="d-flex justify-content-end">
                              <div className="text-center">
                                <p>..............................</p>
                                <p>Signature</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-white">No data found</p>
                  )}
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

export default Verifications;
