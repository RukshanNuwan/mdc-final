import { useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
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

const NewWet = () => {
  const [data, setData] = useState({});
  const [kernelWeight, setKernelWeight] = useState("300");
  const [quality, setQuality] = useState(true);
  const [date, setDate] = useState();
  const [nextBatchNumber, setNextBatchNumber] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const getLatestBatchNumber = async (e) => {
    setDate(e.target.value);

    try {
      const list = [];
      const q = query(
        collection(db, "production_data"),
        where("date", "==", e.target.value),
        orderBy("primary_batch_number", "desc"),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      let res = list.filter((doc) => doc);

      if (res[0]) {
        setNextBatchNumber(Number(res[0].primary_batch_number) + 1);
      } else {
        setNextBatchNumber(1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({
      ...data,
      // common data
      date,
      primary_batch_number: Number(nextBatchNumber),
      expeller_finish_time: "",
      batch_number: 0,
      order_name: "",
      order_type: "",
      expected_powder_quantity: 0,
      location: "",

      // wet section data
      [id]: value,
      wet_kernel_weight: kernelWeight,
      wet_kernel_quality: quality,

      // cutter section data
      cutter_heat_valve: false,
      cutter_expeller_start_time: "",
      cutter_expeller_delay_time: "",
      cutter_operator_name: "",
      cutter_finish_time: "",
      cutter_special_notes: "",
      cutter_status: "ongoing",

      // mixing section data
      mixing_milk_quantity: 0,
      mixing_milk_recovery: "",
      mixing_additional_crates_count: 0,
      mixing_additional_crates_is_informed: "",
      mixing_additional_crates_informed_to: "",
      mixing_tank_in_time: "",
      mixing_mix_start_time: "",
      mixing_mix_finish_time: "",
      mixing_feeding_tank_in_time: "",
      mixing_feed_start_time: "",
      mixing_operator_names: null,
      mixing_prev_batch_raw_ph: "",
      mixing_prev_batch_raw_tss: "",
      mixing_steam_pressure_value: "",
      mixing_pressure_pump_value: "",
      mixing_mix_details: "",
      mixing_status: "",

      // lab section data
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

      // sd section data
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
      sd_status: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(false);

    const confirmData = `Date: ${data.date} | Batch number: ${data.primary_batch_number} | Tank number: ${data.wet_tank_number} | Kernel Weight: ${data.wet_kernel_weight} | Blancher in time: ${data.blancher_in_time} | Quality: ${data.wet_kernel_quality} | Operator: ${data.wet_operator_name}`;

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

          await addDoc(collection(db, "production_data"), {
            ...data,
            wet_added_at: serverTimestamp(),
          }).then(() => {
            Swal.fire({
              title: "Changes saved",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });

            e.target.reset();
            setIsLoading(false);
            navigate("/wet-section");
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
            <Breadcrumb title="Wet Section" />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="mb-2">
                <Link
                  to="/wet-section"
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
                        required
                        className="customInput"
                        onChange={(e) => getLatestBatchNumber(e)}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="primary_batch_number"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Batch number</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        className="customInput"
                        defaultValue={nextBatchNumber}
                        onChange={(e) => setNextBatchNumber(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="wet_tank_number"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Tank number</Form.Label>
                      <Form.Control
                        type="number"
                        className="customInput"
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="wet_kernel_weight"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Kernel weight</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          aria-label="kernel weight"
                          aria-describedby="addon"
                          required
                          className="customInput"
                          defaultValue={kernelWeight}
                          onChange={(e) => setKernelWeight(e.target.value)}
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
                      controlId="blancher_in_time"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Blancher in time
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
                      controlId="wet_kernel_quality"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Kernel quality
                      </Form.Label>

                      <Form.Switch
                        type="switch"
                        id="kernel_quality"
                        label={quality === true ? "Good" : "Spoiled"}
                        checked={quality}
                        onChange={(e) => setQuality(e.target.checked)}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="wet_operator_name"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Operator name</Form.Label>
                      <Form.Control
                        type="text"
                        required
                        className="customInput"
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="8"
                      controlId="wet_remark"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Remark</Form.Label>
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

export default NewWet;
