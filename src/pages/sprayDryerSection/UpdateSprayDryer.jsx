import React, { useEffect, useState } from "react";
import {
  // collection,
  doc,
  // onSnapshot,
  // query,
  serverTimestamp,
  updateDoc,
  // where,
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

const UpdateSprayDryer = () => {
  const { state } = useLocation();

  const [data, setData] = useState({});
  const [expectedTime, setExpectedTime] = useState();
  const [powderRecovery, setPowderRecovery] = useState(
    state?.sd_powder_recovery
  );
  // const [updatedDailyProductionData, setUpdatedDailyProductionData] = useState(
  //   {}
  // );
  // const [dailyProductionDataInDb, setDailyProductionDataInDb] = useState({});
  // const [powderQuantity, setPowderQuantity] = useState(0);
  const expectedPowderQuantity = state?.expected_powder_quantity
    ? state?.expected_powder_quantity
    : 120;
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { location } = useParams();

  const handleChangeAtomizerSize = (e) => {
    setExpectedTime("-");

    if (e.target.value === "0.8") setExpectedTime("1hr 20min");
    if (e.target.value === "1") setExpectedTime("1hr");
    if (e.target.value === "1.2") setExpectedTime("50min");

    setData({ ...data, sd_atomizer_size: e.target.value });
  };

  const handlePowderQuantity = (e) => {
    let recovery;

    recovery = ((e.target.value / expectedPowderQuantity) * 100).toFixed(2);

    setPowderRecovery(recovery);
    // setPowderQuantity(Number(e.target.value));

    setData({
      ...data,
      sd_total_powder_quantity: Number(e.target.value),
      sd_powder_recovery: recovery,
    });
  };

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    // if (location === "mdc") {
    //   setUpdatedDailyProductionData({
    //     ...updatedDailyProductionData,
    //     totalPowderQuantityInMdc:
    //       dailyProductionDataInDb?.totalPowderQuantityInMdc + powderQuantity,
    //   });
    // } else {
    //   setUpdatedDailyProductionData({
    //     ...updatedDailyProductionData,
    //     totalPowderQuantityInAraliyaKele:
    //       dailyProductionDataInDb?.totalPowderQuantityInAraliyaKele +
    //       powderQuantity,
    //   });
    // }

    setData({
      ...data,
      [id]: value,
      sd_status: "completed",
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
            sd_updated_at: serverTimestamp(),
          })
            // .then(async () => {
            //   try {
            //     const docRef = doc(
            //       db,
            //       "daily_production",
            //       dailyProductionDataInDb.id
            //     );
            //     await updateDoc(docRef, { ...updatedDailyProductionData });
            //   } catch (error) {
            //     console.log(error);
            //   }
            // })
            .then(() => {
              Swal.fire({
                title: "Changes saved",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              });
              e.target.reset();
              setIsLoading(false);
              navigate(`/sd-section/${location}`);
            })
            .catch((error) => {
              console.log("Error updating document:", error);
            });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch daily production data by selected object date
  // useEffect(() => {
  //   const fetchSubFormData = async () => {
  //     try {
  //       const q = query(
  //         collection(db, "daily_production"),
  //         where("date", "==", state.date)
  //       );
  //       const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //         let list = [];
  //         querySnapshot.forEach((doc) => {
  //           list.push({ id: doc.id, ...doc.data() });
  //         });

  //         setDailyProductionDataInDb(list[0]);
  //       });

  //       return () => {
  //         unsubscribe();
  //       };
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchSubFormData();
  // }, [state.date]);

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
              } / Spray Dryer Section`}
            />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="mb-2">
                <Link
                  to="/sd-section"
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
                        W batch number
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
                      md="3"
                      controlId="batch_number"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">SD batch number</Form.Label>
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
                      controlId="batch_number"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">SD batch code</Form.Label>
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
                      md="4"
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

                    {/* <Form.Group
                      as={Col}
                      md="4"
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
                    </Form.Group> */}
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="order_name"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Order name</Form.Label>
                      <Form.Select
                        className="customInput disabled"
                        disabled
                        defaultValue={state?.order_name}
                      >
                        {orders.map((order, index) => (
                          <option key={index} value={order.value}>
                            {order?.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="sd_powder_spray_start_time"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Powder spray start time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        disabled={state.sd_status === "ongoing"}
                        defaultValue={state.sd_powder_spray_start_time}
                        className={`customInput ${
                          state.sd_status === "ongoing" && "disabled"
                        }`}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="sd_atomizer_size"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Atomizer size</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          aria-label="atomizer size"
                          aria-describedby="addon"
                          disabled={state.sd_status === "ongoing"}
                          className={`customInput ${
                            state.sd_status === "ongoing" && "disabled"
                          }`}
                          defaultValue={state.sd_atomizer_size}
                          onChange={handleChangeAtomizerSize}
                        />
                        <InputGroup.Text
                          id="addon"
                          style={{
                            borderTopRightRadius: "0.25rem",
                            borderBottomRightRadius: "0.25rem",
                            color: "#0d1b2a",
                          }}
                        >
                          mm
                        </InputGroup.Text>
                      </InputGroup>

                      {expectedTime && (
                        <Figure.Caption className="tooltipText">
                          Expected finish time ~ approx.{" "}
                          <span className="fw-bold text-primary">
                            {expectedTime}
                          </span>
                        </Figure.Caption>
                      )}
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="sd_inlet_temp"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Inlet temperature
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          aria-label="inlet temperature"
                          aria-describedby="addon"
                          disabled={state.sd_status === "ongoing"}
                          className={`customInput ${
                            state.sd_status === "ongoing" && "disabled"
                          }`}
                          defaultValue={state.sd_inlet_temp}
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
                          &deg;C
                        </InputGroup.Text>
                      </InputGroup>
                      <Figure.Caption className="tooltipText">
                        (230-240)&deg;C
                      </Figure.Caption>
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="sd_outlet_temp"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Outlet temperature
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          aria-label="outlet temperature"
                          aria-describedby="addon"
                          defaultValue={state.sd_outlet_temp}
                          disabled={state.sd_status === "ongoing"}
                          className={`customInput ${
                            state.sd_status === "ongoing" && "disabled"
                          }`}
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
                          &deg;C
                        </InputGroup.Text>
                      </InputGroup>
                      <Figure.Caption className="tooltipText">
                        (90-95)&deg;C
                      </Figure.Caption>
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="sd_operator_names"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Operator name(s)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        disabled
                        defaultValue={state.sd_operator_names}
                        className="customInput disabled text-capitalize"
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="8"
                      controlId="sd_other_details"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Other details</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        disabled={state.sd_status === "ongoing"}
                        className={`customInput ${
                          state.sd_status === "ongoing" && "disabled"
                        }`}
                        defaultValue={state.sd_other_details}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Row>

                  <hr className="custom-hr-yellow" />

                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="expected_powder_quantity"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Expected quantity
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          aria-label="expected powder quantity"
                          aria-describedby="addon"
                          disabled
                          className="customInput"
                          defaultValue={expectedPowderQuantity}
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
                      controlId="sd_total_powder_quantity"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Total quantity
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          aria-label="powder quantity"
                          aria-describedby="addon"
                          defaultValue={state.sd_total_powder_quantity}
                          required={state.sd_status === "updated"}
                          className="customInput"
                          disabled={state.sd_status === "completed"}
                          onChange={handlePowderQuantity}
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
                      controlId="sd_powder_recovery"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Recovery</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          aria-label="powder recovery"
                          aria-describedby="addon"
                          disabled
                          className="customInput"
                          defaultValue={powderRecovery}
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

                  {/* TODO: create a separate component 
                      - .map(8 raws)
                      - bind to the object using index as the id
                      - wena karanna widiyak mathak wenne ne
                    */}
                  {/* <Row>
                  <div
                    className="p-2 rounded"
                    style={{ backgroundColor: "#dae2f9" }}
                  >
                    <span className="sectionTitle sectionTitleBlue text-uppercase">
                      Bag details
                    </span>

                    <div className="row fw-bold mt-2">
                      <div className="col-md-2">Number</div>
                      <div className="col-md-3">Quantity</div>
                      <div className="col-md-2 ">Quality</div>
                      <div className="col-md-2 ">Tag</div>
                      <div className="col-md-3">Remark</div>
                    </div>

                    <div className="d-flex justify-content-evenly">
                      <div className="col-md-2">1</div>
                      <div className="col-md-3">
                        <Form.Control
                          size="sm"
                          type="number"
                          required
                          onChange={handleSingleBagQuantity}
                        />
                      </div>
                      <div className="col-md-2">
                        <Form.Switch
                          type="switch"
                          controlId="firstBagQuality"
                          checked={quality}
                          className="text-center"
                          onChange={(e) => setQuality(e.target.checked)}
                        />
                      </div>
                      <div className="col-md-2">
                        <Form.Switch
                          type="switch"
                          controlId="firstBagTag"
                          checked={tag}
                          className="text-center"
                          onChange={(e) => setTag(e.target.checked)}
                        />
                      </div>
                      <div className="col-md-3">
                        <Form.Control
                          size="sm"
                          type="text"
                          // onChange={handleSingleBagQuantity}
                        />
                      </div>
                    </div>
                  </div>
                </Row> */}

                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="sd_rp_quantity"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">RP</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          aria-label="rp"
                          aria-describedby="addon"
                          className="customInput"
                          disabled={state.sd_status === "completed"}
                          defaultValue={state.sd_rp_quantity}
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

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="sd_batch_finish_time"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Batch finish time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        required={state.sd_status === "updated"}
                        disabled={state.sd_status === "completed"}
                        defaultValue={state?.sd_batch_finish_time}
                        className={`customInput ${
                          state.sd_status === "completed" && "disabled"
                        }`}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="12"
                      controlId="sd_special_notes"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Special notes</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        disabled={state.sd_status === "ongoing"}
                        className={`customInput ${
                          state.sd_status === "ongoing" && "disabled"
                        }`}
                        onChange={handleChange}
                        defaultValue={state.sd_special_notes}
                      />
                    </Form.Group>
                  </Row>

                  <div className="mt-5">
                    <button
                      type="submit"
                      disabled={
                        !state.sd_status ||
                        state.sd_status === "ongoing" ||
                        isLoading
                      }
                      className="btn-submit customBtn customBtnUpdate"
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

export default UpdateSprayDryer;
