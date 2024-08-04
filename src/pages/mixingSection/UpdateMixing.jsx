import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Col, Figure, Form, InputGroup, Row } from "react-bootstrap";
import { Spinner } from "react-bootstrap";

import { db } from "../../config/firebase.config";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";
import { orders } from "../../constants";

const UpdateMixing = () => {
  const { state } = useLocation();

  const [data, setData] = useState({});
  const [dailyProductionDataInDb, setDailyProductionDataInDb] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFillingHoleCleaned, setIsFillingHoleCleaned] = useState(
    state.sd_4_is_bowser_filling_hole_cleaned
  );
  const [isOutputTapCleaned, setIsOutputTapCleaned] = useState(
    state.sd_4_is_bowser_output_tap_cleaned
  );
  const [isTransferred, setIsTransferred] = useState(false);
  const [batchCode, setBatchCode] = useState(state.batch_code);
  const [recipeName, setRecipeName] = useState(state.order_name);

  const navigate = useNavigate();
  const { location } = useParams();

  const currentDate = new Date(state?.date);
  const year = ("" + currentDate.getFullYear()).substring(2);
  const month = currentDate.getMonth() + 1;
  const monthStr = month < 10 ? "0" + month : month;
  const date = currentDate.getDate();
  const dateStr = date < 10 ? "0" + date : date;

  useEffect(() => {
    const fetchSubFormData = async () => {
      if (state.date) {
        try {
          const q = query(
            collection(db, "daily_production"),
            where("date", "==", state?.date),
            orderBy("timeStamp", "desc")
          );
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let list = [];
            querySnapshot.forEach((doc) => {
              list.push({ id: doc.id, ...doc.data() });
            });

            setDailyProductionDataInDb(list[0]);
          });

          return () => {
            unsubscribe();
          };
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchSubFormData();
  }, [state?.date]);

  const handleBatchNumberChange = (e) => {
    const batchCode = `${
      location === "mdc" ? "SD3" : "SD4"
    }${year}${monthStr}${dateStr}${e.target.value}`;

    setBatchCode(batchCode);
    setData({
      ...data,
      batch_number: Number(e.target.value),
      batch_code: batchCode,
    });
  };

  const handleTransferredChange = (e) => {
    setIsTransferred(e.target.checked);

    let updatedDailyProductionTotalBatchInSd3 =
      dailyProductionDataInDb.totalBatchCountInMdc;
    let updatedDailyProductionTotalBatchInSd4 =
      dailyProductionDataInDb.totalBatchCountInAraliyaKele;
    let updatedDailyProductionTotalMilkAmountInSd3 =
      dailyProductionDataInDb.totalMilkAmountInMdc;
    let updatedDailyProductionTotalMilkAmountInSd4 =
      dailyProductionDataInDb.totalMilkAmountInAraliyaKele;

    if (e.target.checked) {
      updatedDailyProductionTotalBatchInSd3++;
      updatedDailyProductionTotalBatchInSd4--;
      updatedDailyProductionTotalMilkAmountInSd3 += Number(
        state.mixing_milk_quantity
      );
      updatedDailyProductionTotalMilkAmountInSd4 -= Number(
        state.mixing_milk_quantity
      );
    }

    Swal.fire({
      title: "Transfer to SD 03",
      text: "Do you want to transfer this batch to SD 03?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ff007f",
      confirmButtonText: "Yes",
      cancelButtonColor: "#0d1b2a",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const docRef = doc(db, "production_data", state.id);
          await updateDoc(docRef, {
            ...data,
            location: "mdc",
            mixing_mix_details: "Transferred from SD 04 to SD 03",
            sd_4_bowser_in_time: null,
            sd_4_batches_in_bowser: null,
            sd_4_is_bowser_filling_hole_cleaned: null,
            sd_4_is_bowser_output_tap_cleaned: null,
            sd_4_bowser_overall_condition: null,
          }).then(async () => {
            try {
              const docRef = doc(
                db,
                "daily_production",
                dailyProductionDataInDb.id
              );

              await updateDoc(docRef, {
                totalBatchCountInMdc: updatedDailyProductionTotalBatchInSd3,
                totalBatchCountInAraliyaKele:
                  updatedDailyProductionTotalBatchInSd4,
                totalMilkAmountInMdc:
                  updatedDailyProductionTotalMilkAmountInSd3,
                totalMilkAmountInAraliyaKele:
                  updatedDailyProductionTotalMilkAmountInSd4,
              }).then(() => {
                Swal.fire({
                  title: "Batch transferred",
                  icon: "success",
                  showConfirmButton: false,
                  timer: 1500,
                });

                navigate("/mixing-section");
              });
            } catch (error) {
              console.log(error);
            }
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        setIsTransferred(false);
      }
    });
  };

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({
      ...data,
      [id]: value,
      // bowser details
      sd_4_is_bowser_filling_hole_cleaned: isFillingHoleCleaned,
      sd_4_is_bowser_output_tap_cleaned: isOutputTapCleaned,
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
            mixing_updated_at: serverTimestamp(),
          })
            .then(() => {
              Swal.fire({
                title: "Changes saved",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              });

              e.target.reset();
              setIsLoading(false);
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
                location === "mdc" ? "SD 03" : "SD 04"
              } / Mixing Section / Update`}
            />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="mb-2 d-flex align-items-center justify-content-between">
                <Link
                  to="/mixing-section"
                  className="d-flex align-items-center customBackBtn"
                >
                  <ArrowBackIosIcon fontSize="small" /> Back
                </Link>

                {location === "araliya_kele" && (
                  <div>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="is_transferred"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold text-dark-blue">
                        Transfer to SD 03
                      </Form.Label>

                      <Form.Switch
                        type="switch"
                        id="is_transferred"
                        checked={isTransferred}
                        onChange={handleTransferredChange}
                      />
                    </Form.Group>
                  </div>
                )}
              </div>

              <div className="card-body formWrapper">
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
                        disabled
                        className="customInput disabled"
                        value={state.date}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="primary_batch_number"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Wet batch number
                      </Form.Label>
                      <Form.Control
                        type="number"
                        disabled
                        min={1}
                        value={state.primary_batch_number}
                        className="customInput disabled"
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="expeller_finish_time"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Raw milk in time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        disabled
                        className="customInput disabled"
                        value={state.expeller_finish_time}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="batch_number"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Batch number</Form.Label>
                      <Form.Control
                        type="number"
                        disabled={location === "araliya_kele"}
                        className={`customInput ${
                          location === "araliya_kele" && "disabled"
                        }`}
                        defaultValue={state.batch_number}
                        onChange={handleBatchNumberChange}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="batch_code"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Batch code</Form.Label>
                      <Form.Control
                        type="text"
                        disabled
                        className="customInput disabled"
                        defaultValue={batchCode}
                      />
                    </Form.Group>

                    {/* <Form.Group
                      as={Col}
                      md="4"
                      controlId="order_name"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Order name</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={state.order_name}
                        disabled
                        className="customInput disabled"
                      />
                    </Form.Group> */}
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="order_name"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Order name</Form.Label>
                      <Form.Select
                        required
                        className="customInput"
                        defaultValue={recipeName}
                        onChange={(e) => setRecipeName(e.target.value)}
                      >
                        {orders.map((order, index) => (
                          <option key={index} value={order.value}>
                            {order.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="order_type"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Order type</Form.Label>
                      <Form.Control
                        disabled
                        className="customInput disabled"
                        defaultValue={
                          state.order_type === "organic"
                            ? "Organic"
                            : "Conventional"
                        }
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="mixing_milk_quantity"
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
                          value={state.mixing_milk_quantity}
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

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="mixing_milk_recovery"
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
                          value={state.mixing_milk_recovery}
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
                    </Form.Group>
                  </Row>

                  {state.location === "mdc" ? (
                    <Row>
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="mixing_additional_crates_count"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          Additional crates count
                        </Form.Label>
                        <Form.Control
                          type="number"
                          defaultValue={state.mixing_additional_crates_count}
                          disabled
                          className="customInput disabled"
                        />
                      </Form.Group>

                      {state.mixing_additional_crates_count > 0 && (
                        <>
                          <Form.Group
                            as={Col}
                            md="4"
                            controlId="mixing_additional_crates_is_informed"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Is informed
                            </Form.Label>

                            <Form.Control
                              type="text"
                              disabled
                              className="customInput disabled"
                              defaultValue={
                                state?.mixing_additional_crates_is_informed &&
                                "Informed"
                              }
                            />
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            md="4"
                            controlId="mixing_additional_crates_informed_to"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Informed to
                            </Form.Label>
                            <Form.Control
                              type="text"
                              disabled
                              className="customInput disabled text-capitalize"
                              defaultValue={
                                state?.mixing_additional_crates_informed_to
                              }
                            />
                          </Form.Group>
                        </>
                      )}
                    </Row>
                  ) : (
                    state.mixing_status === "completed" && (
                      <>
                        <hr className="custom-hr-yellow" />

                        <Row>
                          <Form.Group
                            as={Col}
                            md="3"
                            controlId="sd_4_bowser_in_time"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Bowser in time
                            </Form.Label>

                            <Form.Control
                              type="time"
                              className="customInput"
                              defaultValue={state.sd_4_bowser_in_time}
                              onChange={handleChange}
                            />
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            md="3"
                            controlId="sd_4_batches_in_bowser"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              batches in bowser
                            </Form.Label>

                            <Form.Control
                              type="number"
                              className="customInput"
                              defaultValue={state.sd_4_batches_in_bowser}
                              onChange={handleChange}
                            />
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            md="3"
                            controlId="sd_4_is_bowser_filling_hole_cleaned"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Filling hole cleaning
                            </Form.Label>

                            <Form.Switch
                              type="switch"
                              id="is_informed"
                              label={
                                isFillingHoleCleaned === true
                                  ? "Clean"
                                  : "Not clean"
                              }
                              checked={isFillingHoleCleaned}
                              onChange={(e) =>
                                setIsFillingHoleCleaned(e.target.checked)
                              }
                            />
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            md="3"
                            controlId="sd_4_is_bowser_output_tap_cleaned"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Output tap cleaning
                            </Form.Label>

                            <Form.Switch
                              type="switch"
                              id="is_informed"
                              label={
                                isOutputTapCleaned === true
                                  ? "Clean"
                                  : "Not clean"
                              }
                              checked={isOutputTapCleaned}
                              onChange={(e) =>
                                setIsOutputTapCleaned(e.target.checked)
                              }
                            />
                          </Form.Group>
                        </Row>

                        <Row>
                          <Form.Group
                            as={Col}
                            md="12"
                            controlId="sd_4_bowser_overall_condition"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Overall condition
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={4}
                              className="customInput"
                              defaultValue={state.sd_4_bowser_overall_condition}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Row>

                        <hr className="custom-hr-yellow" />
                      </>
                    )
                  )}

                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="mixing_tank_in_time"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Mixing tank in time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        defaultValue={state.mixing_tank_in_time}
                        disabled={state.mixing_status === "ongoing"}
                        className={`customInput ${
                          state.mixing_status === "ongoing" && "disabled"
                        }`}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="mixing_mix_start_time"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Mix start time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        defaultValue={state.mixing_mix_start_time}
                        disabled={state.mixing_status === "ongoing"}
                        className={`customInput ${
                          state.mixing_status === "ongoing" && "disabled"
                        }`}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="mixing_mix_finish_time"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Mix finish time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        defaultValue={state.mixing_mix_finish_time}
                        disabled={state.mixing_status === "ongoing"}
                        className={`customInput ${
                          state.mixing_status === "ongoing" && "disabled"
                        }`}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="mixing_feeding_tank_in_time"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Feeding tank in time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        defaultValue={state.mixing_feeding_tank_in_time}
                        disabled={state.mixing_status === "ongoing"}
                        className={`customInput ${
                          state.mixing_status === "ongoing" && "disabled"
                        }`}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="mixing_feed_start_time"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Feed start time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        defaultValue={state.mixing_feed_start_time}
                        className="customInput"
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="mixing_operator_names"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Operator name(s)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        disabled
                        className="customInput disabled text-capitalize"
                        defaultValue={state.mixing_operator_names}
                      />
                    </Form.Group>
                  </Row>

                  {state.batch_number > 1 && (
                    <div
                      className="p-3 mb-3"
                      style={{
                        width: "auto",
                        backgroundColor: "#ffd800",
                        borderRadius: "0.25rem",
                      }}
                    >
                      <span className="sectionTitle sectionTitlePink text-uppercase">
                        Previous batch raw milk details
                      </span>

                      <Row className="mt-3 mb-0">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="mixing_prev_batch_raw_ph"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold textDarkBlue">
                            pH value
                          </Form.Label>

                          <Form.Control
                            type="number"
                            step=".01"
                            defaultValue={state.mixing_prev_batch_raw_ph}
                            className="customInput"
                            onChange={handleChange}
                          />
                          <Figure.Caption className="tooltipTextPink">
                            5.7-5.9
                          </Figure.Caption>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="mixing_prev_batch_raw_tss"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold textDarkBlue">
                            TSS
                          </Form.Label>

                          <Form.Control
                            type="number"
                            step=".01"
                            defaultValue={state.mixing_prev_batch_raw_tss}
                            className="customInput"
                            onChange={handleChange}
                          />
                          <Figure.Caption className="tooltipTextPink">
                            (42-50)%
                          </Figure.Caption>
                        </Form.Group>
                      </Row>
                    </div>
                  )}

                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="mixing_steam_pressure_value"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Steam pressure
                      </Form.Label>

                      <Form.Control
                        type="number"
                        step=".01"
                        defaultValue={state.mixing_steam_pressure_value}
                        disabled={state.mixing_status === "ongoing"}
                        className={`customInput ${
                          state.mixing_status === "ongoing" && "disabled"
                        }`}
                        onChange={handleChange}
                      />
                      <Figure.Caption className="tooltipText">
                        (4-5)MPa
                      </Figure.Caption>
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="mixing_pressure_pump_value"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Pressure pump</Form.Label>

                      <Form.Control
                        type="number"
                        defaultValue={state.mixing_pressure_pump_value}
                        disabled={state.mixing_status === "ongoing"}
                        className={`customInput ${
                          state.mixing_status === "ongoing" && "disabled"
                        }`}
                        onChange={handleChange}
                      />
                      <Figure.Caption className="tooltipText">
                        20MPa
                      </Figure.Caption>
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="mixing_mix_details"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Remarks</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        defaultValue={state.mixing_mix_details}
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

export default UpdateMixing;
