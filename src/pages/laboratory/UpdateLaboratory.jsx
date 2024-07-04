import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
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

  const [validated, setValidated] = useState(false);
  const [data, setData] = useState({});
  const [rawMilkTaste, setRawMilkTaste] = useState(
    state.rawMilkTaste ? state.rawMilkTaste : false
  );
  const [rawMilkColor, setRawMilkColor] = useState(
    state.rawMilkColor ? state.rawMilkColor : false
  );
  const [rawMilkOdor, setRawMilkOdor] = useState(
    state.rawMilkOdor ? state.rawMilkOdor : false
  );
  const [mixMilkTaste, setMixMilkTaste] = useState(
    state.mixMilkTaste ? state.mixMilkTaste : false
  );
  const [mixMilkColor, setMixMilkColor] = useState(
    state.mixMilkColor ? state.mixMilkColor : false
  );
  const [mixMilkOdor, setMixMilkOdor] = useState(
    state.mixMilkOdor ? state.mixMilkOdor : false
  );
  const [isMixHaveIssue, setIsMixHaveIssue] = useState(
    state.isMixHaveIssue ? state.isMixHaveIssue : false
  );
  const [prevBatchData, setPrevBatchData] = useState({});
  const [isPowderHaveIssue, setIsPowderHaveIssue] = useState(
    state.isPowderHaveIssue ? state.isPowderHaveIssue : false
  );
  const [powderTaste, setPowderTaste] = useState(
    state.powderTaste ? state.powderTaste : false
  );
  const [powderColor, setPowderColor] = useState(
    state.powderColor ? state.powderColor : false
  );
  const [powderOdor, setPowderOdor] = useState(
    state.powderOdor ? state.powderOdor : false
  );
  const [powderSolubility, setPowderSolubility] = useState(
    state.powderSolubility ? state.powderSolubility : false
  );
  const [powderFreeFlowing, setPowderFreeFlowing] = useState(
    state.powderFreeFlowing ? state.powderFreeFlowing : false
  );
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { location } = useParams();

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({
      ...data,
      powderTaste,
      powderColor,
      powderOdor,
      powderSolubility,
      powderFreeFlowing,
      isPowderHaveIssue,
      status: "completed",
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(false);

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        Swal.fire({
          title: "Do you want to save the changes?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#0d1b2a",
          confirmButtonText: "Yes",
          cancelButtonColor: "#ff007f",
        }).then(async (result) => {
          if (result.isConfirmed) {
            setIsLoading(true);

            const docRef = doc(db, "lab_section", state.id);
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
              setIsLoading(false);
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
    const fetchPrevBatchData = async () => {
      try {
        const list = [];
        const q = query(
          collection(db, "lab_section"),
          where("date", "==", state.date),
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
  }, [state?.date, location]);

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
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
                        defaultValue={state.date}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="batchNumber"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Batch number</Form.Label>
                      <Form.Control
                        type="number"
                        disabled
                        className="customInput disabled"
                        defaultValue={state.batchNumber}
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
                        defaultValue={state.recipeName}
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
                        defaultValue={state.recipeType}
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
                        disabled={state.status !== "updated"}
                        className={`customInput ${
                          state.status !== "updated" && "disabled"
                        }`}
                        defaultValue={state.sampleInTime}
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
                        disabled={state.status !== "updated"}
                        className={`customInput ${
                          state.status !== "updated" && "disabled"
                        }`}
                        defaultValue={state.testStartTime}
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
                          step=".01"
                          disabled={state.status === "ongoing"}
                          defaultValue={state.rawMilkPh}
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
                          disabled={state.status === "ongoing"}
                          defaultValue={state.rawMilkTSS}
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
                          disabled={state.status === "ongoing"}
                          defaultValue={state.rawMilkFat}
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
                          disabled={state.status === "ongoing"}
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
                          disabled={state.status === "ongoing"}
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
                          disabled={state.status === "ongoing"}
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
                          step=".01"
                          disabled={state.status === "ongoing"}
                          defaultValue={state.mixMilkPh}
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
                          disabled={state.status === "ongoing"}
                          defaultValue={state.mixMilkTSS}
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
                          disabled={state.status === "ongoing"}
                          defaultValue={state.mixMilkFat}
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
                          disabled={state.status === "ongoing"}
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
                          disabled={state.status === "ongoing"}
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
                          disabled={state.status === "ongoing"}
                          label={mixMilkOdor === true ? "Good" : "Not good"}
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
                      controlId="isAnyIssue"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Any issue?</Form.Label>
                      <Form.Switch
                        type="switch"
                        id="mix_issue"
                        disabled={state.status === "ongoing"}
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
                            defaultValue={state.informedToAboutMix}
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
                            defaultValue={state.remarkAboutMixIssue}
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
                          disabled={state.status !== "updated"}
                          className="customInput"
                          defaultValue={state.expectedPowderQuantity}
                          onChange={handleChange}
                        />
                        <InputGroup.Text
                          id="addon"
                          style={{
                            borderTopRightRadius: "0.5rem",
                            borderBottomRightRadius: "0.5rem",
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
                      md="3"
                      controlId="milkPowderMoisture"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Moisture</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          aria-label="moisture"
                          aria-describedby="addon"
                          disabled={state.status === "ongoing"}
                          className="customInput"
                          step=".01"
                          defaultValue={state.milkPowderMoisture}
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
                      md="3"
                      controlId="milkPowderFat"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Fat</Form.Label>
                      <Form.Control
                        type="number"
                        disabled={state.status === "ongoing"}
                        className={`customInput ${
                          state.status !== "updated" && "disabled"
                        }`}
                        defaultValue={state.milkPowderFat}
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
                      md="3"
                      controlId="milkPowderFatLayer"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Fat layer</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          aria-label="fat layer"
                          aria-describedby="addon"
                          step=".01"
                          disabled={state.status === "ongoing"}
                          className="customInput"
                          defaultValue={state.milkPowderFatLayer}
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
                      controlId="milkPowderTime"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Time</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          aria-label="time"
                          aria-describedby="addon"
                          disabled={state.status === "ongoing"}
                          className="customInput"
                          defaultValue={state.milkPowderTime}
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
                      controlId="powderTaste"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Taste</Form.Label>
                      <Form.Switch
                        type="switch"
                        id="powder_taste"
                        disabled={state.status === "ongoing"}
                        label={powderTaste === true ? "Good" : "Not good"}
                        checked={powderTaste}
                        onChange={(e) => setPowderTaste(e.target.checked)}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="2"
                      xs="4"
                      controlId="powderColor"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Color</Form.Label>
                      <Form.Switch
                        type="switch"
                        id="powder_color"
                        disabled={state.status === "ongoing"}
                        label={powderColor === true ? "Good" : "Not good"}
                        checked={powderColor}
                        onChange={(e) => setPowderColor(e.target.checked)}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="2"
                      xs="4"
                      controlId="powderOdor"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Odor</Form.Label>
                      <Form.Switch
                        type="switch"
                        id="powder_odor"
                        disabled={state.status === "ongoing"}
                        label={powderOdor === true ? "Good" : "Not good"}
                        checked={powderOdor}
                        onChange={(e) => setPowderOdor(e.target.checked)}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="2"
                      xs="4"
                      controlId="powderSolubility"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Solubility</Form.Label>
                      <Form.Switch
                        type="switch"
                        id="powder_soluibilty"
                        disabled={state.status === "ongoing"}
                        label={powderSolubility === true ? "Good" : "Not good"}
                        checked={powderSolubility}
                        onChange={(e) => setPowderSolubility(e.target.checked)}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="2"
                      xs="5"
                      controlId="powderFreeFlowing"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Free flowing</Form.Label>
                      <Form.Switch
                        type="switch"
                        id="powder_free_flowing"
                        disabled={state.status === "ongoing"}
                        label={powderFreeFlowing === true ? "Good" : "Not good"}
                        checked={powderFreeFlowing}
                        onChange={(e) => setPowderFreeFlowing(e.target.checked)}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="bulkDensity"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Bulk density</Form.Label>
                      <Form.Control
                        type="number"
                        step=".01"
                        defaultValue={state.bulkDensity}
                        disabled={state.status === "ongoing"}
                        className={`customInput ${
                          state.status === "ongoing" && "disabled"
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
                      controlId="isAnyIssue"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Any issue?</Form.Label>
                      <Form.Switch
                        type="switch"
                        id="mix_issue"
                        disabled={state.status === "ongoing"}
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
                          controlId="informedToAboutPowder"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">
                            Informed to
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="customInput"
                            defaultValue={state.informedToAboutPowder}
                            onChange={handleChange}
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="12"
                          controlId="remarks"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">
                            Issue details
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            className="customInput"
                            defaultValue={state.remarks}
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
                      controlId="laboratoryTechnician"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Checked by</Form.Label>
                      <Form.Control
                        type="text"
                        disabled={state.status === "ongoing"}
                        className={`customInput ${
                          state.status === "ongoing" && "disabled"
                        }`}
                        defaultValue={state.laboratoryTechnician}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="8"
                      controlId="reasonForUpdate"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Reason for update
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        required={state.status !== "ongoing"}
                        className="customInput"
                        defaultValue={state.reasonForUpdate}
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
                        <p className="text-uppercase">Update</p>
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
