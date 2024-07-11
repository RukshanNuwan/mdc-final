import { useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { collection, getDocs, query, where } from "firebase/firestore";

import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import { db } from "../../config/firebase.config";

const PackingLines = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState({});
  const [updatedData, setUpdatedData] = useState({});
  const [packingType, setPackingType] = useState("");

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setData({});

    const q = query(
      collection(db, "production_data"),
      where("batch_code", "==", searchInput)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setData({ id: doc.id, ...doc.data() });
      setIsLoading(false);
    });
  };

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setUpdatedData({
      ...updatedData,
      [id]: value,
    });
  };

  // const str = e.target.value;
  // const operators = str.split(",");
  // setData({ ...data, mixing_operator_names: operators });

  const handleRadioButtonChange = (e) => {
    const id = e.target.id;
    setPackingType(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setUpdatedData({});
    setIsLoading(false);
  };

  console.log(data);

  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="col-md-12">
            <Breadcrumb title="Packing Lines" />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="row mb-2 subFormWrapper">
                <div className="col-md subFormParent">
                  <Form onSubmit={handleSearch}>
                    <Row>
                      <Form.Group
                        as={Col}
                        md="2"
                        xs="6"
                        controlId="packing_type"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">20kg</Form.Label>
                        <Form.Check
                          name="group1"
                          type="radio"
                          id="packing_type_20"
                          onChange={handleRadioButtonChange}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="2"
                        xs="6"
                        controlId="packing_type"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">1kg & other</Form.Label>
                        <Form.Check
                          name="group1"
                          type="radio"
                          id="packing_type_other"
                          onChange={handleRadioButtonChange}
                        />
                      </Form.Group>

                      <Form.Group as={Col} md="4" controlId="date">
                        <Form.Label className="fw-bold">Batch code</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          className="customInput"
                          placeholder="Enter batch code (SD324073124)"
                          onChange={handleInputChange}
                        />
                      </Form.Group>

                      <div className="col">
                        <button
                          type="submit"
                          className="d-flex align-items-center justify-content-center mt-md-4 gap-2 subform-btn-submit customBtn"
                        >
                          {isLoading && (
                            <Spinner animation="border" size="sm" />
                          )}
                          {isLoading ? "Searching..." : "Search"}
                        </button>
                      </div>
                    </Row>
                  </Form>
                </div>

                <hr className="custom-hr-yellow" />

                {data.id && (
                  <div>
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="date"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">
                            Production date
                          </Form.Label>
                          <Form.Control
                            type="date"
                            disabled
                            className="customInput disabled"
                            defaultValue={data.date}
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="primary_batch_number"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">
                            Wet batch number
                          </Form.Label>
                          <Form.Control
                            type="number"
                            disabled
                            className="customInput disabled"
                            defaultValue={data.primary_batch_number}
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="batch_number"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">
                            Batch number
                          </Form.Label>
                          <Form.Control
                            type="number"
                            disabled
                            className="customInput disabled"
                            defaultValue={data.batch_number}
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="order_name"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">
                            Order name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            disabled
                            className="customInput disabled"
                            defaultValue={data.order_name}
                          />
                        </Form.Group>
                      </Row>

                      <Row>
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="packing_bag_numbers" // TODO: this could be changed -> like sd operator names
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">
                            Bag number(s)
                          </Form.Label>
                          <Form.Control
                            type="number"
                            required
                            className="customInput"
                            onChange={handleChange}
                          />
                        </Form.Group>

                        {/* TODO: Bag number range - two inputs (if 20kg = no time range) */}

                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="packing_job_sheet_number"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">
                            Job sheet number
                          </Form.Label>
                          <Form.Control
                            type="number"
                            required
                            className="customInput"
                            onChange={handleChange}
                          />
                        </Form.Group>

                        {packingType === "packing_type_20" ? (
                          <Form.Group
                            as={Col}
                            md="4"
                            controlId="packing_craft_bag_number"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Craft bag number
                            </Form.Label>
                            <Form.Control
                              type="number"
                              required={packingType === "packing_type_20"}
                              className="customInput"
                              onChange={handleChange}
                            />
                          </Form.Group>
                        ) : (
                          <Form.Group
                            as={Col}
                            md="4"
                            controlId="packing_carton_number"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Carton number
                            </Form.Label>
                            <Form.Control
                              type="number"
                              required={packingType === "packing_type_other"}
                              className="customInput"
                              onChange={handleChange}
                            />
                          </Form.Group>
                        )}
                      </Row>

                      <Row>
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="packing_packet_time_range_start"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">
                            Time range (Start)
                          </Form.Label>
                          <Form.Control
                            type="time"
                            step="1"
                            required
                            className="customInput"
                            onChange={handleChange}
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="packing_packet_time_range_end"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">
                            Time range (End)
                          </Form.Label>
                          <Form.Control
                            type="time"
                            step="1"
                            required
                            className="customInput"
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Row>

                      <Row>{/* bag numbers */}</Row>

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

                        <button
                          type="reset"
                          className="customBtn customClearBtn"
                        >
                          Clear
                        </button>
                      </div>
                    </Form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PackingLines;
