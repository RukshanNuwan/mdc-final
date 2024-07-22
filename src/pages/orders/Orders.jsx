import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import "../common.css";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";
import useGetCurrentDate from "../../hooks/useCurrentDate";
import { db } from "../../config/firebase.config";

const Orders = () => {
  const [sd3Data, setSd3Data] = useState({});
  const [sd4Data, setSd4Data] = useState({});
  const [sd3RecipeType, setSd3RecipeType] = useState("conventional");
  const [sd3OrderId, setSd3OrderId] = useState();
  const [sd4OrderId, setSd4OrderId] = useState();
  const [ordersData, setOrdersData] = useState([]);

  // const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const currentDate = useGetCurrentDate();

  const status = "ongoing";
  const sd4RecipeType = "organic";

  const sd3UpdateAt = ordersData[1]?.updatedAt?.toDate().toLocaleString();
  const sd4UpdateAt = ordersData[0]?.updatedAt?.toDate().toLocaleString();

  const handleSd3Change = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setSd3Data({
      ...sd3Data,
      [id]: value,
      date: currentDate,
      location: "mdc",
      recipeType: sd3RecipeType,
      status,
      // updatedBy: loggedInUser,
    });
  };

  const handleSd4Change = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setSd4Data({
      ...sd4Data,
      [id]: value,
      date: currentDate,
      location: "araliya_kele",
      recipeType: sd4RecipeType,
      status,
      // updatedBy: loggedInUser,
    });
  };

  const handleSd3Submit = async (e) => {
    e.preventDefault();

    try {
      await setDoc(doc(db, "orders", sd3OrderId), {
        ...sd3Data,
        updatedAt: serverTimestamp(),
      });

      e.target.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSd4Submit = async (e) => {
    e.preventDefault();

    try {
      await setDoc(doc(db, "orders", sd4OrderId), {
        ...sd4Data,
        updatedAt: serverTimestamp(),
      });

      e.target.reset();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchDataFromCollection = async () => {
      try {
        const q = query(collection(db, "orders"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          let list = [];
          list.push({ id: doc.id, ...doc.data() });

          console.log(list);

          setSd3OrderId(list[0]?.id);
          setSd4OrderId(list[1]?.id);
          setOrdersData(list);
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchDataFromCollection();
  }, []);

  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="col-md-12">
            <Breadcrumb title="Orders" />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="mb-2">
                <Link
                  to="/"
                  className="d-flex align-items-center customBackBtn"
                >
                  <ArrowBackIosIcon fontSize="small" /> Back
                </Link>
              </div>

              <div className="card-body formWrapper">
                <div className="row">
                  <div className="col-md-6">
                    <div className="card-body">
                      <p className="display-6 text-white">SD - 03</p>

                      <Form onSubmit={handleSd3Submit}>
                        <Row>
                          <Form.Group
                            as={Col}
                            md="6"
                            controlId="sd3RecipeType"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Recipe type
                            </Form.Label>
                            <Form.Select
                              required
                              className="customInput"
                              defaultValue={sd3RecipeType}
                              onChange={(e) => setSd3RecipeType(e.target.value)}
                            >
                              <option value="conventional">
                                Conventional Recipe
                              </option>
                              <option value="organic">Organic Recipe</option>
                            </Form.Select>
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            md="6"
                            controlId="sd3RecipeName"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Recipe name
                            </Form.Label>
                            <Form.Control
                              required
                              className="customInput"
                              type="text"
                              onChange={handleSd3Change}
                            />
                          </Form.Group>
                        </Row>

                        <Row className="mb-3">
                          <Form.Group
                            as={Col}
                            md="6"
                            controlId="sd3TotalOrderQuantity"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Total order quantity
                            </Form.Label>
                            <InputGroup>
                              <Form.Control
                                type="number"
                                aria-label="order quantity"
                                aria-describedby="addon"
                                required
                                className="customInput"
                                onChange={handleSd3Change}
                              />
                              <InputGroup.Text
                                id="addon"
                                style={{
                                  borderTopRightRadius: "0.25rem",
                                  borderBottomRightRadius: "0.25rem",
                                  fontWeight: "bold",
                                }}
                              >
                                kg
                              </InputGroup.Text>
                            </InputGroup>
                          </Form.Group>
                        </Row>

                        <Row>
                          <Col className="d-flex col-md-6">
                            <p className="bodyText fw-light">Order name</p>
                          </Col>
                          <Col className="d-flex col-md-6">
                            <p className="bodyText fw-bold text-capitalize">
                              {ordersData[1]?.mdcRecipeName}
                            </p>
                          </Col>
                        </Row>

                        <Row>
                          <Col className="d-flex col-md-6">
                            <p className="bodyText fw-light">Order quantity</p>
                          </Col>
                          <Col className="d-flex col-md-6">
                            <p className="bodyText fw-bold">
                              {ordersData[1]?.mdcOrderQuantity}kg
                            </p>
                          </Col>
                        </Row>

                        <Row>
                          <div>
                            <button
                              type="submit"
                              className="btn-submit customBtn"
                            >
                              Submit
                            </button>
                            <button
                              type="reset"
                              className="customBtn customClearBtn"
                            >
                              Cancel
                            </button>
                          </div>
                        </Row>

                        <div className="d-flex flex-column align-items-end mt-3">
                          <p className="smallText text-white">
                            Last updated at {sd3UpdateAt}
                          </p>
                          {/* <p className="smallText">by {mdcUpdateBy}</p> */}
                        </div>
                      </Form>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card-body">
                      <p className="display-6 text-white">SD - 04</p>

                      <Form onSubmit={handleSd4Submit}>
                        <Row>
                          <Form.Group
                            as={Col}
                            md="6"
                            controlId="araliyaKeleType"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Recipe type
                            </Form.Label>
                            <Form.Select
                              disabled
                              className="customInput"
                              defaultValue={sd4RecipeType}
                            >
                              <option value="organic">Organic Recipe</option>
                            </Form.Select>
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            md="6"
                            controlId="araliyaKeleRecipeName"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Recipe name
                            </Form.Label>
                            <Form.Control
                              required
                              className="customInput"
                              type="text"
                              onChange={handleSd4Change}
                            />
                          </Form.Group>
                        </Row>

                        <Row className="mb-3">
                          <Form.Group
                            as={Col}
                            md="6"
                            controlId="araliyaKeleOrderQuantity"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Total order quantity
                            </Form.Label>
                            <InputGroup>
                              <Form.Control
                                type="number"
                                aria-label="araliya kele order quantity"
                                aria-describedby="addon"
                                required
                                className="customInput"
                                onChange={handleSd4Change}
                              />
                              <InputGroup.Text
                                id="addon"
                                style={{
                                  borderTopRightRadius: "0.25rem",
                                  borderBottomRightRadius: "0.25rem",
                                  fontWeight: "bold",
                                }}
                              >
                                kg
                              </InputGroup.Text>
                            </InputGroup>
                          </Form.Group>
                        </Row>

                        <Row>
                          <Col className="d-flex col-md-6">
                            <p className="bodyText fw-light">Order name</p>
                          </Col>
                          <Col className="d-flex col-md-6">
                            <p className="bodyText fw-bold text-capitalize">
                              {ordersData[0]?.araliyaKeleRecipeName}
                            </p>
                          </Col>
                        </Row>

                        <Row>
                          <Col className="d-flex col-md-6">
                            <p className="bodyText fw-light">Order quantity</p>
                          </Col>
                          <Col className="d-flex col-md-6">
                            <p className="bodyText fw-bold">
                              {ordersData[0]?.araliyaKeleOrderQuantity}kg
                            </p>
                          </Col>
                        </Row>

                        <Row>
                          <div>
                            <button
                              type="submit"
                              className="btn-submit customBtn"
                            >
                              Submit
                            </button>
                            <button
                              type="reset"
                              className="customBtn customClearBtn"
                            >
                              Cancel
                            </button>
                          </div>
                        </Row>

                        <div className="d-flex flex-column align-items-end mt-3">
                          <p className="smallText text-white">
                            Last updated at {sd4UpdateAt}
                          </p>
                          {/* <p className="smallText">by {araliyaKeleUpdateBy}</p> */}
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
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

export default Orders;
