import { useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { and, collection, getDocs, or, query, where } from "firebase/firestore";

import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import { db } from "../../config/firebase.config";

const Complaints = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [productionDateInput, setProductionDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [jobSheetNumberInput, setJobSheetNumberInput] = useState("");
  const [bagNumberInput, setBagNumberInput] = useState("");
  const [data, setData] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  const fetchDataByTime = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "packing_line_data"),
        where("packing_packet_time_range_start", "<=", timeInput),
        where("packing_packet_time_range_end", ">=", timeInput)
      );

      await getDocs(q).then((res) => {
        if (res.docs.length === 0) {
          setIsEmpty(true);
          setIsLoading(false);

          return;
        }

        res.forEach((doc) => {
          if (doc.data()) list.push({ id: doc.id, ...doc.data() });
        });

        setData(list);
        setIsLoading(false);
        setIsEmpty(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataByBagNumber = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "packing_line_data"),
        where("packing_bag_numbers", "array-contains", bagNumberInput)
      );

      await getDocs(q).then((res) => {
        if (res.docs.length === 0) {
          setIsEmpty(true);
          setIsLoading(false);

          return;
        }

        res.forEach((doc) => {
          if (doc.data()) list.push({ id: doc.id, ...doc.data() });
        });

        setData(list);
        setIsLoading(false);
        setIsEmpty(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataByProductionDate = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "packing_line_data"),
        where("packing_production_date", "==", productionDateInput)
      );

      await getDocs(q).then((res) => {
        if (res.docs.length === 0) {
          setIsEmpty(true);
          setIsLoading(false);

          return;
        }

        res.forEach((doc) => {
          if (doc.data()) list.push({ id: doc.id, ...doc.data() });
        });

        setData(list);
        setIsLoading(false);
        setIsEmpty(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataByJobSheetNumber = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "packing_line_data"),
        where("packing_job_sheet_number", "==", jobSheetNumberInput)
      );

      await getDocs(q).then((res) => {
        if (res.docs.length === 0) {
          setIsEmpty(true);
          setIsLoading(false);

          return;
        }

        res.forEach((doc) => {
          if (doc.data()) list.push({ id: doc.id, ...doc.data() });
        });

        setData(list);
        setIsLoading(false);
        setIsEmpty(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataByJobSheetNumberAndBagNumber = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "packing_line_data"),
        where("packing_job_sheet_number", "==", jobSheetNumberInput),
        where("packing_bag_numbers", "array-contains", bagNumberInput)
      );

      await getDocs(q).then((res) => {
        if (res.docs.length === 0) {
          setIsEmpty(true);
          setIsLoading(false);

          return;
        }

        res.forEach((doc) => {
          if (doc.data()) list.push({ id: doc.id, ...doc.data() });
        });

        setData(list);
        setIsLoading(false);
        setIsEmpty(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataByBagNumberAndTime = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "packing_line_data"),
        where("packing_bag_numbers", "array-contains", bagNumberInput),
        where("packing_packet_time_range_start", "<=", timeInput),
        where("packing_packet_time_range_end", ">=", timeInput)
      );

      await getDocs(q).then((res) => {
        if (res.docs.length === 0) {
          setIsEmpty(true);
          setIsLoading(false);

          return;
        }

        res.forEach((doc) => {
          if (doc.data()) list.push({ id: doc.id, ...doc.data() });
        });

        setData(list);
        setIsLoading(false);
        setIsEmpty(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataByProductionDateAndTime = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "packing_line_data"),
        where("packing_production_date", "==", productionDateInput),
        where("packing_packet_time_range_start", "<=", timeInput),
        where("packing_packet_time_range_end", ">=", timeInput)
      );

      await getDocs(q).then((res) => {
        if (res.docs.length === 0) {
          setIsEmpty(true);
          setIsLoading(false);

          return;
        }

        res.forEach((doc) => {
          if (doc.data()) list.push({ id: doc.id, ...doc.data() });
        });

        setData(list);
        setIsLoading(false);
        setIsEmpty(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataByProductionDateAndJobSheetNumber = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "packing_line_data"),
        where("packing_production_date", "==", productionDateInput),
        where("packing_job_sheet_number", "==", jobSheetNumberInput)
      );

      await getDocs(q).then((res) => {
        if (res.docs.length === 0) {
          setIsEmpty(true);
          setIsLoading(false);

          return;
        }

        res.forEach((doc) => {
          if (doc.data()) list.push({ id: doc.id, ...doc.data() });
        });

        setData(list);
        setIsLoading(false);
        setIsEmpty(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataByProductionDateAndBagNumber = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "packing_line_data"),
        where("packing_production_date", "==", productionDateInput),
        where("packing_bag_numbers", "array-contains", bagNumberInput)
      );

      await getDocs(q).then((res) => {
        if (res.docs.length === 0) {
          setIsEmpty(true);
          setIsLoading(false);

          return;
        }

        res.forEach((doc) => {
          if (doc.data()) list.push({ id: doc.id, ...doc.data() });
        });

        setData(list);
        setIsLoading(false);
        setIsEmpty(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataByTimeAndJobSheetNumber = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "packing_line_data"),
        where("packing_job_sheet_number", "==", jobSheetNumberInput),
        where("packing_packet_time_range_start", "<=", timeInput),
        where("packing_packet_time_range_end", ">=", timeInput)
      );

      await getDocs(q).then((res) => {
        if (res.docs.length === 0) {
          setIsEmpty(true);
          setIsLoading(false);

          return;
        }

        res.forEach((doc) => {
          if (doc.data()) list.push({ id: doc.id, ...doc.data() });
        });

        setData(list);
        setIsLoading(false);
        setIsEmpty(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataByTimeAndBagNumberAndJobSheetNumber = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "packing_line_data"),
        where("packing_job_sheet_number", "==", jobSheetNumberInput),
        where("packing_bag_numbers", "array-contains", bagNumberInput),
        where("packing_packet_time_range_start", "<=", timeInput),
        where("packing_packet_time_range_end", ">=", timeInput)
      );

      await getDocs(q).then((res) => {
        if (res.docs.length === 0) {
          setIsEmpty(true);
          setIsLoading(false);

          return;
        }

        res.forEach((doc) => {
          if (doc.data()) list.push({ id: doc.id, ...doc.data() });
        });

        setData(list);
        setIsLoading(false);
        setIsEmpty(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataByProductionDateAndJobSheetNumberAndTime = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "packing_line_data"),
        where("packing_production_date", "==", productionDateInput),
        where("packing_job_sheet_number", "==", jobSheetNumberInput),
        where("packing_packet_time_range_start", "<=", timeInput),
        where("packing_packet_time_range_end", ">=", timeInput)
      );

      await getDocs(q).then((res) => {
        if (res.docs.length === 0) {
          setIsEmpty(true);
          setIsLoading(false);

          return;
        }

        res.forEach((doc) => {
          if (doc.data()) list.push({ id: doc.id, ...doc.data() });
        });

        setData(list);
        setIsLoading(false);
        setIsEmpty(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataByProductionDateAndBagNumberAndTime = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "packing_line_data"),
        where("packing_production_date", "==", productionDateInput),
        where("packing_bag_numbers", "array-contains", bagNumberInput),
        where("packing_packet_time_range_start", "<=", timeInput),
        where("packing_packet_time_range_end", ">=", timeInput)
      );

      await getDocs(q).then((res) => {
        if (res.docs.length === 0) {
          setIsEmpty(true);
          setIsLoading(false);

          return;
        }

        res.forEach((doc) => {
          if (doc.data()) list.push({ id: doc.id, ...doc.data() });
        });

        setData(list);
        setIsLoading(false);
        setIsEmpty(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataByProductionDateAndBagNumberAndJobSheetNumber = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "packing_line_data"),
        where("packing_production_date", "==", productionDateInput),
        where("packing_bag_numbers", "array-contains", bagNumberInput),
        where("packing_job_sheet_number", "==", jobSheetNumberInput)
      );

      await getDocs(q).then((res) => {
        if (res.docs.length === 0) {
          setIsEmpty(true);
          setIsLoading(false);

          return;
        }

        res.forEach((doc) => {
          if (doc.data()) list.push({ id: doc.id, ...doc.data() });
        });

        setData(list);
        setIsLoading(false);
        setIsEmpty(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataByProductionDateAndBagNumberAndJobSheetNumberAndTime =
    async () => {
      try {
        const list = [];
        const q = query(
          collection(db, "packing_line_data"),
          where("packing_production_date", "==", productionDateInput),
          where("packing_bag_numbers", "array-contains", bagNumberInput),
          where("packing_job_sheet_number", "==", jobSheetNumberInput),
          where("packing_packet_time_range_start", "<=", timeInput),
          where("packing_packet_time_range_end", ">=", timeInput)
        );

        await getDocs(q).then((res) => {
          if (res.docs.length === 0) {
            setIsEmpty(true);
            setIsLoading(false);

            return;
          }

          res.forEach((doc) => {
            if (doc.data()) list.push({ id: doc.id, ...doc.data() });
          });

          setData(list);
          setIsLoading(false);
          setIsEmpty(false);
        });
      } catch (error) {
        console.log(error);
      }
    };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const conditions = [
      {
        check: () =>
          timeInput &&
          !productionDateInput &&
          !jobSheetNumberInput &&
          !bagNumberInput,
        fetch: fetchDataByTime,
      },
      {
        check: () =>
          bagNumberInput &&
          !productionDateInput &&
          !timeInput &&
          !jobSheetNumberInput,
        fetch: fetchDataByBagNumber,
      },
      {
        check: () =>
          productionDateInput &&
          !bagNumberInput &&
          !timeInput &&
          !jobSheetNumberInput,
        fetch: fetchDataByProductionDate,
      },
      {
        check: () =>
          jobSheetNumberInput &&
          !productionDateInput &&
          !bagNumberInput &&
          !timeInput,
        fetch: fetchDataByJobSheetNumber,
      },
      {
        check: () =>
          bagNumberInput &&
          timeInput &&
          !jobSheetNumberInput &&
          !productionDateInput,
        fetch: fetchDataByBagNumberAndTime,
      },
      {
        check: () =>
          productionDateInput &&
          timeInput &&
          !jobSheetNumberInput &&
          !bagNumberInput,
        fetch: fetchDataByProductionDateAndTime,
      },
      {
        check: () =>
          productionDateInput &&
          jobSheetNumberInput &&
          !timeInput &&
          !bagNumberInput,
        fetch: fetchDataByProductionDateAndJobSheetNumber,
      },
      {
        check: () =>
          productionDateInput &&
          bagNumberInput &&
          !timeInput &&
          !jobSheetNumberInput,
        fetch: fetchDataByProductionDateAndBagNumber,
      },
      {
        check: () =>
          timeInput &&
          jobSheetNumberInput &&
          !productionDateInput &&
          !bagNumberInput,
        fetch: fetchDataByTimeAndJobSheetNumber,
      },
      {
        check: () =>
          bagNumberInput &&
          jobSheetNumberInput &&
          !timeInput &&
          !productionDateInput,
        fetch: fetchDataByJobSheetNumberAndBagNumber,
      },
      {
        check: () =>
          productionDateInput &&
          jobSheetNumberInput &&
          timeInput &&
          !bagNumberInput,
        fetch: fetchDataByProductionDateAndJobSheetNumberAndTime,
      },
      {
        check: () =>
          productionDateInput &&
          bagNumberInput &&
          timeInput &&
          !jobSheetNumberInput,
        fetch: fetchDataByProductionDateAndBagNumberAndTime,
      },
      {
        check: () =>
          jobSheetNumberInput &&
          bagNumberInput &&
          timeInput &&
          !productionDateInput,
        fetch: fetchDataByTimeAndBagNumberAndJobSheetNumber,
      },
      {
        check: () =>
          productionDateInput &&
          bagNumberInput &&
          jobSheetNumberInput &&
          !timeInput,
        fetch: fetchDataByProductionDateAndBagNumberAndJobSheetNumber,
      },
      {
        check: () =>
          productionDateInput &&
          bagNumberInput &&
          jobSheetNumberInput &&
          timeInput,
        fetch: fetchDataByProductionDateAndBagNumberAndJobSheetNumberAndTime,
      },
    ];

    let matched = false;

    for (const condition of conditions) {
      if (condition.check()) {
        await condition.fetch();
        matched = true;
        break;
      }
    }

    if (!matched) setIsEmpty(true);

    setIsLoading(false);
  };

  console.log(data);

  const handleClear = () => {
    setTimeInput("");
    setBagNumberInput("");
    setProductionDateInput("");
    setJobSheetNumberInput("");
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
                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="search_time"
                        className="mt-2"
                      >
                        <Form.Label className="fw-bold">
                          Time <span className="text-info">*</span>
                        </Form.Label>
                        <Form.Control
                          type="time"
                          step="1"
                          className="customInput"
                          onChange={(e) => setTimeInput(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="search_bag_number"
                        className="mt-2"
                      >
                        <Form.Label className="fw-bold">
                          Bag number <span className="text-info">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          className="customInput"
                          onChange={(e) => setBagNumberInput(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="search_job_sheet_number"
                        className="mt-2"
                      >
                        <Form.Label className="fw-bold">
                          Job sheet number
                        </Form.Label>
                        <Form.Control
                          type="text"
                          className="customInput"
                          onChange={(e) =>
                            setJobSheetNumberInput(e.target.value)
                          }
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="search_date"
                        className="mt-2"
                      >
                        <Form.Label className="fw-bold">
                          Production date
                        </Form.Label>
                        <Form.Control
                          type="date"
                          className="customInput"
                          onChange={(e) =>
                            setProductionDateInput(e.target.value)
                          }
                        />
                      </Form.Group>
                    </Row>

                    <div className="col d-flex justify-content-end mt-4">
                      <button
                        type="submit"
                        className="d-flex align-items-center justify-content-center mt-md-4 gap-2 subform-btn-submit customBtn"
                      >
                        {isLoading && <Spinner animation="border" size="sm" />}
                        {isLoading ? "Searching..." : "Search"}
                      </button>

                      <button
                        type="reset"
                        className="customBtn customClearBtn"
                        onClick={handleClear}
                      >
                        Clear
                      </button>
                    </div>

                    {isEmpty && (
                      <span className="mt-1 text-danger smallText">
                        No data found
                      </span>
                    )}
                  </Form>

                  <hr className="custom-hr-yellow" />

                  <div className="d-flex flex-column gap-2">
                    <div>search results</div>
                    <div>search results</div>
                    <div>search results</div>
                    {/* <SearchResultCard/> */}
                  </div>
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

export default Complaints;
