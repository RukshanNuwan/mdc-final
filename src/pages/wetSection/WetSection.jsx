import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import DataTable from "../../components/dataTable/DataTable";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";
import { wetSectionColumns } from "../../data/dataTableSource";
import { db } from "../../config/firebase.config";
import useCurrentDate from "../../hooks/useCurrentDate";

const WetSection = () => {
  const [subFormData, setSubFormData] = useState({});
  const [receivedData, setReceivedData] = useState({});
  const [totalKernelWeight, setTotalKernelWeight] = useState(0);
  const [totalCoconut, setTotalCoconut] = useState();
  const [isOutsideKernelArrived, setIsOutsideKernelArrived] = useState(false);
  const [outsideKernelQuantity, setOutsideKernelQuantity] = useState(0);

  const navigate = useNavigate();
  const currentDate = useCurrentDate();

  const calculateKernelWeight = (e) => {
    const kernelWeight = e.target.value * 0.25;
    setTotalKernelWeight(kernelWeight);
    setTotalCoconut(e.target.value);
  };

  const handleSwitchChange = (e) => {
    setIsOutsideKernelArrived(e.target.checked);
  };

  const handleSubFormChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setSubFormData({
      ...subFormData,
      // totalBatchCountInMdc: 0,
      // totalBatchCountInAraliyaKele: 0,
      // totalMilkAmountInMdc: 0,
      // totalMilkAmountInAraliyaKele: 0,
      // totalPowderQuantityInMdc: 0,
      // totalPowderQuantityInAraliyaKele: 0,
      [id]: value,
    });
  };

  const handleSubForm = async (e) => {
    e.preventDefault();

    const confirmData = `${
      isOutsideKernelArrived
        ? `Kernel quantity: ${outsideKernelQuantity}`
        : `Date: ${subFormData.date} | Coconut Count: ${totalCoconut}`
    }`;

    if (receivedData?.date !== currentDate) {
      try {
        Swal.fire({
          title: "Do you want to save the changes?",
          text: confirmData,
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#0d1b2a",
          confirmButtonText: "Yes",
          cancelButtonColor: "#ff007f",
        }).then((result) => {
          if (result.isConfirmed) {
            addDoc(collection(db, "daily_production"), {
              ...subFormData,
              totalCoconut,
              totalKernelWeight,
              outsideKernelQuantity,
              timeStamp: serverTimestamp(),
            }).then(() => {
              Swal.fire({
                title: "Changes saved",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              });
              e.target.reset();
              navigate("/");
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
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
            const docRef = doc(db, "daily_production", receivedData.id);
            await updateDoc(docRef, {
              totalCoconut: isOutsideKernelArrived
                ? receivedData.totalCoconut
                : totalCoconut,
              totalKernelWeight: isOutsideKernelArrived
                ? receivedData.totalKernelWeight
                : totalKernelWeight,
              outsideKernelQuantity: isOutsideKernelArrived
                ? outsideKernelQuantity
                : receivedData.outsideKernelQuantity || 0,
              updatedAt: serverTimestamp(),
            }).then(() => {
              Swal.fire({
                title: "Changes saved",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              });
              e.target.reset();
              navigate("/");
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchSubFormData = async () => {
      try {
        const q = query(
          collection(db, "daily_production"),
          orderBy("timeStamp", "desc"),
          limit(1)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let list = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });

          setReceivedData(list[0]);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.log(error);
      }
    };

    fetchSubFormData();
  }, []);

  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="col-md-12">
            <Breadcrumb title="Wet Section" />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="card-body p-0">
                <div className="row d-flex justify-content-between align-items-start mb-2">
                  <div className="d-md-flex flex-md-row-reverse subFormWrapper">
                    <div className="col-md-4">
                      <p className="bodyText fw-bold text-white">
                        {`${receivedData?.totalKernelWeight}Kg`}
                      </p>
                      <p className="bodyText text-white">
                        Last updated at{" "}
                        {receivedData?.updatedAt
                          ? receivedData?.updatedAt?.toDate().toLocaleString()
                          : receivedData?.timeStamp?.toDate().toLocaleString()}
                      </p>
                    </div>

                    <div className="col-md-8 subFormParent">
                      <Form onSubmit={handleSubForm}>
                        <Row>
                          <Form.Group as={Col} md="5" controlId="date">
                            <Form.Label className="fw-bold">Date</Form.Label>
                            <Form.Control
                              type="date"
                              required
                              className="customInput"
                              defaultValue={
                                receivedData?.date && receivedData?.date
                              }
                              onChange={handleSubFormChange}
                            />
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            md="5"
                            controlId="totalCoconutCount"
                          >
                            <Form.Label className="fw-bold">
                              Total coconut count
                            </Form.Label>
                            <Form.Control
                              type="number"
                              required={!isOutsideKernelArrived}
                              className="customInput"
                              onChange={calculateKernelWeight}
                            />
                          </Form.Group>
                        </Row>

                        <Row>
                          <Form.Group as={Col} md="5">
                            <Form.Label className="fw-bold">
                              Outside kernel
                            </Form.Label>

                            <Form.Switch
                              type="switch"
                              id="outside-kernel-switch"
                              checked={isOutsideKernelArrived}
                              onChange={handleSwitchChange}
                            />
                          </Form.Group>

                          {isOutsideKernelArrived && (
                            <Form.Group
                              as={Col}
                              md="5"
                              controlId="outsideKernelQuantity"
                            >
                              <Form.Label className="fw-bold">
                                Quantity
                              </Form.Label>
                              <Form.Control
                                required={isOutsideKernelArrived}
                                type="number"
                                className="customInput"
                                onChange={(e) =>
                                  setOutsideKernelQuantity(e.target.value)
                                }
                              />
                            </Form.Group>
                          )}
                        </Row>

                        <Row>
                          <div className="col">
                            <button
                              type="submit"
                              className="subform-btn-submit customBtn mt-md-4"
                            >
                              {receivedData?.date !== currentDate
                                ? "Add"
                                : "Update"}
                            </button>
                          </div>
                        </Row>
                      </Form>
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <div className="addNewBtnWrapper">
                    <Link to="new" className="addNewBtn customBtn">
                      Add new
                    </Link>
                  </div>

                  <div className="d-flex no-wrap">
                    <p className="text-danger fw-bold">*</p>
                    <p className="text-dark-blue-1 fw-bold">
                      Please add the total coconut count before adding the first
                      batch
                    </p>
                  </div>
                </div>

                <DataTable columnName={wetSectionColumns} />
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

export default WetSection;
