import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import InputGroup from 'react-bootstrap/InputGroup';
import CheckIcon from '@mui/icons-material/Check';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import '../common.css';
import Header from '../../components/header/Header';
import SideBar from '../../components/sideBar/SideBar';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import Footer from '../../components/footer/Footer';
import BackToTop from '../../components/backToTop/BackToTop';
import useGetCurrentDate from '../../hooks/useCurrentDate';
import { db } from '../../config/firebase.config';

const Orders = () => {
  const [mdcData, setMdcData] = useState({});
  const [araliyaKeleData, setAraliyaKeleData] = useState({});
  const [mdcRecipeType, setMdcRecipeType] = useState('conventional');
  const [mdcOrderId, setMdcOrderId] = useState();
  const [araliyaKeleOrderId, setAraliyaKeleOrderId] = useState();
  const [retrieveData, setRetrieveData] = useState([]);

  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const currentDate = useGetCurrentDate();

  const araliyaKeleLocation = 'araliya_kele';
  const mdcLocation = 'mdc';
  const status = 'ongoing';
  const araliyaKeleRecipeType = 'organic';

  const mdcUpdateAt = retrieveData[1]?.updatedAt?.toDate().toLocaleString();
  const mdcUpdateBy = retrieveData[1]?.updatedBy?.displayName;
  const araliyaKeleUpdateAt = retrieveData[0]?.updatedAt
    ?.toDate()
    .toLocaleString();
  const araliyaKeleUpdateBy = retrieveData[0]?.updatedBy?.displayName;

  const handleMdcChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setMdcData({
      ...mdcData,
      date: currentDate,
      location: mdcLocation,
      recipeType: mdcRecipeType,
      status,
      updatedBy: loggedInUser,
      [id]: value,
    });
  };

  const handleAraliyaKeleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setAraliyaKeleData({
      ...araliyaKeleData,
      date: currentDate,
      location: araliyaKeleLocation,
      recipeType: araliyaKeleRecipeType,
      status,
      updatedBy: loggedInUser,
      [id]: value,
    });
  };

  const handleMdcSubmit = async (e) => {
    e.preventDefault();

    try {
      await setDoc(doc(db, 'orders', mdcOrderId), {
        ...mdcData,
        updatedAt: serverTimestamp(),
      });

      e.target.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAraliyaKeleSubmit = async (e) => {
    e.preventDefault();

    try {
      await setDoc(doc(db, 'orders', araliyaKeleOrderId), {
        ...araliyaKeleData,
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
        const q = query(collection(db, 'orders'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let list = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          setAraliyaKeleOrderId(list[0]?.id);
          setMdcOrderId(list[1]?.id);
          setRetrieveData(list);
        });

        return () => {
          unsubscribe();
        };
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
                  className="d-flex align-items-center customClearBtn"
                >
                  <ArrowBackIosIcon fontSize="small" /> Back
                </Link>
              </div>

              <div className="card-body formWrapper">
                <div className="row">
                  <div className="col-md-6">
                    <div className="card-body">
                      <p className="display-6">SD 03</p>

                      <Form onSubmit={handleMdcSubmit}>
                        <Row>
                          <Form.Group
                            as={Col}
                            md="6"
                            controlId="mdcType"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Recipe type
                            </Form.Label>
                            <Form.Select
                              required
                              className="customInput"
                              defaultValue={mdcRecipeType}
                              onChange={(e) => setMdcRecipeType(e.target.value)}
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
                            controlId="mdcRecipeName"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Recipe name
                            </Form.Label>
                            <Form.Control
                              required
                              className="customInput"
                              type="text"
                              onChange={handleMdcChange}
                            />
                          </Form.Group>
                        </Row>

                        <Row className="mb-3">
                          <Form.Group
                            as={Col}
                            md="6"
                            controlId="mdcOrderQuantity"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Order quantity
                            </Form.Label>
                            <InputGroup>
                              <Form.Control
                                type="number"
                                aria-label="order quantity"
                                aria-describedby="addon"
                                required
                                className="customInput"
                                onChange={handleMdcChange}
                              />
                              <InputGroup.Text
                                id="addon"
                                style={{
                                  borderTopRightRadius: '0.5rem',
                                  borderBottomRightRadius: '0.5rem',
                                  fontWeight: 'bold',
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
                              {retrieveData[1]?.mdcRecipeName}
                            </p>
                          </Col>
                        </Row>

                        <Row>
                          <Col className="d-flex col-md-6">
                            <p className="bodyText fw-light">Order quantity</p>
                          </Col>
                          <Col className="d-flex col-md-6">
                            <p className="bodyText fw-bold">
                              {retrieveData[1]?.mdcOrderQuantity}kg
                            </p>
                          </Col>
                        </Row>

                        <Row>
                          <div>
                            <button
                              type="submit"
                              className="btn-submit customBtn"
                            >
                              <CheckIcon className="me-2" />
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
                          <p className="smallText">
                            Last updated at {mdcUpdateAt}
                          </p>
                          <p className="smallText">by {mdcUpdateBy}</p>
                        </div>
                      </Form>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card-body">
                      <p className="display-6">Araliya kele</p>

                      <Form onSubmit={handleAraliyaKeleSubmit}>
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
                              defaultValue={araliyaKeleRecipeType}
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
                              onChange={handleAraliyaKeleChange}
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
                              Order quantity
                            </Form.Label>
                            <InputGroup>
                              <Form.Control
                                type="number"
                                aria-label="araliya kele order quantity"
                                aria-describedby="addon"
                                required
                                className="customInput"
                                onChange={handleAraliyaKeleChange}
                              />
                              <InputGroup.Text
                                id="addon"
                                style={{
                                  borderTopRightRadius: '0.5rem',
                                  borderBottomRightRadius: '0.5rem',
                                  fontWeight: 'bold',
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
                              {retrieveData[0]?.araliyaKeleRecipeName}
                            </p>
                          </Col>
                        </Row>

                        <Row>
                          <Col className="d-flex col-md-6">
                            <p className="bodyText fw-light">Order quantity</p>
                          </Col>
                          <Col className="d-flex col-md-6">
                            <p className="bodyText fw-bold">
                              {retrieveData[0]?.araliyaKeleOrderQuantity}kg
                            </p>
                          </Col>
                        </Row>

                        <Row>
                          <div>
                            <button
                              type="submit"
                              className="btn-submit customBtn"
                            >
                              <CheckIcon className="me-2" />
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
                          <p className="smallText">
                            Last updated at {araliyaKeleUpdateAt}
                          </p>
                          <p className="smallText">by {araliyaKeleUpdateBy}</p>
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
