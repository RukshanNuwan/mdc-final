import { useEffect, useState } from "react";
import {
  Accordion,
  Col,
  Figure,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import Swal from "sweetalert2";
// import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";

import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import { db } from "../../config/firebase.config";
import CustomAccordion from "../../components/customAccordion/CustomAccordion";
import BackToTop from "../../components/backToTop/BackToTop";

const packingSectionColumns = [
  {
    field: "packing_production_date",
    headerName: "Production date",
    width: 110,
  },
  {
    field: "packing_line_date",
    headerName: "Packing date",
    width: 110,
    renderCell: (params) => {
      return <div>{params.row?.packing_line_date}</div>;
    },
  },
  {
    field: "packing_type",
    headerName: "Type",
    width: 70,
    renderCell: (params) => {
      return (
        <div>
          {params.row.packing_type === "packing_type_20"
            ? "20kg"
            : params.row.packing_type === "packing_type_15"
            ? "15kg"
            : "Other"}
        </div>
      );
    },
  },
  {
    headerName: "SD batch #",
    width: 90,
    renderCell: (params) => {
      const resultString = params?.row?.production_batch_code.slice(9);
      return <div>{resultString}</div>;
    },
  },
  {
    field: "production_batch_code",
    headerName: "SD batch code",
    width: 130,
  },
  {
    field: "packing_job_sheet_number",
    headerName: "JS #",
    width: 80,
  },
  {
    field: "packing_packing_batch_code",
    headerName: "T code",
    width: 80,
    renderCell: (params) => {
      return <div>{params.row.packing_packing_batch_code || "-"}</div>;
    },
  },
  {
    field: "packing_bag_number_range_start",
    headerName: "T code range",
    width: 100,
    renderCell: (params) => {
      return (
        <div>
          {params.row.packing_bag_number_range_start}
          {" - "}
          {params.row.packing_bag_number_range_end}
        </div>
      );
    },
  },
  {
    field: "packing_bag_numbers",
    headerName: "SD 3 | 4 Bag #",
    width: 230,
    renderCell: (params) => {
      return <div>{params.row.packing_bag_numbers.join()}</div>;
    },
  },
];

const packingTotalColumns = [
  {
    field: "packing_total_added_at",
    headerName: "Added date",
    width: 200,
    renderCell: (params) => {
      return (
        <div>
          {new Date(
            params.row?.packing_total_added_at?.toDate()
          ).toLocaleString()}
        </div>
      );
    },
  },
  {
    field: "packing_total_js_number",
    headerName: "Job sheet number",
    width: 150,
  },
  {
    field: "packing_total_item_count",
    headerName: "Total count",
    width: 150,
  },
  {
    field: "packing_total_completed_item_count",
    headerName: "Daily completed item count",
    width: 200,
    renderCell: (params) => {
      return <div>{params.row.packing_total_completed_item_count || "-"}</div>;
    },
  },
];

const PackingLines = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState({});
  const [updatedData, setUpdatedData] = useState({});
  const [packingType, setPackingType] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const [addedPackingLineData, setAddedPackingLineData] = useState([]);
  const [addedData, setAddedData] = useState([]);
  const [subFormData, setSubFormData] = useState({});
  const [packingTotalData, setPackingTotalData] = useState([]);

  // TODO: Calculate completed powder quantity as percentage of total and show it in circular progress bar
  // const [totalQuantity, setTotalQuantity] = useState(2000);
  // const [currentQuantity, setCurrentQuantity] = useState(200);

  const navigate = useNavigate();

  // TODO: this is only a sample value
  // let percentage = 0;

  // if (totalQuantity > 0 && currentQuantity < totalQuantity) {
  //   percentage = (currentQuantity / totalQuantity) * 100;
  // }

  useEffect(() => {
    const fetchAddedData = async () => {
      try {
        const q = query(
          collection(db, "packing_line_data"),
          where("packing_status", "==", "packed"),
          orderBy("packing_line_added_at", "desc")
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let list = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });

          setAddedData(list);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.log(error);
      }
    };

    fetchAddedData();
  }, []);

  useEffect(() => {
    const fetchPackingTotalData = async () => {
      try {
        const q = query(
          collection(db, "packing_total_data"),
          orderBy("packing_total_added_at", "desc")
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let list = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          setPackingTotalData(list);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.log(error);
      }
    };

    fetchPackingTotalData();
  }, []);

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const fetchAddedPackingLineDataByBatchCode = async (param) => {
    const q = query(
      collection(db, "packing_line_data"),
      where("production_batch_code", "==", param)
    );
    await getDocs(q).then((res) => {
      if (res.docs.length === 0) return;

      let list = [];
      res.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      setAddedPackingLineData(list);
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setData({});
    setAddedPackingLineData([]);

    fetchAddedPackingLineDataByBatchCode(searchInput);

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

  const handleTypeChange = (e) => {
    const value = e.target.value;

    setPackingType(value);
  };

  const handleBagNumbersChange = (e) => {
    const str = e.target.value;
    const bagNumbers = str.toLowerCase().split(",");
    setUpdatedData({ ...updatedData, packing_bag_numbers: bagNumbers });
  };

  const handleCraftBagNumberChange = (e) => {
    const str = e.target.value;
    const craftBagNumbers = str.toLowerCase().split(",");
    setUpdatedData({
      ...updatedData,
      packing_craft_bag_number: craftBagNumbers,
    });
  };

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setUpdatedData({
      ...updatedData,
      [id]: value,
      packing_order_name: data.order_name.replace(/_/g, " "),
      packing_type: packingType,
      packing_production_date: data?.date,
      production_batch_code: data?.batch_code,
      production_batch_id: data?.id,
      packing_status: "packed",
    });
  };

  const handleSelectChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setUpdatedData({ ...updatedData, [id]: value });
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

  const handleView = (data) => {
    navigate("view", { state: data });
  };

  const handleSubFormChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setSubFormData({ ...subFormData, [id]: value });
  };

  const handleSubForm = async (e) => {
    e.preventDefault();
    setIsLoading(false);

    const percentage =
      (subFormData.packing_total_completed_item_count /
        subFormData.packing_total_item_count) *
      100;

    try {
      Swal.fire({
        title: "Do you want to save the changes?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#ff007f",
        confirmButtonText: "Yes",
        cancelButtonColor: "#0d1b2a",
      }).then((result) => {
        if (result.isConfirmed) {
          setIsLoading(true);

          addDoc(collection(db, "packing_total_data"), {
            ...subFormData,
            packing_total_percentage: percentage,
            packing_total_added_at: serverTimestamp(),
          }).then(() => {
            Swal.fire({
              title: "Changes saved",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });

            e.target.reset();
            setIsLoading(false);
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = (data) => {
    navigate("update", { state: data });
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="d-flex gap-4">
            <div>
              <InfoIcon
                className="tableAction"
                onClick={() => handleView(params.row)}
              />
            </div>

            <div>
              <EditIcon
                className="tableAction"
                onClick={() => handleUpdate(params.row)}
              />
            </div>
          </div>
        );
      },
    },
  ];

  const packingTotalActionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="d-flex gap-4">
            <div>
              <EditIcon
                className="tableAction"
                onClick={() => handleUpdate(params.row)}
              />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="row d-flex justify-content-between align-items-start mb-2">
                <div className="subFormWrapper">
                  <div className="col-md subFormParent">
                    <Form onSubmit={handleSubForm}>
                      <Row>
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="packing_total_js_number"
                        >
                          <Form.Label className="fw-bold">
                            Job sheet number
                          </Form.Label>
                          <Form.Control
                            type="number"
                            required
                            className="customInput"
                            onChange={handleSubFormChange}
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="packing_total_item_count"
                        >
                          <Form.Label className="fw-bold">
                            Total item count
                          </Form.Label>

                          <Form.Control
                            type="number"
                            required
                            className="customInput"
                            onChange={handleSubFormChange}
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="packing_total_completed_item_count"
                        >
                          <Form.Label className="fw-bold">
                            Daily completed item count
                          </Form.Label>

                          <Form.Control
                            type="number"
                            required
                            className="customInput"
                            onChange={handleSubFormChange}
                          />
                        </Form.Group>
                      </Row>

                      <Row>
                        <Form.Group as={Col}>
                          <button
                            type="submit"
                            className="subform-btn-submit customBtn"
                            disabled={isLoading}
                          >
                            <div className="d-flex align-items-center justify-content-center gap-2">
                              {isLoading && (
                                <Spinner animation="border" size="sm" />
                              )}
                            </div>

                            <p>Add</p>
                          </button>
                        </Form.Group>
                      </Row>
                    </Form>

                    <Row>
                      <Accordion>
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>Added data</Accordion.Header>
                          <Accordion.Body className="p-2">
                            <div
                              style={{
                                height: "100%",
                                width: "100%",
                                padding: "0",
                                borderRadius: "8px",
                                backgroundColor: "#fff",
                              }}
                            >
                              <DataGrid
                                rows={packingTotalData}
                                columns={packingTotalColumns}
                                initialState={{
                                  pagination: {
                                    paginationModel: {
                                      page: 0,
                                      pageSize: 10,
                                    },
                                  },
                                  sorting: {
                                    sortModel: [
                                      {
                                        field: "packing_total_added_at",
                                        sort: "desc",
                                      },
                                    ],
                                  },
                                }}
                                pageSizeOptions={[10, 50, 100]}
                              />
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </Row>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0">
              <div className="row mb-2 subFormWrapper">
                <div className="col-md subFormParent">
                  <Form onSubmit={handleSearch}>
                    <Row>
                      <Form.Group as={Col} md="3" controlId="batch_code">
                        <Form.Label className="fw-bold">
                          SD batch code
                        </Form.Label>
                        <Form.Control
                          type="text"
                          required
                          className="customInput"
                          placeholder="eg: SD324073124"
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

                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="packing_type"
                        className="mb-2"
                      >
                        <Form.Label className="fw-bold">Type</Form.Label>

                        <Form.Select
                          required
                          className="customInput"
                          onChange={handleTypeChange}
                        >
                          <option selected disabled>
                            Select type
                          </option>
                          <option value="packing_type_15">15 kg</option>
                          <option value="packing_type_20">20 kg</option>
                          <option value="packing_type_other">Other</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="2"
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
                        md="2"
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

                {addedPackingLineData.length > 0 && (
                  <div className="my-3">
                    <CustomAccordion>
                      {addedPackingLineData.map((data) => (
                        <>{data}</>
                      ))}
                    </CustomAccordion>
                  </div>
                )}

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
                            SD batch number
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
                            defaultValue={data.order_name.replace(/_/g, " ")}
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="packing_line_date"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">
                            Packing date
                          </Form.Label>
                          <Form.Control
                            type="date"
                            required
                            className="customInput text-capitalize"
                            onChange={handleChange}
                          />
                        </Form.Group>

                        {/* <Form.Group
                          as={Col}
                          md="3"
                          controlId="order_name"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">Progress</Form.Label>
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
                        </Form.Group> */}
                      </Row>

                      <Row>
                        <Form.Group
                          as={Col}
                          md="3"
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
                          md="3"
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

                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="packing_total_number_of_pieces"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">
                            Total number of pieces
                          </Form.Label>
                          <Form.Control
                            type="number"
                            required
                            className="customInput"
                            onChange={handleChange}
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="packing_packing_batch_code"
                          className="mb-2"
                        >
                          <Form.Label className="fw-bold">T code</Form.Label>
                          <Form.Control
                            type="text"
                            required
                            placeholder="eg: MPSnD"
                            className="customInput"
                            onChange={handleChange}
                          />
                        </Form.Group>

                        {packingType === "packing_type_20" ||
                        packingType === "packing_type_15" ? (
                          <Form.Group
                            as={Col}
                            md="3"
                            controlId="packing_craft_bag_number"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              C bag number(s)
                            </Form.Label>
                            <Form.Control
                              type="text"
                              required={
                                packingType === "packing_type_20" ||
                                packingType === "packing_type_20"
                              }
                              className="customInput"
                              onChange={handleCraftBagNumberChange}
                            />
                            <Figure.Caption className="tooltipText">
                              Type bag numbers with commas
                            </Figure.Caption>
                          </Form.Group>
                        ) : (
                          <>
                            <Form.Group
                              as={Col}
                              md="3"
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

                            <Form.Group
                              as={Col}
                              md="3"
                              controlId="packing_julian_date"
                              className="mb-2"
                            >
                              <Form.Label className="fw-bold">
                                Julian date
                              </Form.Label>
                              <Form.Control
                                type="text"
                                required={packingType === "packing_type_other"}
                                className="customInput"
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </>
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
                            T code range - Start
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
                            T code range - End
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
                            md="3"
                            controlId="packing_line_name"
                            className="mb-2"
                          >
                            <Form.Label className="fw-bold">
                              Packing line
                            </Form.Label>
                            <Form.Select
                              required
                              className="customInput"
                              onChange={handleSelectChange}
                            >
                              <option selected disabled>
                                Select packing line
                              </option>
                              <option value="mdc_01">MDC - Line 01</option>
                              <option value="mdc_02">MDC - Line 02</option>
                              <option value="mdc_03">MDC - Line 03</option>
                              <option value="araliya_kele_01">
                                Araliya kele - Line 01
                              </option>
                            </Form.Select>
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            md="3"
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
                            md="3"
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
                            md="3"
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

                <hr className="custom-hr-yellow my-4" />

                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    padding: "0",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                  }}
                >
                  <DataGrid
                    rows={addedData}
                    columns={packingSectionColumns.concat(actionColumn)}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 25 },
                      },
                      sorting: {
                        sortModel: [
                          { field: "packing_line_date", sort: "desc" },
                        ],
                      },
                    }}
                    pageSizeOptions={[25, 50, 100]}
                  />
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

export default PackingLines;
