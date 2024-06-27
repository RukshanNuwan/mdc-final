import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CheckIcon from "@mui/icons-material/Check";
import { Col, Figure, Form, InputGroup, Row } from "react-bootstrap";

import { db } from "../../config/firebase.config";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";

const UpdateMixing = () => {
  const { state } = useLocation();

  const [data, setData] = useState({});
  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();
  const { location } = useParams();

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({
      ...data,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        Swal.fire({
          title: "Do you want to save the changes?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#415f91",
          confirmButtonText: "Yes",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const docRef = doc(db, "mixing_section", state.id);
            await updateDoc(docRef, {
              ...data,
            })
              .then(() => {
                Swal.fire({
                  title: "Changes saved",
                  icon: "success",
                  showConfirmButton: false,
                  timer: 1500,
                });

                e.target.reset();
                navigate(`/mixing-section/${location}`);
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
      } catch (error) {
        console.log(error);
      }
    }

    setValidated(true);
  };

  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="col-md-12">
            <Breadcrumb
              title={`${
                location === "mdc" ? "MDC" : "Araliya Kele"
              } / Mixing Section / Update`}
            />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="mb-2">
                <Link
                  to={`/mixing-section/${location}`}
                  className="d-flex align-items-center customClearBtn"
                >
                  <ArrowBackIosIcon fontSize="small" /> Back
                </Link>
              </div>

              <div className="card-body formWrapper">
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
                        value={state.date}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="batchNumber"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Wet batch number
                      </Form.Label>
                      <Form.Control
                        type="number"
                        disabled
                        min={1}
                        value={state.wet_batch_number}
                        className="customInput disabled"
                      />
                    </Form.Group>

                    {/* TODO: Choose the spray dryer (2 or 3) from dropdown */}

                    <Form.Group
                      as={Col}
                      md="3"
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
                      md="3"
                      controlId="rawMilkInTime"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Raw milk in time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        disabled
                        className="customInput disabled"
                        value={state.rawMilkInTime}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="recipeName"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Order name</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={state.recipeName}
                        disabled
                        className="customInput disabled"
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="type"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Order type</Form.Label>
                      <Form.Select
                        defaultValue={state.recipeType}
                        disabled
                        className="customInput disabled"
                      >
                        <option value="conventional">
                          Conventional Recipe
                        </option>
                        <option value="organic">Organic Recipe</option>
                      </Form.Select>
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="milkQuantity"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Milk quantity</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          aria-label="milk quantity"
                          aria-describedby="addon"
                          disabled
                          className="customInput"
                          value={state.milkQuantity}
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

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="milkRecovery"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Milk recovery</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          aria-label="milk recovery"
                          aria-describedby="addon"
                          disabled
                          className="customInput"
                          value={state.milkRecovery}
                        />
                        <InputGroup.Text
                          id="addon"
                          style={{
                            borderTopRightRadius: "0.5rem",
                            borderBottomRightRadius: "0.5rem",
                            fontWeight: "bold",
                          }}
                        >
                          %
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="additionalCratesCount"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Additional crates count
                      </Form.Label>
                      <Form.Control
                        type="number"
                        defaultValue={state.additionalCratesCount}
                        disabled
                        className="customInput disabled"
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="isInformedToCutter"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Is informed</Form.Label>

                      <Form.Switch
                        type="switch"
                        id="is_informed"
                        label={
                          state.isInformed === true
                            ? "Informed"
                            : "Not informed"
                        }
                        checked={state.isInformed}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="informedTo"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Informed to</Form.Label>
                      <Form.Control
                        type="text"
                        disabled
                        className="customInput disabled"
                        defaultValue={
                          state?.informedTo ? state?.informedTo : "-"
                        }
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="mixingTankInTime"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Mixing tank in time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        defaultValue={state.mixingTankInTime}
                        className="customInput"
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="mixingStartTime"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Mixing start time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        defaultValue={state.mixingStartTime}
                        className="customInput"
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="mixingFinishTime"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Mixing finish time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        defaultValue={state.mixingFinishTime}
                        className="customInput"
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="feedTankInTime"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Feed tank in time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        defaultValue={state.feedTankInTime}
                        className="customInput"
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="feedingStartTime"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Feeding start time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        disabled
                        defaultValue={state.feedingStartTime}
                        className="customInput disabled"
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="operators"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Operator's name(s)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        disabled
                        className="customInput disabled"
                        defaultValue={state.operators}
                      />
                    </Form.Group>
                  </Row>

                  {state.batchNumber > 1 && (
                    <div
                      className="p-2 mb-2"
                      style={{
                        width: "auto",
                        backgroundColor: "#b8b9c4",
                        borderRadius: "1rem",
                      }}
                    >
                      <span className="sectionTitle sectionTitleBlue text-uppercase">
                        Previous batch raw milk details
                      </span>

                      <Row className="mt-2">
                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="prevBatchPhValue"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">pH value</Form.Label>

                          <Form.Control
                            type="number"
                            step=".01"
                            defaultValue={state.prevBatchPhValue}
                            className="customInput"
                            onChange={handleChange}
                          />
                          <Figure.Caption>5.7-5.9</Figure.Caption>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="prevBatchTSSValue"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">TSS</Form.Label>

                          <Form.Control
                            type="number"
                            step=".01"
                            defaultValue={state.prevBatchTSSValue}
                            className="customInput"
                            onChange={handleChange}
                          />
                          <Figure.Caption>(42-50)%</Figure.Caption>
                        </Form.Group>
                      </Row>
                    </div>
                  )}

                  <Row className="mb-5">
                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="steamBars"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Steam pressure
                      </Form.Label>

                      <Form.Control
                        type="number"
                        step=".01"
                        defaultValue={state.steamBars}
                        className="customInput"
                        onChange={handleChange}
                      />
                      <Figure.Caption>(4-5)MPa</Figure.Caption>
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="pressurePumpValue"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Pressure pump</Form.Label>

                      <Form.Control
                        type="number"
                        defaultValue={state.pressurePumpValue}
                        className="customInput"
                        onChange={handleChange}
                      />
                      <Figure.Caption>20MPa</Figure.Caption>
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="6"
                      controlId="mixDetails"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Mix details</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        defaultValue={state.mixDetails}
                        className="customInput"
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Row>

                  <div>
                    <button
                      type="submit"
                      className="btn-submit customBtn customBtnUpdate mt-md-4"
                    >
                      <CheckIcon className="me-2" />
                      Update
                    </button>
                    <button type="reset" className="customBtn customClearBtn">
                      Cancel
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

export default UpdateMixing;
