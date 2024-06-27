import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CheckIcon from "@mui/icons-material/Check";
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
import Cookies from "js-cookie";
import Swal from "sweetalert2";

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
  const [validated, setValidated] = useState(false);
  const [batchNumberData, setBatchNumberData] = useState({});
  const [location, setLocation] = useState("mdc");
  const [heatValve, setHeatValve] = useState(true);
  const [dailyProductionData, setDailyProductionData] = useState({});

  // const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({
      ...data,
      location,
      heatValve,
      // addedBy: loggedInUser,
      sectionName: "cutter",
      status: "updated",
      [id]: value,
    });
  };

  const setLocationCookie = () => {
    Cookies.set("location", data.location, {
      expires: 1,
      sameSite: "strict",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmData = `Expeller start time: ${data?.expellerStartTime} | Heat Valve: ${data?.heatValve} | Location: ${data?.location} | Operator: ${data?.operator}`;

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
          confirmButtonColor: "#415f91",
          confirmButtonText: "Yes",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const docRef = doc(db, "cutter_section", batchNumberData.id);
            await updateDoc(docRef, {
              ...data,
              timeStamp: serverTimestamp(),
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
                    console.log("location = a_k");
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
                navigate("/cutter-section");
                setLocationCookie();
              })
              .catch((error) => {
                console.log("Error updating document:", error);
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
    const fetchCurrentBatchInWet = async () => {
      try {
        const list = [];
        const q = query(
          collection(db, "cutter_section"),
          where("status", "==", "ongoing"),
          orderBy("timeStamp", "asc"),
          limit(1)
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

    fetchCurrentBatchInWet();
  }, []);

  useEffect(() => {
    const fetchSubFormData = async () => {
      try {
        const q = query(
          collection(db, "daily_production"),
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
  }, []);

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
                  className="d-flex align-items-center customClearBtn"
                >
                  <ArrowBackIosIcon fontSize="small" /> Back
                </Link>
              </div>

              <div className="card-body formWrapper">
                {batchNumberData && !batchNumberData.heatValve ? (
                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                  >
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
                          defaultValue={batchNumberData.date}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="3"
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
                          defaultValue={batchNumberData.batchNumber}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="3"
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
                          defaultValue={batchNumberData.blancherStartTime}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="3"
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
                    </Row>

                    {/* <Row>
                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="cutterStartTime"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          Cutter start time
                        </Form.Label>
                        <Form.Control
                          type="time"
                          required
                          className="customInput"
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Row> */}

                    <Row className="mb-5">
                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="expellerStartTime"
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
                        md="3"
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
                          <option value="mdc">MDC</option>
                          <option value="araliya_kele">Araliya Kele</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="operator"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          Operator's name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          required
                          className="customInput"
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Row>

                    <div>
                      <button
                        type="submit"
                        className="btn-submit customBtn customBtnSecondary mt-md-4"
                      >
                        <CheckIcon className="me-2" />
                        Submit
                      </button>
                      <button type="reset" className="customBtn customClearBtn">
                        Cancel
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
