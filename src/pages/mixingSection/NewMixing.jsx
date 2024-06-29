import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CheckIcon from "@mui/icons-material/Check";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Figure } from "react-bootstrap";
import Swal from "sweetalert2";

import "../common.css";
import BackToTop from "../../components/backToTop/BackToTop";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import { db } from "../../config/firebase.config";
import ErrorMessage from "../../components/errorMessage/ErrorMessage";

const NewMixing = () => {
  const [data, setData] = useState({});
  const [validated, setValidated] = useState(false);
  const [receivedData, setReceivedData] = useState({});
  const [milkQuantity, setMilkQuantity] = useState();
  const [milkRecovery, setMilkRecovery] = useState("");
  const [recipeType, setRecipeType] = useState("conventional");
  const [batchNumberData, setBatchNumberData] = useState({});
  const [wetData, setWetData] = useState();
  const [rawMilkInTime, setRawMilkInTime] = useState();
  const [dailyProductionData, setDailyProductionData] = useState({});
  const [additionalCratesCount, setAdditionalCratesCount] = useState(0);
  const [newKernelWeight, setNewKernelWeight] = useState(0);
  const [isInformed, setIsInformed] = useState(false);
  const [batchNumber, setBatchNumber] = useState();

  // const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();
  const { location } = useParams();

  const handleChangeBatchNumber = (e) => {
    setBatchNumber(Number(e.target.value));
    setData({ ...data, batchNumber: Number(e.target.value) });
  };

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    if (location === "mdc") {
      setDailyProductionData({
        ...dailyProductionData,
        totalMilkAmountInMdc:
          receivedData?.totalMilkAmountInMdc + Number(milkQuantity),
      });
    } else {
      setDailyProductionData({
        ...dailyProductionData,
        totalMilkAmountInAraliyaKele:
          receivedData?.totalMilkAmountInAraliyaKele + Number(milkQuantity),
      });
    }

    setData({
      ...data,
      rawMilkInTime,
      recipeType,
      milkQuantity,
      milkRecovery,
      additionalCratesCount,
      isInformed,
      // addedBy: loggedInUser,
      status: "completed",
      sectionName: "mixing",
      [id]: value,
    });
  };

  const handleOperatorsChange = (e) => {
    const str = e.target.value;
    const operators = str.split(",");
    setData({ ...data, operators });
  };

  const handleMilkRecovery = (e) => {
    const recovery = ((e.target.value / wetData.kernelWeight) * 100).toFixed(2);

    setMilkQuantity(e.target.value);
    setMilkRecovery(recovery);
  };

  const handleAdditionalCratesCountChange = (e) => {
    const weightByCratesCount = e.target.value * 20;
    const newWeight = Number(wetData.kernelWeight) + weightByCratesCount;
    setNewKernelWeight(newWeight);
    setAdditionalCratesCount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmData = `Batch number: ${data?.batchNumber} | Order name: ${data?.recipeName} | Order type: ${data?.recipeType} | Milk quantity: ${milkQuantity} | Mixing tank in time: ${data?.mixingTankInTime} | Mixing start time: ${data?.mixingStartTime} | Mixing finish time: ${data?.mixingFinishTime} | Feed tank in time: ${data?.feedTankInTime} | Feeding start time: ${data?.feedingStartTime} | Operators: ${data?.operators} | Steam pressure: ${data?.steamBars} | Pressure pump value: ${data?.pressurePumpValue}`;

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
            const docRef = doc(db, "mixing_section", batchNumberData.id);
            await updateDoc(docRef, {
              ...data,
            }).then(async () => {
              try {
                await addDoc(collection(db, "lab_section"), {
                  date: batchNumberData.date,
                  batchNumber: data.batchNumber,
                  recipeName: data.recipeName,
                  recipeType: data.recipeType,
                  location: batchNumberData.location,
                  wetBatchNumber: wetData.batchNumber,
                  status: "ongoing",
                  timeStamp: serverTimestamp(),
                }).then(async (r) => {
                  try {
                    await addDoc(collection(db, "sd_section"), {
                      mixing_batch_id: batchNumberData.id,
                      lab_batch_id: r.id,
                      batchNumber: data.batchNumber,
                      wetBatchNumber: wetData.batchNumber,
                      date: batchNumberData.date,
                      location: batchNumberData.location,
                      recipeName: data.recipeName,
                      recipeType: data.recipeType,
                      status: "ongoing",
                      timeStamp: serverTimestamp(),
                    }).then(() => {
                      Swal.fire({
                        title: "Changes saved",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                      });

                      e.target.reset();
                      navigate(`/mixing-section/${location}`);
                    });
                  } catch (error) {
                    console.log(error);
                  }
                });
              } catch (error) {
                console.log(error);
              }
            });
          }
        });

        try {
          const docRef = doc(db, "daily_production", receivedData.id);
          await updateDoc(docRef, {
            ...dailyProductionData,
          });

          console.log("successfully updated daily production");
        } catch (error) {
          console.log(error);
        }

        // update kernel batch weight in wet section
        if (newKernelWeight > 0) {
          try {
            const docRef = doc(db, "wet_section", batchNumberData.wet_batch_id);
            await updateDoc(docRef, {
              kernelWeight: newKernelWeight,
            });

            console.log("successfully updated kernel weight in wet section");
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    setValidated(true);
  };

  useEffect(() => {
    const fetchCurrentBatchInCutter = async () => {
      try {
        const list = [];
        const q = query(
          collection(db, "mixing_section"),
          where("status", "==", "ongoing"),
          where("location", "==", location),
          orderBy("timeStamp", "asc")
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

    fetchCurrentBatchInCutter();
  }, [location]);

  useEffect(() => {
    const fetchExpellerFinishTimeInCutter = async () => {
      try {
        const docRef = doc(
          db,
          "cutter_section",
          batchNumberData.cutter_batch_id
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRawMilkInTime(docSnap.data().expellerFinishTime);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (batchNumberData) fetchExpellerFinishTimeInCutter();
  }, [batchNumberData]);

  useEffect(() => {
    const fetchKernelWeightFromWetSection = async () => {
      try {
        const docRef = doc(db, "wet_section", batchNumberData.wet_batch_id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setWetData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (batchNumberData) fetchKernelWeightFromWetSection();
  }, [batchNumberData]);

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

          setReceivedData(list[0]);
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
              } / Mixing Section`}
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
                {batchNumberData ? (
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
                          Wet batch number
                        </Form.Label>
                        <Form.Control
                          type="number"
                          disabled
                          min={1}
                          defaultValue={wetData?.batchNumber}
                          className="customInput disabled"
                        />
                      </Form.Group>

                      {/* TODO: Choose the spray dryer (2 or 3) from dropdown */}

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
                          defaultValue={rawMilkInTime}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="batchNumber"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          Batch number
                        </Form.Label>
                        <Form.Control
                          type="number"
                          required
                          min={1}
                          className="customInput"
                          onChange={handleChangeBatchNumber}
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
                          required
                          className="customInput"
                          onChange={handleChange}
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
                          required
                          className="customInput"
                          defaultValue={recipeType}
                          onChange={(e) => setRecipeType(e.target.value)}
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
                        <Form.Label className="fw-bold">
                          Milk quantity
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="number"
                            aria-label="milk quantity"
                            aria-describedby="addon"
                            required
                            className="customInput"
                            defaultValue={milkQuantity}
                            onChange={handleMilkRecovery}
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
                        <Form.Label className="fw-bold">
                          Milk recovery
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="number"
                            aria-label="milk recovery"
                            aria-describedby="addon"
                            disabled
                            className="customInput"
                            value={milkRecovery}
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
                          defaultValue={additionalCratesCount}
                          className="customInput"
                          onChange={handleAdditionalCratesCountChange}
                        />
                      </Form.Group>

                      {additionalCratesCount > 0 && (
                        <>
                          <Form.Group
                            as={Col}
                            md="3"
                            controlId="isInformedToCutter"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Is informed
                            </Form.Label>

                            <Form.Switch
                              type="switch"
                              id="is_informed"
                              label={
                                isInformed === true
                                  ? "Informed"
                                  : "Not informed"
                              }
                              checked={isInformed}
                              onChange={(e) => setIsInformed(e.target.checked)}
                            />
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            md="3"
                            controlId="informedTo"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Informed to
                            </Form.Label>
                            <Form.Control
                              type="text"
                              className="customInput"
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </>
                      )}
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
                          required
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
                          required
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
                          required
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
                          required
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
                          required
                          className="customInput"
                          onChange={handleChange}
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
                          required
                          className="customInput"
                          onChange={handleOperatorsChange}
                        />
                        <Figure.Caption>
                          Type names using commas [,]. (Eg:- name1, name2,
                          name3)
                        </Figure.Caption>
                      </Form.Group>
                    </Row>

                    {batchNumber > 1 && (
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
                            <Form.Label className="fw-bold">
                              pH value
                            </Form.Label>

                            <Form.Control
                              type="number"
                              step=".01"
                              required
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
                          required
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
                        <Form.Label className="fw-bold">
                          Pressure pump value
                        </Form.Label>

                        <Form.Control
                          type="number"
                          required
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
                          className="customInput"
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Row>

                    <div>
                      <button
                        type="submit"
                        className="btn-submit customBtn mt-md-4"
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

export default NewMixing;
