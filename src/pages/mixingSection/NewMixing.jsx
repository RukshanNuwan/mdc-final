import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  addDoc,
  collection,
  doc,
  getDocs,
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
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import { db } from "../../config/firebase.config";
import { orders } from "../../constants";

const NewMixing = () => {
  const [data, setData] = useState({});
  const [milkQuantity, setMilkQuantity] = useState();
  const [milkRecovery, setMilkRecovery] = useState("");
  const [ongoingData, setOngoingData] = useState({});
  const [additionalCratesCount, setAdditionalCratesCount] = useState(0);
  const [newKernelWeight, setNewKernelWeight] = useState(0);
  const [isInformed, setIsInformed] = useState(false);
  const [batchNumber, setBatchNumber] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isFillingHoleCleaned, setIsFillingHoleCleaned] = useState(false);
  const [isOutputTapCleaned, setIsOutputTapCleaned] = useState(false);
  const [lastBatchNumber, setLastBatchNumber] = useState();
  const [batchCode, setBatchCode] = useState();
  const [isTransferred, setIsTransferred] = useState(false);
  const [productionDate, setProductionDate] = useState();

  // const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();
  const { location } = useParams();

  let currentDate;

  if (ongoingData?.date) {
    currentDate = new Date(ongoingData?.date);
  } else {
    currentDate = new Date(productionDate);
  }
  const year = ("" + currentDate.getFullYear()).substring(2);
  const month = currentDate.getMonth() + 1;
  const monthStr = month < 10 ? "0" + month : month;
  const date = currentDate.getDate();
  const dateStr = date < 10 ? "0" + date : date;

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
    if (ongoingData?.date) {
      const fetchLastBatchNumber = async () => {
        const list = [];
        const q = query(
          collection(db, "production_data"),
          where("mixing_status", "==", "completed"),
          where("location", "==", location),
          where("date", "==", ongoingData?.date),
          orderBy("wet_added_at", "desc")
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        setLastBatchNumber(list[0]?.batch_number);
      };

      fetchLastBatchNumber();
    }
  }, [ongoingData, location]);

  useEffect(() => {
    let lastBatchNumberInt = lastBatchNumber + 1;

    if (lastBatchNumber) {
      setBatchNumber(lastBatchNumberInt);
    } else {
      setBatchNumber(1);
    }

    const batchCode = `${
      location === "mdc" ? "SD3" : "SD4"
    }${year}${monthStr}${dateStr}${lastBatchNumber ? lastBatchNumberInt : 1}`;

    setBatchCode(batchCode);
    setData({
      ...data,
      batch_number: lastBatchNumber ? lastBatchNumberInt : 1,
      batch_code: batchCode,
    });
  }, [dateStr, lastBatchNumber, location, monthStr, year]);

  const handleDateChange = (e) => {
    setProductionDate(e.target.value);
    setData({ ...data, date: e.target.value });
  };

  const handleBatchNumberChange = (e) => {
    setBatchNumber(Number(e.target.value));

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

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({
      ...data,
      [id]: value,
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

  const handleSelectChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({ ...data, [id]: value });
  };

  const handleOperatorsChange = (e) => {
    const str = e.target.value;
    const operators = str.split(",");
    setData({ ...data, mixing_operator_names: operators });
  };

  const handleMilkRecovery = (e) => {
    let recovery;

    if (ongoingData?.wet_kernel_weight) {
      recovery = (
        (e.target.value / ongoingData?.wet_kernel_weight) *
        100
      ).toFixed(2);
    } else {
      recovery = ((e.target.value / 300) * 100).toFixed(2);
    }

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

  const handleTransferredChange = (e) => {
    setIsTransferred(e.target.checked);

    // let updatedDailyProductionTotalBatchInSd3 =
    //   dailyProductionDataInDb.totalBatchCountInMdc;
    // let updatedDailyProductionTotalBatchInSd4 =
    //   dailyProductionDataInDb.totalBatchCountInAraliyaKele;

    // if (e.target.checked) {
    //   updatedDailyProductionTotalBatchInSd3++;
    //   updatedDailyProductionTotalBatchInSd4--;
    // }

    Swal.fire({
      title: "Transfer to SD 03",
      text: "Do you want to transferred this batch to SD 03?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ff007f",
      confirmButtonText: "Yes",
      cancelButtonColor: "#0d1b2a",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const docRef = doc(db, "production_data", ongoingData.id);
          await updateDoc(docRef, {
            ...data,
            location: "mdc",
            mixing_mix_details: "Transfer from SD 04 to SD 03",
          }).then(async () => {
            // try {
            // const docRef = doc(
            //   db,
            //   "daily_production",
            //   dailyProductionDataInDb.id
            // );

            // await updateDoc(docRef, {
            //   totalBatchCountInMdc: updatedDailyProductionTotalBatchInSd3,
            //   totalBatchCountInAraliyaKele:
            //     updatedDailyProductionTotalBatchInSd4,
            // }).then(() => {
            Swal.fire({
              title: "Batch transferred",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });

            navigate("/mixing-section");
            // });
            // } catch (error) {
            //   console.log(error);
            // }
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        setIsTransferred(false);
      }
    });
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

          if (ongoingData) {
            const docRef = doc(db, "production_data", ongoingData.id);
            await updateDoc(docRef, {
              ...data,
              lab_status: "ongoing",
              lab_added_at: serverTimestamp(),
              sd_status: "ongoing",
              sd_added_at: serverTimestamp(),
            })
              .then(async () => {
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
              })
              .then(async () => {
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
          } else {
            await addDoc(collection(db, "production_data"), {
              ...data,
              expected_powder_quantity: 0,
              location: location,
              wet_added_at: serverTimestamp(),
              primary_batch_number: null,
              mixing_mix_details: "Outside milk",
              lab_sample_in_time: "",
              lab_test_start_time: "",
              lab_raw_ph: "",
              lab_raw_tss: "",
              lab_raw_fat: "",
              lab_row_taste: false,
              lab_row_color: false,
              lab_row_odor: false,
              lab_mix_ph: "",
              lab_mix_tss: "",
              lab_mix_fat: "",
              lab_mix_taste: false,
              lab_mix_color: false,
              lab_mix_odor: false,
              lab_mix_issue: false,
              lab_mix_issue_informed_to: "",
              lab_mix_issue_details: "",
              lab_powder_moisture: "",
              lab_powder_fat: "",
              lab_powder_fat_layer: "",
              lab_powder_fat_layer_time: "",
              lab_powder_taste: false,
              lab_powder_color: false,
              lab_powder_odor: false,
              lab_powder_solubility: false,
              lab_powder_free_flowing: false,
              lab_powder_bulk_density: "",
              lab_powder_issue: false,
              lab_powder_issue_informed_to: "",
              lab_powder_issue_details: "",
              lab_technician_name: "",
              lab_status: "ongoing",
              lab_added_at: serverTimestamp(),
              sd_powder_spray_start_time: "",
              sd_atomizer_size: "",
              sd_inlet_temp: "",
              sd_outlet_temp: "",
              sd_operator_names: null,
              sd_other_details: "",
              sd_total_powder_quantity: "",
              sd_powder_recovery: "",
              sd_rp_quantity: "",
              sd_batch_finish_time: "",
              sd_special_notes: "",
              sd_status: "ongoing",
              sd_added_at: serverTimestamp(),
            }).then(() => {
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
          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="mb-2 d-flex align-items-center justify-content-between">
                <Link
                  to="/mixing-section"
                  className="d-flex align-items-center customBackBtn"
                >
                  <ArrowBackIosIcon fontSize="small" /> Back
                </Link>

                {location === "araliya_kele" && ongoingData && (
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
                        className="customInput"
                        required
                        defaultValue={ongoingData?.date}
                        onChange={handleDateChange}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
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
                        className="customInput"
                        defaultValue={ongoingData?.expeller_finish_time}
                        onChange={handleChange}
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
                        SD batch number
                      </Form.Label>
                      <Form.Control
                        type="number"
                        defaultValue={batchNumber}
                        className="customInput"
                        onChange={handleBatchNumberChange}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="batch_code"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">SD batch code</Form.Label>
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
                      <Form.Select
                        required
                        className="customInput"
                        defaultValue="fat_60_65"
                        onChange={handleSelectChange}
                      >
                        <option disabled selected>
                          Select order name
                        </option>
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
                      <Form.Select
                        required
                        className="customInput"
                        defaultValue="conventional"
                        onChange={handleSelectChange}
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
                      <Form.Label className="fw-bold">Milk quantity</Form.Label>
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
                              onChange={(e) => setIsInformed(e.target.checked)}
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
                      <Form.Label className="fw-bold">Operator name</Form.Label>
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
                      <Form.Label className="fw-bold">Pressure pump</Form.Label>

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
                      <Form.Label className="fw-bold">Remarks</Form.Label>
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
                        {isLoading && <Spinner animation="border" size="sm" />}
                        <p>Continue</p>
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

export default NewMixing;
