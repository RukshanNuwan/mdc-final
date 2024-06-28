import { Link, useLocation, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";
import { db } from "../../config/firebase.config";

const UpdateWet = () => {
  const { state } = useLocation();

  const [data, setData] = useState({});
  const [validated, setValidated] = useState(false);
  const [quality, setQuality] = useState(state.quality);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({
      ...data,
      quality,
      [id]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update wet_section & cutter_section
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
            // Update query
            const docRef = doc(db, "wet_section", state.id);
            await updateDoc(docRef, {
              ...data,
              updatedAt: serverTimestamp(),
            }).then(() => {
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

  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="col-md-12">
            <Breadcrumb title="Wet Section - Update" />
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
                        className="customInput"
                        defaultValue={state.date}
                        onChange={handleChange}
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
                      controlId="tankNumber"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Tank number</Form.Label>
                      <Form.Control
                        type="number"
                        className="customInput"
                        defaultValue={state.tankNumber}
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
                          className="customInput"
                          defaultValue={state.kernelWeight}
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
                      md="3"
                      controlId="blancherInTime"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">
                        Blancher in time
                      </Form.Label>
                      <Form.Control
                        type="time"
                        disabled
                        className="customInput disabled"
                        defaultValue={state.blancherInTime}
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
                      controlId="reasonForUpdate"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Remark</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        required
                        className="customInput"
                        defaultValue={state.kernelQualityRemark}
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
                        className="customInput"
                        defaultValue={state.operator}
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

export default UpdateWet;
