import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Swal from "sweetalert2";
import InputGroup from "react-bootstrap/InputGroup";
import { Figure, Spinner } from "react-bootstrap";

import "../common.css";
import BackToTop from "../../components/backToTop/BackToTop";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import { db } from "../../config/firebase.config";
import ErrorMessage from "../../components/errorMessage/ErrorMessage";

const NewLaboratory = () => {
  const [data, setData] = useState({});
  const [rawMilkTaste, setRawMilkTaste] = useState(true);
  const [rawMilkColor, setRawMilkColor] = useState(true);
  const [rawMilkOdor, setRawMilkOdor] = useState(true);
  const [mixMilkTaste, setMixMilkTaste] = useState(true);
  const [mixMilkColor, setMixMilkColor] = useState(true);
  const [mixMilkOdor, setMixMilkOdor] = useState(true);
  const [ongoingData, setOngoingData] = useState({});
  const [isMixHaveIssue, setIsMixHaveIssue] = useState(false);
  const [prevBatchData, setPrevBatchData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { location } = useParams();

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({
      ...data,
      [id]: value,
      lab_status: "updated",
      lab_row_taste: rawMilkTaste,
      lab_row_color: rawMilkColor,
      lab_row_odor: rawMilkOdor,
      lab_mix_taste: mixMilkTaste,
      lab_mix_color: mixMilkColor,
      lab_mix_odor: mixMilkOdor,
      lab_mix_issue: isMixHaveIssue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(false);

    const confirmData = `Sample in time: ${data?.lab_sample_in_time} | Test start time: ${data?.lab_test_start_time} | Raw milk pH: ${data?.lab_raw_ph} | Raw milk TSS: ${data?.lab_raw_tss} | Raw milk fat: ${data?.lab_raw_fat} | Mix milk pH: ${data?.lab_mix_ph} | Mix milk TSS: ${data?.lab_mix_tss} | Mix milk fat: ${data?.lab_mix_fat} | Expected powder quantity: ${data?.expected_powder_quantity}`;

    try {
      Swal.fire({
        title: "Do you want to save the changes?",
        text: confirmData,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#ff007f",
        confirmButtonText: "Yes",
        cancelButtonColor: "#0d1b2a",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setIsLoading(true);

          const docRef = doc(db, "production_data", ongoingData.id);
          await updateDoc(docRef, { ...data }).then(() => {
            Swal.fire({
              title: "Changes saved",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });

            e.target.reset();
            setIsLoading(false);
            navigate(`/lab-section/${location}`);
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCurrentBatchData = async () => {
      try {
        const list = [];
        const q = query(
          collection(db, "production_data"),
          where("lab_status", "==", "ongoing"),
          where("location", "==", location),
          orderBy("lab_added_at", "asc")
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        let res = list.filter((doc) => doc);
        setOngoingData(res[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurrentBatchData();
  }, [location]);

  useEffect(() => {
    const fetchPrevBatchData = async () => {
      if (ongoingData.date) {
        try {
          const list = [];
          const q = query(
            collection(db, "production_data"),
            where("date", "==", ongoingData.date),
            where("location", "==", location),
            where("lab_status", "==", "updated"),
            orderBy("lab_added_at", "desc")
          );

          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });

          let res = list.filter((doc) => doc);
          setPrevBatchData(res[0]);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchPrevBatchData();
  }, [ongoingData?.date, location, ongoingData?.batch_number]);

  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="col-md-12">
            <Breadcrumb
              title={`${location === "mdc" ? "SD 03" : "SD 04"} / Laboratory`}
            />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="mb-2">
                <Link
                  to="/lab-section"
                  className="d-flex align-items-center customBackBtn"
                >
                  <ArrowBackIosIcon fontSize="small" /> Back
                </Link>
              </div>

              <div className="card-body formWrapper">
                {ongoingData && ongoingData?.location === location ? (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="date"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">Date</Form.Label>
                        <Form.Control
                          type="date"
                          disabled
                          className="customInput disabled"
                          defaultValue={ongoingData?.date}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="primary_batch_number"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          W batch number
                        </Form.Label>
                        <Form.Control
                          type="number"
                          disabled
                          className="customInput disabled"
                          defaultValue={ongoingData?.primary_batch_number}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="batch_number"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          SD batch number
                        </Form.Label>
                        <Form.Control
                          type="number"
                          disabled
                          className="customInput disabled"
                          defaultValue={ongoingData?.batch_number}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="batch_code"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">SD batch code</Form.Label>
                        <Form.Control
                          type="text"
                          disabled
                          className="customInput disabled"
                          defaultValue={ongoingData?.batch_code}
                        />
                      </Form.Group>
                    </Row>

                    <Row>
                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="order_name"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">Order name</Form.Label>
                        <Form.Control
                          type="text"
                          disabled
                          className="customInput text-capitalize disabled"
                          defaultValue={ongoingData?.order_name}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="order_type"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">Order type</Form.Label>
                        <Form.Control
                          disabled
                          className="customInput text-capitalize disabled"
                          defaultValue={ongoingData?.order_type}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="lab_sample_in_time"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          Sample in time
                        </Form.Label>
                        <Form.Control
                          type="time"
                          required
                          className="customInput"
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="lab_test_start_time"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          Test start time
                        </Form.Label>
                        <Form.Control
                          type="time"
                          required
                          className="customInput"
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Row>

                    <div
                      className="p-3 mb-3"
                      style={{
                        width: "auto",
                        backgroundColor: "#ffd800",
                        borderRadius: "0.25rem",
                      }}
                    >
                      <span className="sectionTitle sectionTitlePink text-uppercase">
                        Raw milk
                      </span>

                      <Row className="mt-3">
                        <Form.Group
                          as={Col}
                          md="2"
                          xs="4"
                          controlId="lab_raw_ph"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold d-flex justify-content-between textDarkBlue">
                            <p>pH value</p>
                            <p className="text-primary">
                              {prevBatchData && prevBatchData?.lab_raw_ph}
                            </p>
                          </Form.Label>

                          <Form.Control
                            type="number"
                            required
                            step=".01"
                            onChange={handleChange}
                          />
                          <Figure.Caption className="tooltipTextPink">
                            5.7-5.9
                          </Figure.Caption>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="2"
                          xs="4"
                          controlId="lab_raw_tss"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold d-flex justify-content-between textDarkBlue">
                            <p>TSS</p>
                            <p className="text-primary">
                              {prevBatchData && prevBatchData?.lab_raw_tss}
                            </p>
                          </Form.Label>

                          <Form.Control
                            type="number"
                            step=".01"
                            onChange={handleChange}
                          />
                          <Figure.Caption className="tooltipTextPink">
                            (42-50)%
                          </Figure.Caption>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="2"
                          xs="4"
                          controlId="lab_raw_fat"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold d-flex justify-content-between textDarkBlue">
                            <p>Fat</p>
                            <p className="text-primary">
                              {prevBatchData && prevBatchData?.lab_raw_fat}
                            </p>
                          </Form.Label>

                          <Form.Control
                            type="number"
                            required
                            onChange={handleChange}
                          />
                          <Figure.Caption className="tooltipTextPink">
                            33-34
                          </Figure.Caption>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="2"
                          xs="4"
                          controlId="lab_row_taste"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold textDarkBlue">
                            Taste
                          </Form.Label>
                          <Form.Switch
                            type="switch"
                            id="lab_row_taste"
                            checked={rawMilkTaste}
                            onChange={(e) => setRawMilkTaste(e.target.checked)}
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="2"
                          xs="4"
                          controlId="lab_row_color"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold textDarkBlue">
                            Color
                          </Form.Label>
                          <Form.Switch
                            type="switch"
                            id="lab_row_color"
                            checked={rawMilkColor}
                            onChange={(e) => setRawMilkColor(e.target.checked)}
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="2"
                          xs="4"
                          controlId="lab_row_odor"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold textDarkBlue">
                            Odor
                          </Form.Label>
                          <Form.Switch
                            type="switch"
                            id="lab_row_odor"
                            checked={rawMilkOdor}
                            onChange={(e) => setRawMilkOdor(e.target.checked)}
                          />
                        </Form.Group>
                      </Row>

                      <hr className="custom-hr-blue" />

                      <span className="sectionTitle sectionTitlePink text-uppercase">
                        Mix milk
                      </span>
                      <Row className="mt-3">
                        <Form.Group
                          as={Col}
                          md="2"
                          xs="4"
                          controlId="lab_mix_ph"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold d-flex justify-content-between textDarkBlue">
                            <p>pH value</p>
                            <p className="text-primary">
                              {prevBatchData && prevBatchData?.lab_mix_ph}
                            </p>
                          </Form.Label>

                          <Form.Control
                            type="number"
                            required
                            step=".01"
                            onChange={handleChange}
                          />
                          <Figure.Caption className="tooltipTextPink">
                            (6.2-6.5)
                          </Figure.Caption>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="2"
                          xs="4"
                          controlId="lab_mix_tss"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold d-flex justify-content-between textDarkBlue">
                            <p>TSS</p>
                            <p className="text-primary">
                              {prevBatchData && prevBatchData?.lab_mix_tss}
                            </p>
                          </Form.Label>

                          <Form.Control
                            type="number"
                            step=".01"
                            onChange={handleChange}
                          />
                          <Figure.Caption className="tooltipTextPink">
                            (52-58)%
                          </Figure.Caption>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="2"
                          xs="4"
                          controlId="lab_mix_fat"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold d-flex justify-content-between textDarkBlue">
                            <p>Fat</p>
                            <p className="text-primary">
                              {prevBatchData && prevBatchData?.lab_mix_fat}
                            </p>
                          </Form.Label>

                          <Form.Control
                            type="number"
                            required
                            onChange={handleChange}
                          />
                          <Figure.Caption className="tooltipTextPink">
                            Organic - (28-29)
                          </Figure.Caption>

                          <Figure.Caption className="tooltipTextPink">
                            Conventional - (33-34)
                          </Figure.Caption>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="2"
                          xs="4"
                          controlId="lab_mix_taste"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold textDarkBlue">
                            Taste
                          </Form.Label>
                          <Form.Switch
                            type="switch"
                            id="lab_mix_taste"
                            checked={mixMilkTaste}
                            onChange={(e) => setMixMilkTaste(e.target.checked)}
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="2"
                          xs="4"
                          controlId="lab_mix_color"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold textDarkBlue">
                            Color
                          </Form.Label>
                          <Form.Switch
                            type="switch"
                            id="lab_mix_color"
                            checked={mixMilkColor}
                            onChange={(e) => setMixMilkColor(e.target.checked)}
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="2"
                          xs="4"
                          controlId="lab_mix_odor"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold textDarkBlue">
                            Odor
                          </Form.Label>
                          <Form.Switch
                            type="switch"
                            id="lab_mix_odor"
                            checked={mixMilkOdor}
                            onChange={(e) => setMixMilkOdor(e.target.checked)}
                          />
                        </Form.Group>
                      </Row>
                    </div>

                    <Row>
                      <Form.Group
                        as={Col}
                        md="4"
                        xs="4"
                        controlId="lab_mix_issue"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">Any issue?</Form.Label>
                        <Form.Switch
                          type="switch"
                          id="lab_mix_issue"
                          label={isMixHaveIssue === true ? "Yes" : "No"}
                          checked={isMixHaveIssue}
                          onChange={(e) => setIsMixHaveIssue(e.target.checked)}
                        />
                      </Form.Group>

                      {isMixHaveIssue && (
                        <>
                          <Form.Group
                            as={Col}
                            md="4"
                            controlId="lab_mix_issue_informed_to"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Informed to
                            </Form.Label>
                            <Form.Control
                              type="text"
                              className="customInput"
                              onChange={handleChange}
                            />
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            md="4"
                            controlId="lab_mix_issue_details"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Issue details
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              className="customInput"
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </>
                      )}

                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="expected_powder_quantity"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          Expected powder quantity
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="number"
                            aria-label="expected powder quantity"
                            aria-describedby="addon"
                            required
                            className="customInput"
                            onChange={handleChange}
                          />
                          <InputGroup.Text
                            id="addon"
                            style={{
                              borderTopRightRadius: "0.25rem",
                              borderBottomRightRadius: "0.25rem",
                              color: "#0d1b2a",
                            }}
                          >
                            Kg
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>
                    </Row>

                    <div className="mt-5">
                      <button
                        type="submit"
                        className="btn-submit customBtn"
                        disabled={isLoading}
                      >
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          {isLoading && (
                            <Spinner animation="border" size="sm" />
                          )}
                          <p>Continue</p>
                        </div>
                      </button>

                      <button type="reset" className="customBtn customClearBtn">
                        Clear
                      </button>
                    </div>
                  </Form>
                ) : (
                  <ErrorMessage />
                )}
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

export default NewLaboratory;
