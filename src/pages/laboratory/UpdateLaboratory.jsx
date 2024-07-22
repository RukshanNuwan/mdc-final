import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Col, Figure, Form, InputGroup, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Spinner } from "react-bootstrap";

import { db } from "../../config/firebase.config";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";

const UpdateLaboratory = () => {
  const { state } = useLocation();

  const [data, setData] = useState({});
  const [rawMilkTaste, setRawMilkTaste] = useState(
    state.lab_row_taste ? state.lab_row_taste : false
  );
  const [rawMilkColor, setRawMilkColor] = useState(
    state.lab_row_color ? state.lab_row_color : false
  );
  const [rawMilkOdor, setRawMilkOdor] = useState(
    state.lab_row_odor ? state.lab_row_odor : false
  );
  const [mixMilkTaste, setMixMilkTaste] = useState(
    state.lab_mix_taste ? state.lab_mix_taste : false
  );
  const [mixMilkColor, setMixMilkColor] = useState(
    state.lab_mix_color ? state.lab_mix_color : false
  );
  const [mixMilkOdor, setMixMilkOdor] = useState(
    state.lab_mix_odor ? state.lab_mix_odor : false
  );
  const [isMixHaveIssue, setIsMixHaveIssue] = useState(
    state.lab_mix_issue ? state.lab_mix_issue : false
  );
  const [prevBatchData, setPrevBatchData] = useState({});
  const [isPowderHaveIssue, setIsPowderHaveIssue] = useState(
    state.lab_powder_issue ? state.lab_powder_issue : false
  );
  const [powderTaste, setPowderTaste] = useState(
    state.lab_powder_taste ? state.lab_powder_taste : false
  );
  const [powderColor, setPowderColor] = useState(
    state.lab_powder_color ? state.lab_powder_color : false
  );
  const [powderOdor, setPowderOdor] = useState(
    state.lab_powder_odor ? state.lab_powder_odor : false
  );
  const [powderSolubility, setPowderSolubility] = useState(
    state.lab_powder_solubility ? state.lab_powder_solubility : false
  );
  const [powderFreeFlowing, setPowderFreeFlowing] = useState(
    state.lab_powder_free_flowing ? state.lab_powder_free_flowing : false
  );
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { location } = useParams();

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({
      ...data,
      [id]: value,
      lab_status: "completed",
      lab_row_taste: rawMilkTaste,
      lab_row_color: rawMilkColor,
      lab_row_odor: rawMilkOdor,
      lab_mix_taste: mixMilkTaste,
      lab_mix_color: mixMilkColor,
      lab_mix_odor: mixMilkOdor,
      lab_powder_taste: powderTaste,
      lab_powder_color: powderColor,
      lab_powder_odor: powderOdor,
      lab_powder_solubility: powderSolubility,
      lab_powder_free_flowing: powderFreeFlowing,
      lab_powder_issue: isPowderHaveIssue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(false);

    try {
      Swal.fire({
        title: "Do you want to save the changes?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#ff007f",
        confirmButtonText: "Yes",
        cancelButtonColor: "#0d1b2a",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setIsLoading(true);

          const docRef = doc(db, "production_data", state.id);
          await updateDoc(docRef, {
            ...data,
            lab_updated_at: serverTimestamp(),
          }).then(() => {
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
    const fetchPrevBatchData = async () => {
      try {
        const list = [];
        const q = query(
          collection(db, "production_data"),
          where("date", "==", state.date),
          where("location", "==", location),
          where("lab_status", "==", "completed"),
          orderBy("lab_updated_at", "desc")
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
  }, [state?.date, location, state.batch_number]);

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
                        defaultValue={state.date}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="primary_batch_number"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Wet batch number
                      </Form.Label>
                      <Form.Control
                        type="number"
                        disabled
                        className="customInput disabled"
                        defaultValue={state.primary_batch_number}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="batch_number"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Batch number</Form.Label>
                      <Form.Control
                        type="number"
                        disabled
                        className="customInput disabled"
                        defaultValue={state.batch_number}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="batch_code"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Batch code</Form.Label>
                      <Form.Control
                        type="number"
                        disabled
                        className="customInput disabled"
                        defaultValue={state.batch_code}
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
                        defaultValue={state.order_name}
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
                        defaultValue={state.order_type}
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
                        disabled={state.lab_status !== "updated"}
                        className={`customInput ${
                          state.lab_status !== "updated" && "disabled"
                        }`}
                        defaultValue={state.lab_sample_in_time}
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
                        disabled={state.lab_status !== "updated"}
                        className={`customInput ${
                          state.lab_status !== "updated" && "disabled"
                        }`}
                        defaultValue={state.lab_test_start_time}
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
                          step=".01"
                          disabled={state.lab_status === "ongoing"}
                          defaultValue={state.lab_raw_ph}
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
                          disabled={state.lab_status === "ongoing"}
                          defaultValue={state.lab_raw_tss}
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
                          disabled={state.lab_status === "ongoing"}
                          defaultValue={state.lab_raw_fat}
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
                          disabled={state.lab_status === "ongoing"}
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
                          disabled={state.lab_status === "ongoing"}
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
                          disabled={state.lab_status === "ongoing"}
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
                          step=".01"
                          disabled={state.lab_status === "ongoing"}
                          defaultValue={state.lab_mix_ph}
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
                          disabled={state.lab_status === "ongoing"}
                          defaultValue={state.lab_mix_tss}
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
                          disabled={state.lab_status === "ongoing"}
                          defaultValue={state.lab_mix_fat}
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
                          disabled={state.lab_status === "ongoing"}
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
                          disabled={state.lab_status === "ongoing"}
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
                          disabled={state.lab_status === "ongoing"}
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
                        disabled={state.lab_status === "ongoing"}
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
                            defaultValue={state.lab_mix_issue_informed_to}
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
                            defaultValue={state.lab_mix_issue_details}
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
                          disabled={state.lab_status !== "updated"}
                          className="customInput"
                          defaultValue={state.expected_powder_quantity}
                          onChange={handleChange}
                        />
                        <InputGroup.Text
                          id="addon"
                          style={{
                            borderTopRightRadius: "0.25rem",
                            borderBottomRightRadius: "0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          kg
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Row>

                  <hr className="custom-hr-yellow" />

                  <Row>
                    <Form.Group
                      as={Col}
                      md="2"
                      controlId="lab_powder_ph"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Milk powder pH</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          disabled={state.lab_status === "ongoing"}
                          className="customInput"
                          step=".01"
                          defaultValue={state.lab_powder_ph}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="lab_powder_moisture"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Moisture</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          aria-label="moisture"
                          aria-describedby="addon"
                          disabled={state.lab_status === "ongoing"}
                          className="customInput"
                          step=".01"
                          defaultValue={state.lab_powder_moisture}
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
                          %
                        </InputGroup.Text>
                      </InputGroup>
                      <Figure.Caption className="tooltipText">
                        1-2
                      </Figure.Caption>
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="2"
                      controlId="lab_powder_fat"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Fat</Form.Label>
                      <Form.Control
                        type="number"
                        disabled={state.lab_status === "ongoing"}
                        className={`customInput ${
                          state.lab_status === "ongoing" && "disabled"
                        }`}
                        defaultValue={state.lab_powder_fat}
                        onChange={handleChange}
                      />
                      <Figure.Caption className="tooltipText">
                        Organic - (50-55)
                      </Figure.Caption>
                      <Figure.Caption className="tooltipText">
                        Conventional - (60-65)
                      </Figure.Caption>
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="2"
                      controlId="lab_powder_fat_layer"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Fat layer</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          aria-label="fat layer"
                          aria-describedby="addon"
                          step=".01"
                          disabled={state.lab_status === "ongoing"}
                          className="customInput"
                          defaultValue={state.lab_powder_fat_layer}
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
                          cm
                        </InputGroup.Text>
                      </InputGroup>
                      <Figure.Caption className="tooltipText">
                        Organic - 0.8
                      </Figure.Caption>
                      <Figure.Caption className="tooltipText">
                        Conventional - 1.5
                      </Figure.Caption>
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="lab_powder_fat_layer_time"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Time</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          aria-label="time"
                          aria-describedby="addon"
                          disabled={state.lab_status === "ongoing"}
                          className="customInput"
                          defaultValue={state.lab_powder_fat_layer_time}
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
                          min
                        </InputGroup.Text>
                      </InputGroup>
                      <Figure.Caption className="tooltipText">
                        20min
                      </Figure.Caption>
                    </Form.Group>
                  </Row>

                  <Row className="d-flex justify-content-around toggleButtonWrapper">
                    <Form.Group
                      as={Col}
                      md="2"
                      xs="4"
                      controlId="lab_powder_taste"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Taste</Form.Label>
                      <Form.Switch
                        type="switch"
                        id="lab_powder_taste"
                        disabled={state.lab_status === "ongoing"}
                        checked={powderTaste}
                        onChange={(e) => setPowderTaste(e.target.checked)}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="2"
                      xs="4"
                      controlId="lab_powder_color"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Color</Form.Label>
                      <Form.Switch
                        type="switch"
                        id="lab_powder_color"
                        disabled={state.lab_status === "ongoing"}
                        checked={powderColor}
                        onChange={(e) => setPowderColor(e.target.checked)}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="2"
                      xs="4"
                      controlId="lab_powder_odor"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Odor</Form.Label>
                      <Form.Switch
                        type="switch"
                        id="lab_powder_odor"
                        disabled={state.lab_status === "ongoing"}
                        checked={powderOdor}
                        onChange={(e) => setPowderOdor(e.target.checked)}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="2"
                      xs="4"
                      controlId="lab_powder_solubility"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Solubility</Form.Label>
                      <Form.Switch
                        type="switch"
                        id="lab_powder_solubility"
                        disabled={state.lab_status === "ongoing"}
                        checked={powderSolubility}
                        onChange={(e) => setPowderSolubility(e.target.checked)}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="2"
                      xs="5"
                      controlId="lab_powder_free_flowing"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Free flowing</Form.Label>
                      <Form.Switch
                        type="switch"
                        id="lab_powder_free_flowing"
                        disabled={state.lab_status === "ongoing"}
                        checked={powderFreeFlowing}
                        onChange={(e) => setPowderFreeFlowing(e.target.checked)}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="lab_powder_bulk_density"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Bulk density</Form.Label>
                      <Form.Control
                        type="number"
                        step=".01"
                        defaultValue={state.lab_powder_bulk_density}
                        disabled={state.lab_status === "ongoing"}
                        className={`customInput ${
                          state.lab_status === "ongoing" && "disabled"
                        }`}
                        onChange={handleChange}
                      />
                      <Figure.Caption className="tooltipText">
                        Organic - (0.4-0.45)
                      </Figure.Caption>
                      <Figure.Caption className="tooltipText">
                        Conventional - (0.3-0.35)
                      </Figure.Caption>
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      xs="4"
                      controlId="lab_powder_issue"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Any issue?</Form.Label>
                      <Form.Switch
                        type="switch"
                        id="lab_powder_issue"
                        disabled={state.lab_status === "ongoing"}
                        label={isPowderHaveIssue === true ? "Yes" : "No"}
                        checked={isPowderHaveIssue}
                        onChange={(e) => setIsPowderHaveIssue(e.target.checked)}
                      />
                    </Form.Group>

                    {isPowderHaveIssue && (
                      <>
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="lab_powder_issue_informed_to"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">
                            Informed to
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="customInput"
                            defaultValue={state.lab_powder_issue_informed_to}
                            onChange={handleChange}
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="12"
                          controlId="lab_powder_issue_details"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">
                            Issue details
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            className="customInput"
                            defaultValue={state.lab_powder_issue_details}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </>
                    )}
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="lab_technician_name"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Checked by</Form.Label>
                      <Form.Control
                        type="text"
                        disabled={state.lab_status === "ongoing"}
                        className={`customInput ${
                          state.lab_status === "ongoing" && "disabled"
                        }`}
                        defaultValue={state.lab_technician_name}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="8"
                      controlId="lab_reason_for_update"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Reason for update
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        required={state.lab_status !== "ongoing"}
                        className="customInput"
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Row>

                  <div className="mt-5">
                    <button
                      type="submit"
                      className="btn-submit customBtn customBtnUpdate"
                      disabled={isLoading}
                    >
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        {isLoading && <Spinner animation="border" size="sm" />}
                        <p>Update</p>
                      </div>
                    </button>

                    <button type="reset" className="customBtn customClearBtn">
                      Clear
                    </button>
                  </div>
                </Form>
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

export default UpdateLaboratory;
