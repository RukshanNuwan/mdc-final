import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
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

const UpdateSprayDryer = () => {
  const { state } = useLocation();

  const [data, setData] = useState({});
  const [validated, setValidated] = useState(false);
  const [expectedTime, setExpectedTime] = useState();
  const [powderRecovery, setPowderRecovery] = useState();
  const [expectedPowderQuantity, setExpectedPowderQuantity] = useState(120);
  const [dailyProductionData, setDailyProductionData] = useState({});
  const [dailyProductionDataInDb, setDailyProductionDataInDb] = useState({});
  const [powderQuantity, setPowderQuantity] = useState();

  const navigate = useNavigate();
  const { location } = useParams();

  const handleChangeAtomizerSize = (e) => {
    setExpectedTime("-");

    if (e.target.value === "0.8") setExpectedTime("1hr 20min");
    if (e.target.value === "1") setExpectedTime("1hr");
    if (e.target.value === "1.2") setExpectedTime("50min");

    setData({ ...data, atomizerSize: e.target.value });
  };

  const handlePowderQuantity = (e) => {
    let recovery;

    if (expectedPowderQuantity) {
      recovery = ((e.target.value / expectedPowderQuantity) * 100).toFixed(2);
      setPowderRecovery(recovery);
    }

    setPowderQuantity(e.target.value);
    setData({
      ...data,
      expectedPowderQuantity,
      powderQuantity: e.target.value,
      powderRecovery: recovery,
    });
  };

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    if (location === "mdc") {
      setDailyProductionData({
        ...dailyProductionData,
        totalPowderQuantityInMdc:
          dailyProductionDataInDb?.totalPowderQuantityInMdc +
          Number(powderQuantity),
      });
    } else {
      setDailyProductionData({
        ...dailyProductionData,
        totalPowderQuantityInAraliyaKele:
          dailyProductionDataInDb?.totalPowderQuantityInAraliyaKele +
          Number(powderQuantity),
      });
    }

    setData({
      ...data,
      status: "completed",
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
            const docRef = doc(db, "sd_section", state.id);
            await updateDoc(docRef, { ...data })
              .then(() => {
                Swal.fire({
                  title: "Changes saved",
                  icon: "success",
                  showConfirmButton: false,
                  timer: 1500,
                });
                e.target.reset();
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

      try {
        const docRef = doc(db, "daily_production", dailyProductionDataInDb.id);
        await updateDoc(docRef, { ...dailyProductionData });

        e.target.reset();
      } catch (error) {
        console.log(error);
      }
    }

    setValidated(true);
  };

  // Fetch expected powder quantity from lab
  useEffect(() => {
    const getExpectedPowderQuantity = async () => {
      try {
        const q = query(
          collection(db, "lab_section"),
          where("location", "==", location),
          where("batchNumber", "==", state?.batchNumber)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setExpectedPowderQuantity(doc.data().expectedPowderQuantity);
        });
      } catch (error) {
        console.log(error);
      }
    };

    getExpectedPowderQuantity();
  }, [location, state?.batchNumber]);

  // Fetch daily production data
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

          setDailyProductionDataInDb(list[0]);
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
            <Breadcrumb
              title={`${
                location === "mdc" ? "MDC" : "Araliya Kele"
              } / Spray Dryer Section`}
            />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="mb-2">
                <Link
                  to={`/sd-section/${location}`}
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
                        defaultValue={state.date}
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
                        value={state.wetBatchNumber}
                        className="customInput disabled"
                      />
                    </Form.Group>

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
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="3"
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
                      md="3"
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

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="powderSprayStartTime"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Powder spray start time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        disabled
                        defaultValue={state.powderSprayStartTime}
                        className="customInput disabled"
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="atomizerSize"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Atomizer size</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          aria-label="atomizer size"
                          aria-describedby="addon"
                          className="customInput"
                          defaultValue={state.atomizerSize}
                          onChange={handleChangeAtomizerSize}
                        />
                        <InputGroup.Text
                          id="addon"
                          style={{
                            borderTopRightRadius: "0.5rem",
                            borderBottomRightRadius: "0.5rem",
                            fontWeight: "bold",
                          }}
                        >
                          mm
                        </InputGroup.Text>
                      </InputGroup>

                      {expectedTime && (
                        <Figure.Caption>
                          Expected finish time ~ approx.{" "}
                          <span className="fw-bold text-primary">
                            {expectedTime}
                          </span>
                        </Figure.Caption>
                      )}
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="inletTemp"
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
                          className="customInput"
                          defaultValue={state.inletTemp}
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
                          &deg;C
                        </InputGroup.Text>
                      </InputGroup>
                      <Figure.Caption>(230-240)&deg;C</Figure.Caption>
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="outletTemp"
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
                          defaultValue={state.outletTemp}
                          className="customInput"
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
                          &deg;C
                        </InputGroup.Text>
                      </InputGroup>
                      <Figure.Caption>(90-95)&deg;C</Figure.Caption>
                    </Form.Group>
                  </Row>

                  <Row>
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
                        defaultValue={state.operators}
                        className="customInput disabled"
                      />
                    </Form.Group>
                  </Row>

                  <hr />

                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="expectedPowderQuantity"
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
                          value={expectedPowderQuantity || 120}
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
                      md="4"
                      controlId="powderQuantity"
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
                          value={state?.powderQuantity}
                          required={state.status === "updated"}
                          className="customInput"
                          disabled={state.status === "completed"}
                          onChange={handlePowderQuantity}
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
                      md="4"
                      controlId="powderRecovery"
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
                          value={powderRecovery}
                          defaultValue={state?.powderRecovery}
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
                    <Form.Group as={Col} md="4" controlId="rp" className="mb-2">
                      <Form.Label className="fw-bold">RP</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          aria-label="rp"
                          aria-describedby="addon"
                          className="customInput"
                          disabled={state.status === "completed"}
                          defaultValue={state.rp}
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

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="powderSprayFinishTime"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Batch finish time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        required={state.status === "updated"}
                        disabled={state.status === "completed"}
                        defaultValue={state?.powderSprayFinishTime}
                        className={`customInput ${
                          state.status === "completed" && "disabled"
                        }`}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Row>

                  <Row className="mb-5">
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

export default UpdateSprayDryer;