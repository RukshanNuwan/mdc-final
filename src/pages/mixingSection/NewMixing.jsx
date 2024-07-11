import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  collection,
  doc,
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
import { Spinner } from "react-bootstrap";

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
  const [dailyProductionDataInDb, setDailyProductionDataInDb] = useState({});
  const [milkQuantity, setMilkQuantity] = useState();
  const [milkRecovery, setMilkRecovery] = useState("");
  const [recipeType, setRecipeType] = useState("conventional");
  const [ongoingData, setOngoingData] = useState({});
  const [updatedDailyProductionData, setUpdatedDailyProductionData] = useState(
    {}
  );
  const [additionalCratesCount, setAdditionalCratesCount] = useState(0);
  const [newKernelWeight, setNewKernelWeight] = useState(0);
  const [isInformed, setIsInformed] = useState(false);
  const [batchNumber, setBatchNumber] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isFillingHoleCleaned, setIsFillingHoleCleaned] = useState(false);
  const [isOutputTapCleaned, setIsOutputTapCleaned] = useState(false);
  const [batchCode, setBatchCode] = useState();

  // const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();
  const { location } = useParams();

  const currentDate = new Date();
  const year = ("" + currentDate.getFullYear()).substring(2);
  const month = currentDate.getMonth() + 1;
  const monthStr = month < 10 ? "0" + month : month;
  const date = currentDate.getDate();
  const dateStr = date < 10 ? "0" + date : date;

  const handleChangeBatchNumber = (e) => {
    setBatchNumber(Number(e.target.value));
    setData({ ...data, batch_number: Number(e.target.value) });

    const batchCode = `${
      location === "mdc" ? "SD3" : "SD4"
    }${year}${monthStr}${dateStr}${e.target.value}`;

    setBatchCode(batchCode);
    setData({ ...data, batch_code: batchCode });
  };

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    if (location === "mdc") {
      setUpdatedDailyProductionData({
        ...updatedDailyProductionData,
        totalMilkAmountInMdc:
          dailyProductionDataInDb?.totalMilkAmountInMdc + Number(milkQuantity),
      });
    } else {
      setUpdatedDailyProductionData({
        ...updatedDailyProductionData,
        totalMilkAmountInAraliyaKele:
          dailyProductionDataInDb?.totalMilkAmountInAraliyaKele +
          Number(milkQuantity),
      });
    }

    setData({
      ...data,
      [id]: value,
      order_type: recipeType,
      mixing_milk_quantity: milkQuantity,
      mixing_milk_recovery: milkRecovery,
      mixing_additional_crates_count: additionalCratesCount,
      mixing_additional_crates_is_informed: isInformed,
      mixing_status: "completed",
      // bowser details
      sd_4_is_bowser_filling_hole_cleaned: isFillingHoleCleaned,
      sd_4_is_bowser_output_tap_cleaned: isOutputTapCleaned,
    });
  };

  const handleOperatorsChange = (e) => {
    const str = e.target.value;
    const operators = str.split(",");
    setData({ ...data, mixing_operator_names: operators });
  };

  const handleMilkRecovery = (e) => {
    const recovery = (
      (e.target.value / ongoingData.wet_kernel_weight) *
      100
    ).toFixed(2);

    setMilkQuantity(e.target.value);
    setMilkRecovery(recovery);
  };

  const handleAdditionalCratesCountChange = (e) => {
    const weightByCratesCount = e.target.value * 20;
    const newWeight =
      Number(ongoingData.wet_kernel_weight) + weightByCratesCount;
    setNewKernelWeight(newWeight);
    setAdditionalCratesCount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(false);

    const confirmData = `Batch number: ${data?.batch_number} | Order name: ${data?.order_name} | Order type: ${data?.order_type} | Milk quantity: ${milkQuantity} | Mixing tank in time: ${data?.mixing_tank_in_time} | Mix start time: ${data?.mixing_mix_start_time} | Mix finish time: ${data?.mixing_mix_finish_time} | Feeding tank in time: ${data?.mixing_feeding_tank_in_time} | Feed start time: ${data?.mixing_feed_start_time} | Operators: ${data?.mixing_operator_names} | Steam pressure: ${data?.mixing_steam_pressure_value} | Pressure pump value: ${data?.mixing_pressure_pump_value}`;

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
            lab_status: "ongoing",
            lab_added_at: serverTimestamp(),
            sd_status: "ongoing",
            sd_added_at: serverTimestamp(),
          }).then(async () => {
            Swal.fire({
              title: "Changes saved",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });

            e.target.reset();
            setIsLoading(false);
            navigate(`/mixing-section/${location}`);
          });
        }
      });

      try {
        const docRef = doc(db, "daily_production", dailyProductionDataInDb.id);
        await updateDoc(docRef, {
          ...updatedDailyProductionData,
        });

        console.log("successfully updated daily production data");
      } catch (error) {
        console.log(error);
      }

      if (newKernelWeight > 0) {
        try {
          const docRef = doc(db, "production_data", ongoingData.id);
          await updateDoc(docRef, {
            wet_kernel_weight: newKernelWeight,
          });

          console.log("successfully updated kernel weight");
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCurrentBatchInCutter = async () => {
      try {
        const list = [];
        const q = query(
          collection(db, "production_data"),
          where("mixing_status", "==", "ongoing"),
          where("location", "==", location),
          orderBy("wet_added_at", "asc")
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

    fetchCurrentBatchInCutter();
  }, [location]);

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
                location === "mdc" ? "SD 03" : "SD 04"
              } / Mixing Section`}
            />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="mb-2">
                <Link
                  to="/mixing-section"
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
                          defaultValue={ongoingData?.date}
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
                          defaultValue={ongoingData?.primary_batch_number}
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
                          defaultValue={ongoingData?.expeller_finish_time}
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
                          defaultValue={batchCode}
                          className="customInput disabled"
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="order_name"
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
                    </Row>

                    <Row>
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="order_type"
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

                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="mixing_milk_quantity"
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
                              borderTopRightRadius: "0.25rem",
                              borderBottomRightRadius: "0.25rem",
                              color: "#0d1b2a",
                            }}
                          >
                            kg
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="mixing_milk_recovery"
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

                    {location === "mdc" ? (
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
                            defaultValue={additionalCratesCount}
                            className="customInput"
                            onChange={handleAdditionalCratesCountChange}
                          />
                        </Form.Group>

                        {additionalCratesCount > 0 && (
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

                              <Form.Switch
                                type="switch"
                                id="is_informed"
                                label={
                                  isInformed === true
                                    ? "Informed"
                                    : "Not informed"
                                }
                                checked={isInformed}
                                onChange={(e) =>
                                  setIsInformed(e.target.checked)
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
                                className="customInput"
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </>
                        )}
                      </Row>
                    ) : (
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
                              required
                              className="customInput"
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
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Row>

                        <hr className="custom-hr-yellow" />
                      </>
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
                          required
                          className="customInput"
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
                          required
                          className="customInput"
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
                          required
                          className="customInput"
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
                          required
                          className="customInput"
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
                          required
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
                          Operator name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          required
                          className="customInput"
                          onChange={handleOperatorsChange}
                        />
                        <Figure.Caption className="tooltipText">
                          Type names with comma
                        </Figure.Caption>
                      </Form.Group>
                    </Row>

                    {batchNumber > 1 && (
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
                              required
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
                          required
                          className="customInput"
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
                        <Form.Label className="fw-bold">
                          Pressure pump
                        </Form.Label>

                        <Form.Control
                          type="number"
                          required
                          className="customInput"
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
                        <Form.Label className="fw-bold">Mix details</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
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

export default NewMixing;
