import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  // collection,
  doc,
  // onSnapshot,
  // orderBy,
  // query,
  serverTimestamp,
  updateDoc,
  // where,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { Spinner } from "react-bootstrap";

import "../common.css";
import BackToTop from "../../components/backToTop/BackToTop";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import { db } from "../../config/firebase.config";
import { calculateTimeDifference } from "../../utils";

const UpdateCutter = () => {
  const { state } = useLocation();

  const [data, setData] = useState({});
  const [heatValve, setHeatValve] = useState(state.cutter_heat_valve);
  const [isLoading, setIsLoading] = useState(false);
  // const [dailyProductionDataInDb, setDailyProductionDataInDb] = useState({});
  const [location, setLocation] = useState(state.location);
  // const [updatedDailyProductionData, setUpdatedDailyProductionData] = useState(
  // {}
  // );

  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchSubFormData = async () => {
  //     if (state.date) {
  //       try {
  //         const q = query(
  //           collection(db, "daily_production"),
  //           where("date", "==", state?.date),
  //           orderBy("timeStamp", "desc")
  //         );
  //         const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //           let list = [];
  //           querySnapshot.forEach((doc) => {
  //             list.push({ id: doc.id, ...doc.data() });
  //           });

  //           setDailyProductionDataInDb(list[0]);
  //         });

  //         return () => {
  //           unsubscribe();
  //         };
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   };

  //   fetchSubFormData();
  // }, [state?.date]);

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({
      ...data,
      [id]: value,
      cutter_heat_valve: heatValve,
      cutter_status: "completed",
    });
  };

  const handleExpellerEndTime = (e) => {
    const processTime = calculateTimeDifference(
      state?.cutter_expeller_start_time,
      e.target.value
    );

    const averageTime = 20;
    let delayTime;

    if (processTime.hours > 0 && processTime.minutes > 20) {
      delayTime = `${processTime.hours}hrs +`;
    } else if (processTime.hours === 0 && processTime.minutes > 20) {
      delayTime = `${processTime.minutes - averageTime} minutes`;
    } else if (processTime.hours > 0 && processTime.minutes <= 20) {
      delayTime = `${processTime.minutes + (60 - averageTime)} minutes`;
    } else {
      delayTime = 0;
    }

    setData({
      ...data,
      expeller_finish_time: e.target.value,
      cutter_expeller_process_time: processTime,
      cutter_expeller_delay_time: delayTime,
    });
  };

  const handleChangeLocation = (e) => {
    setLocation(e.target.value);

    // let updatedDailyProductionTotalBatchInSd3 =
    //   dailyProductionDataInDb.totalBatchCountInMdc;
    // let updatedDailyProductionTotalBatchInSd4 =
    //   dailyProductionDataInDb.totalBatchCountInAraliyaKele;

    if (e.target.value === "mdc") {
      // updatedDailyProductionTotalBatchInSd3++;
      // updatedDailyProductionTotalBatchInSd4--;

      // setUpdatedDailyProductionData({
      //   ...updatedDailyProductionData,
      //   totalBatchCountInMdc: updatedDailyProductionTotalBatchInSd3,
      //   totalBatchCountInAraliyaKele: updatedDailyProductionTotalBatchInSd4,
      // });

      setData({
        ...data,
        cutter_bowser_load_time: null,
      });
    } else {
      // updatedDailyProductionTotalBatchInSd3--;
      // updatedDailyProductionTotalBatchInSd4++;
      // setUpdatedDailyProductionData({
      //   ...updatedDailyProductionData,
      //   totalBatchCountInMdc: updatedDailyProductionTotalBatchInSd3,
      //   totalBatchCountInAraliyaKele: updatedDailyProductionTotalBatchInSd4,
      // });
    }
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
            location: location,
            cutter_updated_at: serverTimestamp(),
            mixing_status: "ongoing",
            mixing_added_at: serverTimestamp(),
          })
            // .then(async () => {
            //   const docRef = doc(
            //     db,
            //     "daily_production",
            //     dailyProductionDataInDb.id
            //   );
            //   await updateDoc(docRef, {
            //     ...updatedDailyProductionData,
            //   });
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
              navigate("/cutter-section");
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
            <Breadcrumb title="Cutter Section" />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="mb-2">
                <Link
                  to="/cutter-section"
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
                      controlId="primary_batch_number"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">W batch number</Form.Label>
                      <Form.Control
                        type="number"
                        disabled
                        className="customInput disabled"
                        defaultValue={state.primary_batch_number}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="blancher_in_time"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Blancher start time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        disabled
                        className="customInput disabled"
                        defaultValue={state.blancher_in_time}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="cutter_heat_valve"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Heat Valve</Form.Label>
                      <Form.Switch
                        type="switch"
                        id="heat_valve"
                        label={heatValve === true ? "On" : "Off"}
                        checked={heatValve}
                        onChange={(e) => setHeatValve(e.target.checked)}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="cutter_expeller_start_time"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Expeller start time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        disabled={state.cutter_status === "ongoing"}
                        className={`customInput ${
                          state.cutter_status === "ongoing" && "disabled"
                        }`}
                        defaultValue={state.cutter_expeller_start_time}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="location"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Location</Form.Label>
                      <Form.Select
                        required
                        className="customInput"
                        defaultValue={location}
                        onChange={handleChangeLocation}
                      >
                        <option value="mdc">SD 03</option>
                        <option value="araliya_kele">SD 04</option>
                      </Form.Select>
                    </Form.Group>

                    {state.location && location === "araliya_kele" && (
                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="cutter_bowser_load_time"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          Bowser load time
                        </Form.Label>
                        <Form.Control
                          type="time"
                          className="customInput"
                          defaultValue={state.cutter_bowser_load_time}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    )}
                  </Row>

                  <hr className="custom-hr-yellow" />

                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="cutter_operator_name"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Operator name</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={state.cutter_operator_name}
                        disabled={state.cutter_status === "ongoing"}
                        className={`customInput ${
                          state.cutter_status === "ongoing" && "disabled"
                        }`}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="cutter_finish_time"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Cutter finish time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        defaultValue={state.cutter_finish_time}
                        required={state.cutter_status === "updated"}
                        disabled={state.cutter_status === "ongoing"}
                        className={`customInput ${
                          state.cutter_status === "ongoing" && "disabled"
                        }`}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="expeller_finish_time"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Expeller finish time
                      </Form.Label>

                      <Form.Control
                        type="time"
                        defaultValue={state.expeller_finish_time}
                        required={state.cutter_status === "updated"}
                        disabled={state.cutter_status === "ongoing"}
                        className={`customInput ${
                          state.cutter_status === "ongoing" && "disabled"
                        }`}
                        onChange={handleExpellerEndTime}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="12"
                      controlId="cutter_special_notes"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Special notes</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        className="customInput"
                        defaultValue={state.cutter_special_notes}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Row>

                  <div className="mt-5">
                    <button
                      type="submit"
                      className="btn-submit customBtn customBtnUpdate"
                      disabled={isLoading || state.cutter_status === "ongoing"}
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

export default UpdateCutter;
