import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Figure, InputGroup } from "react-bootstrap";
import Swal from "sweetalert2";

import "../common.css";
import BackToTop from "../../components/backToTop/BackToTop";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import { db } from "../../config/firebase.config";
import ErrorMessage from "../../components/errorMessage/ErrorMessage";

const NewSprayDryer = () => {
  const [data, setData] = useState({});
  const [validated, setValidated] = useState(false);
  const [batchNumberData, setBatchNumberData] = useState({});
  const [expectedTime, setExpectedTime] = useState();

  // const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();
  const { location } = useParams();

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({
      ...data,
      // addedBy: loggedInUser,
      sectionName: "spraydryer",
      status: "updated",
      [id]: value,
    });
  };

  const handleOperatorsChange = (e) => {
    const str = e.target.value;
    const operators = str.split(",");
    setData({ ...data, operators });
  };

  const handleChangeAtomizerSize = (e) => {
    setExpectedTime("-");

    if (e.target.value === "0.8") setExpectedTime("1hr 20min");
    if (e.target.value === "1") setExpectedTime("1hr");
    if (e.target.value === "1.2") setExpectedTime("50min");

    setData({ ...data, atomizerSize: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmData = `Powder spray start time: ${data?.powderSprayStartTime} | Atomizer size: ${data?.atomizerSize} | Inlet temperature: ${data?.inletTemp} | Outlet temperature: ${data?.outletTemp} | Operators : ${data?.operators}`;

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
          confirmButtonColor: "#0d1b2a",
          confirmButtonText: "Yes",
          cancelButtonColor: "#ff007f",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const docRef = doc(db, "sd_section", batchNumberData.id);
            await updateDoc(docRef, {
              ...data,
            })
              .then(async () => {
                try {
                  const docRefLab = doc(
                    db,
                    "lab_section",
                    batchNumberData.lab_batch_id
                  );
                  await updateDoc(docRefLab, {
                    sd_batch_id: batchNumberData.id,
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
                navigate(`/sd-section/${location}`);
              })
              .catch((error) => {
                console.log("Error updating document:", error);
              });
          }
        });
      } catch (error) {
        console.log(error);
      }
    }

    setValidated(true);
  };

  useEffect(() => {
    const fetchCurrentBatchInMixing = async () => {
      try {
        const list = [];
        const q = query(
          collection(db, "sd_section"),
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

    fetchCurrentBatchInMixing();
  }, [location]);

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
              } / Spray Dryer Section`}
            />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="mb-2">
                <Link
                  to="/sd-section"
                  className="d-flex align-items-center customBackBtn"
                >
                  <ArrowBackIosIcon fontSize="small" /> Back
                </Link>
              </div>

              <div className="card-body formWrapper">
                {batchNumberData && !batchNumberData?.powderSprayStartTime ? (
                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                  >
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
                          defaultValue={batchNumberData.date}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="batchNumber"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          Batch number
                        </Form.Label>
                        <Form.Control
                          type="number"
                          disabled
                          className="customInput disabled"
                          defaultValue={batchNumberData.batchNumber}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="4"
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
                          value={batchNumberData.wetBatchNumber}
                          className="customInput disabled"
                        />
                      </Form.Group>
                    </Row>

                    <Row>
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="type"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">Recipe type</Form.Label>
                        <Form.Control
                          disabled
                          className="customInput text-capitalize disabled"
                          defaultValue={batchNumberData.recipeType}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="recipeName"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">Recipe name</Form.Label>
                        <Form.Control
                          type="text"
                          disabled
                          className="customInput text-capitalize disabled"
                          defaultValue={batchNumberData.recipeName}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="powderSprayStartTime"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          Powder spray start time
                        </Form.Label>
                        <Form.Control
                          type="time"
                          required
                          className="customInput"
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Row>

                    {/* TODO: */}
                    {/* <Row> */}
                    {/* <Form.Group
                      as={Col}
                      md="12"
                      controlId="singleBagDataTable"
                      className="mb-2"
                    >
                      <div>some title</div>
                      <TableInForm id='singleBagDataTable' />
                    </Form.Group> */}
                    {/* </Row> */}

                    <Row>
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="atomizerSize"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          Atomizer size
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="text"
                            aria-label="atomizer size"
                            aria-describedby="addon"
                            required
                            className="customInput"
                            onChange={handleChangeAtomizerSize}
                          />
                          <InputGroup.Text
                            id="addon"
                            style={{
                              borderTopRightRadius: "0.25rem",
                              borderBottomRightRadius: "0.25rem",
                              color: "#0d1b2a",
                            }}
                          >
                            mm
                          </InputGroup.Text>
                        </InputGroup>

                        {expectedTime && (
                          <Figure.Caption className="tooltipText">
                            Expected running time ~ approx.{" "}
                            <span className="fw-bold text-primary">
                              {expectedTime}
                            </span>
                          </Figure.Caption>
                        )}
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="inletTemp"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          Inlet temperature
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="text"
                            aria-label="inlet temperature"
                            aria-describedby="addon"
                            required
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
                            &deg;C
                          </InputGroup.Text>
                        </InputGroup>
                        <Figure.Caption className="tooltipText">
                          (230-240)&deg;C
                        </Figure.Caption>
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="outletTemp"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          Outlet temperature
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="text"
                            aria-label="outlet temperature"
                            aria-describedby="addon"
                            required
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
                            &deg;C
                          </InputGroup.Text>
                        </InputGroup>
                        <Figure.Caption className="tooltipText">
                          (90-95)&deg;C
                        </Figure.Caption>
                      </Form.Group>
                    </Row>

                    <Row>
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="operators"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          Operator name(s)
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

                      <Form.Group
                        as={Col}
                        md="8"
                        controlId="otherDetails"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">
                          Other details
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          className="customInput"
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Row>

                    <div className="mt-5">
                      <button type="submit" className="btn-submit customBtn">
                        Continue
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

export default NewSprayDryer;
