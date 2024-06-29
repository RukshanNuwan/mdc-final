import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Col, Form, Row} from "react-bootstrap";
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

import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import DataTable from "../../components/dataTable/DataTable";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";
import {cutterSectionColumns} from "../../data/dataTableSource";
import useCurrentDate from "../../hooks/useCurrentDate";
import {db} from "../../config/firebase.config";

const CutterSection = () => {
  const [isBreakdown, setIsBreakdown] = useState(false);
  const [data, setData] = useState({});
  const [updatedData, setUpdatedData] = useState({});
  const [ongoingBreakdown, setOngoingBreakdown] = useState();

  const currentDate = useCurrentDate();
  // const loggedInUser = JSON.parse(localStorage.getItem("user"));

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
      sectionName: "cutter",
      location: "mdc",
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
            where("sectionName", "==", "cutter")
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setOngoingBreakdown({id: doc.id, ...doc.data()});
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchLatestData();

    setIsBreakdown(ongoingBreakdown?.status === "ongoing");
  }, [ongoingBreakdown?.status]);

  return (
      <>
        <Header/>
        <SideBar/>

        <main id="main" className="main">
          <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
            <div className="col-md-12">
              <Breadcrumb title="Cutter Section"/>
            </div>

            <div className="pe-0 px-xs-0">
              <div className="card border-0">
                <div className="card-body p-0">
                  <div className="addNewBtnWrapper d-flex justify-content-between align-items-center">
                    {!isBreakdown && (
                        <Link
                            to="new"
                            className="addNewBtn customBtn"
                        >
                          <AddIcon/>
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
                      <div className="mb-3 p-4 dangerZone">
                        <Form onSubmit={handleBreakdownSubmit}>
                          <Row>
                            <Form.Group
                                as={Col}
                                md="4"
                                controlId="informedTo"
                                className="mb-2"
                            >
                              <Form.Label className="fw-bold">
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

                            <Form.Group
                                as={Col}
                                md="8"
                                controlId="breakdownDetails"
                                className="mb-2"
                            >
                              <Form.Label className="fw-bold">
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

                            {ongoingBreakdown?.status === "ongoing" && (
                                <Form.Group
                                    as={Col}
                                    md="4"
                                    controlId="finishTime"
                                    className="mb-2"
                                >
                                  <Form.Label className="fw-bold">
                                    Finish time
                                  </Form.Label>
                                  <Form.Control
                                      type="time"
                                      required={isBreakdown}
                                      onChange={handleBreakdownUpdateChange}
                                  />
                                </Form.Group>
                            )}
                          </Row>

                          <div className='mt-5'>
                            <button
                                type="submit"
                                className="btn-submit customBtn redZoneBtn"
                            >
                              Continue
                            </button>
                          </div>
                        </Form>
                      </div>
                  )}

                  <DataTable
                      collectionName="cutter_section"
                      columnName={cutterSectionColumns}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer/>
        <BackToTop/>
      </>
  );
};

export default CutterSection;
