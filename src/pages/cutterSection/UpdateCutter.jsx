import { useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
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

const UpdateCutter = () => {
  const { state } = useLocation();

  const [data, setData] = useState({});
  const [validated, setValidated] = useState(false);
  const [heatValve, setHeatValve] = useState(state.heatValve);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({
      ...data,
      heatValve,
      status: "completed",
      [id]: value,
    });
  };

  const calculateTimeDifference = (startTime, endTime) => {
    const [hours1, minutes1] = startTime.split(":").map(Number);
    const [hours2, minutes2] = endTime.split(":").map(Number);
    const totalMinutes1 = hours1 * 60 + minutes1;
    const totalMinutes2 = hours2 * 60 + minutes2;
    const diffInMinutes = Math.abs(totalMinutes2 - totalMinutes1);
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    return {
      hours,
      minutes,
    };
  };

  const handleExpellerEndTime = (e) => {
    const processTime = calculateTimeDifference(
      state?.expellerStartTime,
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
      expellerFinishTime: e.target.value,
      expellerProcessTime: processTime,
      expellerDelayTime: delayTime,
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

            const docRef = doc(db, "cutter_section", state.id);
            await updateDoc(docRef, data).then(async () => {
              try {
                const q = query(
                  collection(db, "mixing_section"),
                  where("cutter_batch_id", "==", state.id)
                );
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                  console.log("inside");

                  await addDoc(collection(db, "mixing_section"), {
                    cutter_batch_id: state.id,
                    wet_batch_id: state.wet_batch_id,
                    wet_batch_number: state.batchNumber,
                    date: state.date,
                    location: state.location,
                    status: "ongoing",
                    timeStamp: serverTimestamp(),
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
                      navigate("/cutter-section");
                    })
                    .catch((error) => {
                      console.log("Error updating document:", error);
                    });
                } else {
                  Swal.fire({
                    title: "Changes saved",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                  });

                  e.target.reset();
                  setIsLoading(false);
                  navigate("/cutter-section");
                }
              } catch (error) {
                console.log(error);
              }
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
                      <Form.Label className="fw-bold">
                        Batch number (Wet section)
                      </Form.Label>
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
                      controlId="blancherStartTime"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Blancher start time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        disabled
                        className="customInput disabled"
                        defaultValue={state.blancherStartTime}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="heatValve"
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
                      md="4"
                      controlId="expellerStartTime"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Expeller start time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        disabled={state.status === "ongoing"}
                        className={`customInput ${
                          state.status === "ongoing" && "disabled"
                        }`}
                        defaultValue={state.expellerStartTime}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    {/* TODO: this field can be updated after added (status = completed) */}
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="location"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Location</Form.Label>
                      <Form.Control
                        disabled
                        className="customInput disabled"
                        defaultValue={
                          state.location === "mdc" ? "SD 03" : "SD 04"
                        }
                      />
                    </Form.Group>
                  </Row>

                  <hr className="custom-hr-yellow" />

                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="operator"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Operator name</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={state.operator}
                        disabled={state.status === "ongoing"}
                        className={`customInput ${
                          state.status === "ongoing" && "disabled"
                        }`}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    {/* TODO: mewa status = complete unata passe update wenawanm meke depend wena mixing data update karanna wenw */}
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="cutterFinishTime"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Cutter finish time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        defaultValue={state.cutterFinishTime}
                        required={state.status === "updated"}
                        disabled={state.status === "ongoing"}
                        className={`customInput ${
                          state.status === "ongoing" && "disabled"
                        }`}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    {/* TODO: mewa status = complete unata passe update wenawanm meke depend wena mixing data update karanna wenw */}
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="expellerFinishTime"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Expeller finish time
                      </Form.Label>

                      <Form.Control
                        type="time"
                        defaultValue={state.expellerFinishTime}
                        required={state.status === "updated"}
                        disabled={state.status === "ongoing"}
                        className={`customInput ${
                          state.status === "ongoing" && "disabled"
                        }`}
                        onChange={handleExpellerEndTime}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="12"
                      controlId="specialNotes"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Special notes</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        disabled={state.status === "ongoing"}
                        className={`customInput ${
                          state.status === "ongoing" && "disabled"
                        }`}
                        defaultValue={state.specialNotes}
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
                      <div className="d-flex align-items-center gap-2">
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

export default UpdateCutter;
