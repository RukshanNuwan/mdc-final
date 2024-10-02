import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import { db } from "../../config/firebase.config";

const Verification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [checkedList, setCheckedList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVerifiedData = async () => {
      try {
        const q = query(
          collection(db, "verification_data"),
          orderBy("added_at", "desc")
        );

        const querySnapshot = await getDocs(q);
        let list = [];

        querySnapshot.forEach((doc) => {
          doc.data().checkedList.forEach((item) => {
            list.push(item);
          });
        });

        setCheckedList(list);
      } catch (error) {
        console.log(error);
      }
    };

    fetchVerifiedData();
  }, []);

  const fetchVerificationData = async (inputValue) => {
    const q = query(
      collection(db, "packing_line_data"),
      where("packing_packing_batch_code", "==", inputValue),
      orderBy("packing_line_added_at", "desc")
    );
    await getDocs(q).then((res) => {
      if (res.docs.length === 0) {
        setIsEmpty(true);
        setIsLoading(false);

        return;
      }

      let list = [];
      res.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      setData(list);
      setIsLoading(false);
      setIsEmpty(false);
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setData([]);

    try {
      fetchVerificationData(inputValue);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerificationToggle = async (e) => {
    if (e.target.checked) {
      setCheckedList([...checkedList, e.target.id]);
    } else {
      let filteredCheckedList = checkedList.filter(
        (item) => item !== e.target.id
      );

      setCheckedList(filteredCheckedList);
    }
  };

  const handleContinue = async () => {
    if (checkedList.length === 0) {
      Swal.fire({
        title: "Warning",
        text: "Please select at least one option",
        icon: "info",
        confirmButtonColor: "#ff007f",
      });
    } else {
      try {
        Swal.fire({
          title: "Are you sure?",
          text: "You want to save the selected items?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#ff007f",
          confirmButtonText: "Continue",
          cancelButtonColor: "#0d1b2a",
        }).then(async (result) => {
          if (result.isConfirmed) {
            setIsLoading(true);

            await setDoc(doc(db, "verification_data", inputValue), {
              tCode: inputValue.trim(),
              checkedList,
              added_at: serverTimestamp(),
            }).then(() => {
              Swal.fire({
                title: "Saved successfully",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              });

              setIsLoading(false);
              setCheckedList([]);
              navigate("/");
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
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
              <div className="row mb-2 subFormWrapper">
                <div className="col-md subFormParent">
                  <Form onSubmit={handleSearch}>
                    <Row>
                      <Form.Group as={Col} md="6" controlId="batch_code">
                        <Form.Label className="fw-bold">T code</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          className="customInput"
                          placeholder="eg: MPSnD"
                          onChange={(e) => setInputValue(e.target.value)}
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
                          No data found for this T code
                        </span>
                      )}
                    </Row>
                  </Form>

                  <hr className="my-4 custom-hr-yellow" />

                  <div className="d-flex flex-wrap">
                    {data &&
                      data?.map((item, index) => (
                        <React.Fragment key={index}>
                          {item.packing_craft_bag_number?.map((i, subIndex) => (
                            <Form.Group
                              key={`${item.packing_packing_batch_code}${i}`}
                              as={Col}
                              md="4"
                              xs="6"
                              controlId={`${item.packing_packing_batch_code}${i}`}
                            >
                              <Form.Label className="fw-bold">
                                {`${item.packing_packing_batch_code} ${i}`}
                              </Form.Label>

                              <Form.Switch
                                type="switch"
                                id={`${item.packing_packing_batch_code}${i}`}
                                checked={checkedList.includes(
                                  `${item.packing_packing_batch_code}${i}`
                                )}
                                onChange={handleVerificationToggle}
                              />
                            </Form.Group>
                          ))}

                          {item.packing_carton_box_number &&
                            item.packing_carton_box_number
                              .split(",")
                              .map((i, subIndex) => (
                                <Form.Group
                                  key={`${item.packing_packing_batch_code}${i}`}
                                  as={Col}
                                  md="4"
                                  xs="6"
                                  controlId={`${item.packing_packing_batch_code}${i}`}
                                >
                                  <Form.Label className="fw-bold">
                                    {`${item.packing_packing_batch_code} ${i}`}
                                  </Form.Label>

                                  <Form.Switch
                                    type="switch"
                                    id={`${item.packing_packing_batch_code}${i}`}
                                    checked={checkedList.includes(
                                      `${item.packing_packing_batch_code}${i}`
                                    )}
                                    onChange={handleVerificationToggle}
                                  />
                                </Form.Group>
                              ))}
                        </React.Fragment>
                      ))}
                  </div>

                  {data.length > 0 && (
                    <div className="col">
                      <button
                        type="button"
                        className="d-flex align-items-center justify-content-center mt-md-4 gap-2 subform-btn-submit customBtn"
                        onClick={handleContinue}
                      >
                        {isLoading && <Spinner animation="border" size="sm" />}
                        {isLoading ? "Saving..." : "Continue"}
                      </button>
                    </div>
                  )}
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

export default Verification;
