import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Col, Form, Row } from "react-bootstrap";

import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import DataTable from "../../components/dataTable/DataTable";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";
import { sprayDryerSectionColumns } from "../../data/dataTableSource";
import UseCurrentDate from "../../hooks/useCurrentDate";
import { db } from "../../config/firebase.config";

const SprayDryerSection = () => {
  const [isBreakdown, setIsBreakdown] = useState(false);
  const [data, setData] = useState({});
  const [updatedData, setUpdatedData] = useState({});
  const [ongoingBreakdown, setOngoingBreakdown] = useState();

  const currentDate = UseCurrentDate();
  // const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const { location } = useParams();
  const navigate = useNavigate();

  const handleBreakdownToggle = (e) => {
    setIsBreakdown(e.target.checked);
  };

  const handleBreakdownChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({
      ...data,
      date: currentDate,
      // addedBy: loggedInUser,
      sectionName: "sd",
      location: location,
      status: "ongoing",
      [id]: value,
    });
  };

  const handleBreakdownUpdateChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setUpdatedData({
      ...data,
      status: "completed",
      [id]: value,
    });
  };

  const handleBreakdownSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "breakdowns"), {
        ...data,
        timeStamp: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).then(() => {
        console.log("data added successfully");
        e.target.reset();
        navigate("/");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleBreakdownUpdate = async (e) => {
    e.preventDefault();

    try {
      const docRef = doc(db, "breakdowns", ongoingBreakdown?.id);
      await updateDoc(docRef, {
        ...updatedData,
        updatedAt: serverTimestamp(),
      });

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const q = query(
          collection(db, "breakdowns"),
          where("status", "==", "ongoing"),
          where("sectionName", "==", "sd"),
          where("location", "==", location)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setOngoingBreakdown({ id: doc.id, ...doc.data() });
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchLatestData();

    setIsBreakdown(ongoingBreakdown?.status === "ongoing");
  }, [ongoingBreakdown?.status, location]);

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
              <div className="card-body p-0">
                <Link
                  to="/sd-section"
                  className="d-flex align-items-center customClearBtn"
                >
                  <ArrowBackIosIcon fontSize="small" /> Back
                </Link>

                <div className="addNewBtnWrapper d-flex justify-content-between align-items-center">
                  {!isBreakdown && (
                    <Link
                      to="new"
                      className="addNewBtn customBtn"
                    >
                      <AddIcon />
                      Add new
                    </Link>
                  )}

                  <Form>
                    <Form.Check
                      type="switch"
                      id="breakdown-switch"
                      label="Breakdown"
                      checked={isBreakdown}
                      onChange={handleBreakdownToggle}
                    />
                  </Form>
                </div>

                {isBreakdown && (
                  <div className="mb-3 p-4 border border-1 border-danger rounded">
                    <Form onSubmit={handleBreakdownSubmit}>
                      <Row>
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="breakdownDetails"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold text-danger">
                            Details
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            defaultValue={ongoingBreakdown?.breakdownDetails}
                            disabled={ongoingBreakdown?.status === "ongoing"}
                            required={isBreakdown}
                            onChange={handleBreakdownChange}
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="informedTo"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold text-danger">
                            Informed to
                          </Form.Label>
                          <Form.Control
                            type="text"
                            defaultValue={ongoingBreakdown?.informedTo}
                            disabled={ongoingBreakdown?.status === "ongoing"}
                            required={isBreakdown}
                            onChange={handleBreakdownChange}
                          />
                        </Form.Group>

                        {ongoingBreakdown?.status === "ongoing" && (
                          <Form.Group
                            as={Col}
                            md="4"
                            controlId="finishTime"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold text-danger">
                              Finish time
                            </Form.Label>
                            <Form.Control
                              type="time"
                              required={isBreakdown}
                              onChange={handleBreakdownUpdateChange}
                            />
                          </Form.Group>
                        )}

                        <Form.Group as={Col} md="4" className="mb-2">
                          {ongoingBreakdown?.status === "ongoing" ? (
                            <button
                              className="btn-submit customBtn bg-danger text-light mt-md-4 px-md-5"
                              onClick={handleBreakdownUpdate}
                            >
                              <EditIcon />
                            </button>
                          ) : (
                            <button
                              type="submit"
                              className="btn-submit customBtn bg-danger text-light mt-md-4 px-md-5"
                            >
                              <CheckIcon />
                            </button>
                          )}
                        </Form.Group>
                      </Row>
                    </Form>
                  </div>
                )}

                <DataTable
                  collectionName="sd_section"
                  location={location}
                  columnName={sprayDryerSectionColumns}
                />
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

export default SprayDryerSection;
