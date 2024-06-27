import { useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CheckIcon from "@mui/icons-material/Check";
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

import "../common.css";
import BackToTop from "../../components/backToTop/BackToTop";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import { db } from "../../config/firebase.config";

const NewWet = () => {
  const [data, setData] = useState({});
  const [validated, setValidated] = useState(false);
  const [kernelWeight, setKernelWeight] = useState("300");
  const [quality, setQuality] = useState(true);
  const [date, setDate] = useState();
  const [nextBatchNumber, setNextBatchNumber] = useState();

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({
      ...data,
      date,
      quality,
      kernelWeight,
      batchNumber: Number(nextBatchNumber),
      addedBy: loggedInUser,
      sectionName: "wet",
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmData = `Date: ${data.date} | Batch number: ${data.batchNumber} | Tank number: ${data.tankNumber} | Kernel Weight: ${data.kernelWeight} | Blancher in time: ${data.blancherInTime} | Quality: ${data.quality} | Operator: ${data.operator}`;

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
            await addDoc(collection(db, "wet_section"), {
              ...data,
              timeStamp: serverTimestamp(),
            })
              .then(async (r) => {
                try {
                  await addDoc(collection(db, "cutter_section"), {
                    wet_batch_id: r.id,
                    batchNumber: data.batchNumber,
                    blancherStartTime: data.blancherInTime,
                    date: data.date,
                    status: "ongoing",
                    timeStamp: serverTimestamp(),
                  });
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
                navigate("/wet-section");
              });
          }
        });
      } catch (error) {
        console.log(error);
      }
    }

    setValidated(true);
  };

  const getLatestBatchNumber = async (e) => {
    setDate(e.target.value);

    try {
      const list = [];
      const q = query(
        collection(db, "wet_section"),
        where("date", "==", e.target.value),
        orderBy("batchNumber", "desc"),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      let res = list.filter((doc) => doc);

      if (res[0]) {
        setNextBatchNumber(Number(res[0].batchNumber) + 1);
      } else {
        setNextBatchNumber(1);
      }
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
                      md="2"
                      controlId="batchNumber"
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
                  </Row>

                  <Row>
                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="tankNumber"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Tank number</Form.Label>
                      <Form.Control
                        type="number"
                        className="customInput"
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="kernelWeight"
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
                      controlId="blancherInTime"
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
                  </Row>

                  <Row className="mb-5">
                    <Form.Group
                      as={Col}
                      md="3"
                      controlId="kernelQuality"
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

                    <Form.Group
                      as={Col}
                      md="6"
                      controlId="kernelQualityRemark"
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
