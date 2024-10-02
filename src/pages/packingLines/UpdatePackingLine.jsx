import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import { db } from "../../config/firebase.config";

const UpdatePackingLine = () => {
  const { state } = useLocation();

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({ ...data, [id]: value });
  };

  const handleSubmit = async (e) => {
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

          const docRef = doc(db, "packing_line_data", state.id);
          await updateDoc(docRef, {
            ...data,
            packing_line_updated_at: serverTimestamp(),
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
              navigate("/packing-lines");
            })
            .catch((error) => {
              console.log(error);
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
          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="row d-flex justify-content-between align-items-start mb-2">
                <div className="subFormWrapper">
                  <div className="col-md subFormParent">
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="packing_line_date"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">
                            Packing date
                          </Form.Label>
                          <Form.Control
                            type="date"
                            required
                            className="customInput text-capitalize"
                            defaultValue={state.packing_line_date}
                            onChange={handleChange}
                          />
                        </Form.Group>

                        {state.packing_type === "packing_type_other" && (
                          <>
                            <Form.Group
                              as={Col}
                              md="3"
                              controlId="packing_packet_time_range_start"
                              className="mb-2"
                            >
                              <Form.Label className="fw-bold">
                                Time range - Start
                              </Form.Label>
                              <Form.Control
                                type="time"
                                step="1"
                                className="customInput"
                                defaultValue={
                                  state.packing_packet_time_range_start
                                }
                                onChange={handleChange}
                              />
                            </Form.Group>

                            <Form.Group
                              as={Col}
                              md="3"
                              controlId="packing_packet_time_range_end"
                              className="mb-2"
                            >
                              <Form.Label className="fw-bold">
                                Time range - End
                              </Form.Label>
                              <Form.Control
                                type="time"
                                step="1"
                                className="customInput"
                                defaultValue={
                                  state.packing_packet_time_range_end
                                }
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </>
                        )}
                      </Row>

                      <div className="mt-5">
                        <button
                          type="submit"
                          className="btn-submit customBtn customBtnUpdate"
                          disabled={isLoading}
                        >
                          <div className="d-flex align-items-center justify-content-center gap-2">
                            {isLoading && (
                              <Spinner animation="border" size="sm" />
                            )}
                            <p>Update</p>
                          </div>
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default UpdatePackingLine;
