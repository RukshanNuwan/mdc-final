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

import "../common.css";
import BackToTop from "../../components/backToTop/BackToTop";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import InputGroup from "react-bootstrap/InputGroup";
import { db } from "../../config/firebase.config";
import ErrorMessage from "../../components/errorMessage/ErrorMessage";
import { Figure } from "react-bootstrap";

const NewLaboratory = () => {
  const [validated, setValidated] = useState(false);
  const [data, setData] = useState({});
  const [rawMilkTaste, setRawMilkTaste] = useState(true);
  const [rawMilkColor, setRawMilkColor] = useState(true);
  const [rawMilkOdor, setRawMilkOdor] = useState(true);
  const [mixMilkTaste, setMixMilkTaste] = useState(true);
  const [mixMilkColor, setMixMilkColor] = useState(true);
  const [mixMilkOdor, setMixMilkOdor] = useState(true);
  const [batchNumberData, setBatchNumberData] = useState({});
  const [isMixHaveIssue, setIsMixHaveIssue] = useState(false);
  const [prevBatchData, setPrevBatchData] = useState({});

  const navigate = useNavigate();
  const { location } = useParams();

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({
      ...data,
      rawMilkTaste,
      rawMilkColor,
      rawMilkOdor,
      mixMilkTaste,
      mixMilkColor,
      mixMilkOdor,
      isMixHaveIssue,
      status: "updated",
      sectionName: "lab",
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmData = `Sample in time: ${data?.sampleInTime} | Test start time: ${data?.testStartTime} | Raw milk pH: ${data?.rawMilkPh} | Raw milk TSS: ${data?.rawMilkTSS} | Raw milk fat: ${data?.rawMilkFat} | Mix milk pH: ${data?.mixMilkPh} | Mix milk TSS: ${data?.mixMilkTSS} | Mix milk fat: ${data?.mixMilkFat} | Expected powder quantity: ${data?.expectedPowderQuantity}`;

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        Swal.fire({
          title: "Do you want to save the changes?",
          text: confirmData,
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#0d1b2a",
          confirmButtonText: "Yes",
          cancelButtonColor: "#ff007f",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const docRef = doc(db, "lab_section", batchNumberData.id);
            await updateDoc(docRef, {
              ...data,
            }).then(() => {
              Swal.fire({
                title: "Changes saved",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              });

              e.target.reset();
              navigate(`/lab-section/${location}`);
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    }

    setValidated(true);
  };

  useEffect(() => {
    const fetchCurrentBatchData = async () => {
      try {
        const list = [];
        const q = query(
          collection(db, "lab_section"),
          where("status", "==", "ongoing"),
          where("location", "==", location),
          orderBy("timeStamp", "asc")
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        let res = list.filter((doc) => doc);
        setBatchNumberData(res[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurrentBatchData();
  }, [location]);

  useEffect(() => {
    const fetchPrevBatchData = async () => {
      try {
        const list = [];
        const q = query(
          collection(db, "lab_section"),
          where("date", "==", batchNumberData.date),
          where("location", "==", location),
          where("status", "==", "updated"),
          orderBy("timeStamp", "asc")
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
    };

    fetchPrevBatchData();
  }, [batchNumberData?.date, location]);

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
                {batchNumberData &&
                !batchNumberData.rawMilkColor &&
                batchNumberData?.location === location ? (
                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                  >
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
                          disabled
                          className="customInput disabled"
                          defaultValue={batchNumberData.date}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="batchNumber"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          Batch number
                        </Form.Label>
                        <Form.Control
                          type="number"
                          disabled
                          className="customInput disabled"
                          defaultValue={batchNumberData.batchNumber}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="recipeName"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">Recipe name</Form.Label>
                        <Form.Control
                          type="text"
                          disabled
                          className="customInput text-capitalize disabled"
                          defaultValue={batchNumberData.recipeName}
                        />
                      </Form.Group>
                    </Row>

                    <Row>
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="type"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">Recipe type</Form.Label>
                        <Form.Control
                          disabled
                          className="customInput text-capitalize disabled"
                          defaultValue={batchNumberData.recipeType}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="sampleInTime"
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
                        md="4"
                        controlId="testStartTime"
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
                          controlId="rawMilkPh"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold d-flex justify-content-between textDarkBlue">
                            <p>pH value</p>
                            <p className="text-primary">
                              {prevBatchData && prevBatchData?.rawMilkPh}
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
                          controlId="rawMilkTSS"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold d-flex justify-content-between textDarkBlue">
                            <p>TSS</p>
                            <p className="text-primary">
                              {prevBatchData && prevBatchData?.rawMilkTSS}
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
                          controlId="rawMilkFat"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold d-flex justify-content-between textDarkBlue">
                            <p>Fat</p>
                            <p className="text-primary">
                              {prevBatchData && prevBatchData?.rawMilkFat}
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
                          controlId="rawMilkTaste"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold textDarkBlue">
                            Taste
                          </Form.Label>
                          <Form.Switch
                            type="switch"
                            id="raw_milk_taste"
                            label={rawMilkTaste === true ? "Good" : "Not good"}
                            checked={rawMilkTaste}
                            onChange={(e) => setRawMilkTaste(e.target.checked)}
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="2"
                          xs="4"
                          controlId="rawMilkColor"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold textDarkBlue">
                            Color
                          </Form.Label>
                          <Form.Switch
                            type="switch"
                            id="raw_milk_color"
                            label={rawMilkColor === true ? "Good" : "Not good"}
                            checked={rawMilkColor}
                            onChange={(e) => setRawMilkColor(e.target.checked)}
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="2"
                          xs="4"
                          controlId="rawMilkOdor"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold textDarkBlue">
                            Odor
                          </Form.Label>
                          <Form.Switch
                            type="switch"
                            id="raw_milk_odor"
                            label={rawMilkOdor === true ? "Good" : "Not good"}
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
                          controlId="mixMilkPh"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold d-flex justify-content-between textDarkBlue">
                            <p>pH value</p>
                            <p className="text-primary">
                              {prevBatchData && prevBatchData?.mixMilkPh}
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
                          controlId="mixMilkTSS"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold d-flex justify-content-between textDarkBlue">
                            <p>TSS</p>
                            <p className="text-primary">
                              {prevBatchData && prevBatchData?.mixMilkTSS}
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
                          controlId="mixMilkFat"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold d-flex justify-content-between textDarkBlue">
                            <p>Fat</p>
                            <p className="text-primary">
                              {prevBatchData && prevBatchData?.rawMilkFat}
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
                          controlId="mixMilkTaste"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold textDarkBlue">
                            Taste
                          </Form.Label>
                          <Form.Switch
                            type="switch"
                            id="mix_milk_taste"
                            label={mixMilkTaste === true ? "Good" : "Not good"}
                            checked={mixMilkTaste}
                            onChange={(e) => setMixMilkTaste(e.target.checked)}
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="2"
                          xs="4"
                          controlId="mixMilkColor"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold textDarkBlue">
                            Color
                          </Form.Label>
                          <Form.Switch
                            type="switch"
                            id="mix_milk_color"
                            label={mixMilkColor === true ? "Good" : "Not good"}
                            checked={mixMilkColor}
                            onChange={(e) => setMixMilkColor(e.target.checked)}
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="2"
                          xs="4"
                          controlId="mixMilkOdor"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold textDarkBlue">
                            Odor
                          </Form.Label>
                          <Form.Switch
                            type="switch"
                            id="mix_milk_odor"
                            label={mixMilkOdor === true ? "Good" : "Not good"}
                            checked={mixMilkOdor}
                            onChange={(e) => setMixMilkOdor(e.target.checked)}
                          />
                        </Form.Group>
                      </Row>
                    </div>

                    <Row className="mb-5">
                      <Form.Group
                        as={Col}
                        md="4"
                        xs="4"
                        controlId="isAnyIssue"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">Any issue?</Form.Label>
                        <Form.Switch
                          type="switch"
                          id="mix_issue"
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
                            controlId="informedToAboutMix"
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
                            controlId="remarkAboutMixIssue"
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
                        controlId="expectedPowderQuantity"
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
                            kg
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>
                    </Row>

                    <div className="mt-5">
                      <button type="submit" className="btn-submit customBtn">
                        Continue
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
