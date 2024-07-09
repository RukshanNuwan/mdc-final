import { Link, useLocation, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Spinner } from "react-bootstrap";

import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";
import { db } from "../../config/firebase.config";

const UpdateWet = () => {
  const { state } = useLocation();

  const [data, setData] = useState({});
  const [quality, setQuality] = useState(state.wet_kernel_quality);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({
      ...data,
      [id]: value,
      wet_kernel_quality: quality,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(false);

    try {
      Swal.fire({
        title: "Do you want to save the changes?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#ff007f",
        confirmButtonText: "Yes",
        cancelButtonColor: "#0d1b2a",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setIsLoading(true);

          const docRef = doc(db, "production_data", state.id);
          await updateDoc(docRef, {
            ...data,
            wet_updated_at: serverTimestamp(),
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
            <Breadcrumb title="Wet Section - Update" />
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
                        disabled
                        className="customInput disabled"
                        defaultValue={state.date}
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
                        type="number"
                        disabled
                        className="customInput disabled"
                        defaultValue={state.primary_batch_number}
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
                        defaultValue={state.wet_tank_number}
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
                          className="customInput"
                          defaultValue={state.wet_kernel_weight}
                          onChange={handleChange}
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
                        className="customInput"
                        defaultValue={state.blancher_in_time}
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
                        className="customInput"
                        defaultValue={state.wet_operator_name}
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
                        required
                        className="customInput"
                        defaultValue={state.wet_remark}
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
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        {isLoading && <Spinner animation="border" size="sm" />}
                        <p>Update</p>
                      </div>
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
