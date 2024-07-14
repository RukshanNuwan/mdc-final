import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
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
import ErrorMessage from "../../components/errorMessage/ErrorMessage";

const NewCutter = () => {
  const [data, setData] = useState({});
  const [ongoingData, setOngoingData] = useState({});
  const [location, setLocation] = useState("mdc");
  const [heatValve, setHeatValve] = useState(true);
  const [dailyProductionData, setDailyProductionData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({
      ...data,
      [id]: value,
      location,
      cutter_heat_valve: heatValve,
      cutter_status: "updated",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(false);

    const confirmData = `Expeller start time: ${data?.cutter_expeller_start_time} | Heat Valve: ${data?.cutter_heat_valve} | Location: ${data?.location} | Operator: ${data?.cutter_operator_name}`;

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
          await updateDoc(docRef, {
            ...data,
            cutter_added_at: serverTimestamp(),
          })
            .then(async () => {
              const ref = doc(db, "daily_production", dailyProductionData.id);

              try {
                if (data.location === "mdc") {
                  await updateDoc(ref, {
                    ...dailyProductionData,
                    totalBatchCountInMdc:
                      dailyProductionData.totalBatchCountInMdc + 1,
                  });
                } else {
                  await updateDoc(ref, {
                    ...dailyProductionData,
                    totalBatchCountInAraliyaKele:
                      dailyProductionData.totalBatchCountInAraliyaKele + 1,
                  });
                }
              } catch (error) {
                console.log(error);
              }
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
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCurrentBatchInWet = async () => {
      try {
        const list = [];
        const q = query(
          collection(db, "production_data"),
          where("cutter_status", "==", "ongoing"),
          orderBy("wet_added_at", "asc"),
          limit(1)
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

    fetchCurrentBatchInWet();
  }, []);

  useEffect(() => {
    const fetchSubFormData = async () => {
      try {
        const q = query(
          collection(db, "daily_production"),
          where("date", "==", ongoingData?.date),
          orderBy("timeStamp", "desc")
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let list = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });

          setDailyProductionData(list[0]);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.log(error);
      }
    };

    fetchSubFormData();
  }, [ongoingData?.date]);

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
                {ongoingData ? (
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
                          defaultValue={ongoingData.date}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="primary_batch_number"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          Batch number
                        </Form.Label>
                        <Form.Control
                          type="number"
                          disabled
                          className="customInput disabled"
                          defaultValue={ongoingData.primary_batch_number}
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
                          defaultValue={ongoingData.blancher_in_time}
                        />
                      </Form.Group>
                    </Row>

                    <Row>
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="cutter_heat_valve"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">Heat Valve</Form.Label>
                        <Form.Switch
                          type="switch"
                          id="cutter_heat_valve"
                          label={heatValve === true ? "On" : "Off"}
                          checked={heatValve}
                          onChange={(e) => setHeatValve(e.target.checked)}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="cutter_expeller_start_time"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          Expeller start time
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
                        controlId="location"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">Location</Form.Label>
                        <Form.Select
                          required
                          className="customInput"
                          defaultValue={location}
                          onChange={(e) => setLocation(e.target.value)}
                        >
                          <option value="mdc">SD 03</option>
                          <option value="araliya_kele">SD 04</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="cutter_operator_name"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          Operator name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          required
                          className="customInput"
                          onChange={handleChange}
                        />
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

export default NewCutter;
