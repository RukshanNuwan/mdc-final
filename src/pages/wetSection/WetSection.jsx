import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
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

  const currentDate = useCurrentDate();

  const calculateKernelWeight = (e) => {
    const kernelWeight = e.target.value * 0.23;
    setTotalKernelWeight(kernelWeight);
    setTotalCoconut(e.target.value);
  };

  const handleSubFormChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setSubFormData({
      ...subFormData,
      totalBatchCountInMdc: 0,
      totalBatchCountInAraliyaKele: 0,
      totalMilkAmountInMdc: 0,
      totalMilkAmountInAraliyaKele: 0,
      totalPowderQuantityInMdc: 0,
      totalPowderQuantityInAraliyaKele: 0,
      [id]: value,
    });
  };

  const handleSubForm = async (e) => {
    e.preventDefault();
    const confirmData = `Date: ${subFormData.date} | Coconut Count: ${totalCoconut}`;

    if (receivedData?.date !== currentDate) {
      try {
        Swal.fire({
          title: "Do you want to save the changes?",
          text: confirmData,
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#415f91",
          confirmButtonText: "Yes",
        }).then((result) => {
          if (result.isConfirmed) {
            addDoc(collection(db, "daily_production"), {
              ...subFormData,
              totalCoconut,
              totalKernelWeight,
              timeStamp: serverTimestamp(),
            }).then(() => {
              Swal.fire({
                title: "Changes saved",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              });

              e.target.reset();
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
          confirmButtonColor: "#415f91",
          confirmButtonText: "Yes",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const docRef = doc(db, "daily_production", receivedData.id);
            await updateDoc(docRef, {
              totalCoconut,
              totalKernelWeight,
              updatedAt: serverTimestamp(),
            }).then(() => {
              Swal.fire({
                title: "Changes saved",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              });

              e.target.reset();
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
                  <div className="d-md-flex flex-md-row-reverse align-items-center subFormWrapper">
                    <div className="col-md-4">
                      <p className="bodyText fw-bold">
                        {`${receivedData?.totalKernelWeight} kg`}
                      </p>
                      <p className="bodyText">
                        Last updated at{" "}
                        {receivedData?.updatedAt
                          ? receivedData?.updatedAt?.toDate().toLocaleString()
                          : receivedData?.timeStamp?.toDate().toLocaleString()}
                      </p>
                    </div>

                    <div className="col-md-8 subFormParent">
                      <Form onSubmit={handleSubForm}>
                        <Row>
                          <Form.Group as={Col} md="4" controlId="date">
                            <Form.Label className="fw-bold">Date</Form.Label>
                            <Form.Control
                              type="date"
                              required
                              className="customInput"
                              onChange={handleSubFormChange}
                            />
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            md="4"
                            controlId="totalCoconutCount"
                          >
                            <Form.Label className="fw-bold">
                              Total coconut count
                            </Form.Label>
                            <Form.Control
                              required
                              type="number"
                              className="customInput"
                              onChange={calculateKernelWeight}
                            />
                          </Form.Group>

                          <div className="col">
                            {receivedData?.date !== currentDate ? (
                              <button
                                type="submit"
                                className="subform-btn-submit customBtn customBtnSecondary mt-md-4"
                              >
                                Add
                              </button>
                            ) : (
                              <button
                                type="submit"
                                className="subform-btn-submit customBtn customBtnSecondary mt-md-4"
                              >
                                Update
                              </button>
                            )}
                          </div>
                        </Row>
                      </Form>
                    </div>
                  </div>
                </div>

                <div className="addNewBtnWrapper">
                  {/*  /!* print button *!/*/}
                  <Link
                    to="new"
                    className="addNewBtn customBtn customBtnPrimary"
                  >
                    <AddIcon />
                    Add new
                  </Link>
                </div>

                <DataTable
                  collectionName="wet_section"
                  columnName={wetSectionColumns}
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

export default WetSection;