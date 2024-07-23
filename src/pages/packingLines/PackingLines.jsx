import { useState } from "react";
import { Col, Figure, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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
  const [isEmpty, setIsEmpty] = useState(false);

  // TODO: Calculate completed powder quantity as percentage of total and show it in circular progress bar
  const [totalQuantity, setTotalQuantity] = useState(2000);
  const [currentQuantity, setCurrentQuantity] = useState(200);

  

  let percentage = 0;

  if (totalQuantity > 0 && currentQuantity < totalQuantity) {
    percentage = (currentQuantity / totalQuantity) * 100;
  }

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

    await getDocs(q).then((res) => {
      if (res.docs.length === 0) {
        setIsEmpty(true);
        setIsLoading(false);
        return;
      }

      setIsEmpty(false);

      res.forEach((doc) => {
        setData({ id: doc.id, ...doc.data() });
        setIsLoading(false);
      });
    });
  };

  const handleRadioButtonChange = (e) => {
    const id = e.target.id;
    setPackingType(id);
  };

  const handleBagNumbersChange = (e) => {
    const str = e.target.value;
    const bagNumbers = str.toLowerCase().split(",");
    setUpdatedData({ ...updatedData, packing_bag_numbers: bagNumbers });
  };

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setUpdatedData({
      ...updatedData,
      [id]: value,
      packing_type: packingType,
      packing_production_date: data?.date,
      production_batch_code: data?.batch_code,
      production_batch_id: data?.id,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmData = `Date: ${data.date} | Bag number(s): ${
      updatedData.packing_bag_numbers
    } | Job sheet number: ${
      updatedData.packing_job_sheet_number
    } | Carton box or Craft bag number: ${
      updatedData.packing_carton_box_number
        ? updatedData.packing_carton_box_number
        : updatedData.packing_craft_bag_number
    } | Time range - Start: ${
      updatedData.packing_packet_time_range_start
        ? updatedData.packing_packet_time_range_start
        : "N/A"
    } | Time range - End: ${
      updatedData.packing_packet_time_range_end
        ? updatedData.packing_packet_time_range_end
        : "N/A"
    } | Bag number range - Start: ${
      updatedData.packing_bag_number_range_start
    } | Bag number range - End: ${updatedData.packing_bag_number_range_end}`;

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
          await addDoc(collection(db, "packing_line_data"), {
            ...updatedData,
            packing_line_added_at: serverTimestamp(),
          }).then(() => {
            Swal.fire({
              title: "Changes saved",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
            e.target.reset();
            setIsLoading(false);
            setSearchInput("");
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
            <Breadcrumb title="Packing Lines" />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="row mb-2 subFormWrapper">
                <div className="col-md subFormParent">
                  <Form onSubmit={handleSearch}>
                    <Row>
                      <Form.Group as={Col} md="3" controlId="batch_code">
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

                      {isEmpty && (
                        <span className="mt-1 text-danger smallText">
                          No data found for this batch code
                        </span>
                      )}

                      <Form.Group as={Col} md="2">
                        <div className="mt-4">
                          <Form.Label className="fw-bold">
                            Select type
                          </Form.Label>

                          <Form.Check
                            name="group1"
                            type="radio"
                            id="packing_type_20"
                            label="20kg"
                            className="text-white"
                            onChange={handleRadioButtonChange}
                          />

                          <Form.Check
                            name="group1"
                            type="radio"
                            id="packing_type_other"
                            label="Other"
                            onChange={handleRadioButtonChange}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        controlId="packing_powder_fat"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">Fat</Form.Label>
                        <Form.Control
                          type="number"
                          className="customInput"
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        controlId="packing_powder_fat_layer"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">Fat layer</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="number"
                            aria-label="fat layer"
                            aria-describedby="addon"
                            step=".01"
                            className="customInput"
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
                            cm
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>
                    </Row>
                  </Form>
                </div>

                <hr className="custom-hr-yellow my-2" />

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
                            className="customInput text-capitalize disabled"
                            defaultValue={data.order_name}
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="order_name"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold" />
                          <div
                            style={{
                              width: "50px",
                              height: "50px",
                              color: "green",
                            }}
                          >
                            <CircularProgressbar
                              value={percentage}
                              text={`${percentage}%`}
                              styles={{
                                path: { stroke: "#129700" },
                                text: { fontSize: "25px" },
                              }}
                            />
                          </div>
                        </Form.Group>
                      </Row>

                      <Row>
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="packing_bag_numbers"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">
                            Sd 03 | 04 bag number(s)
                          </Form.Label>
                          <Form.Control
                            type="text"
                            required
                            className="customInput"
                            onChange={handleBagNumbersChange}
                          />
                          <Figure.Caption className="tooltipText">
                            Type bag numbers with commas
                          </Figure.Caption>
                        </Form.Group>

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
                              Craft bag code
                            </Form.Label>
                            <Form.Control
                              type="text"
                              required={packingType === "packing_type_20"}
                              className="customInput"
                              onChange={handleChange}
                            />
                          </Form.Group>
                        ) : (
                          <Form.Group
                            as={Col}
                            md="4"
                            controlId="packing_carton_box_number"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Carton box number
                            </Form.Label>
                            <Form.Control
                              type="text"
                              required={packingType === "packing_type_other"}
                              className="customInput"
                              onChange={handleChange}
                            />
                          </Form.Group>
                        )}
                      </Row>

                      <Row>
                        {packingType === "packing_type_other" && (
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
                                required
                                className="customInput"
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
                                required
                                className="customInput"
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </>
                        )}

                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="packing_bag_number_range_start"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">
                            Bag numbers range - Start
                          </Form.Label>
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
                          controlId="packing_bag_number_range_end"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">
                            Bag numbers range - End
                          </Form.Label>
                          <Form.Control
                            type="text"
                            required
                            className="customInput"
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Row>

                      <div className="border border-1 border-white rounded py-2 px-4 mb-2">
                        <Row>
                          <Form.Group
                            as={Col}
                            md="4"
                            controlId="packing_powder_collecting_qc_name"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Powder collecting QC name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              required
                              className="customInput"
                              onChange={handleChange}
                            />
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            md="4"
                            controlId="packing_carton_packing_qc_name"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Carton packing QC name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              required
                              className="customInput"
                              onChange={handleChange}
                            />
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            md="4"
                            controlId="packing_line_supervisor_name"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Line supervisor name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              required
                              className="customInput"
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Row>
                      </div>

                      <Row>
                        <Form.Group
                          as={Col}
                          md="12"
                          controlId="packing_remarks"
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
