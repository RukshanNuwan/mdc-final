import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import InfoIcon from "@mui/icons-material/Info";
import { DataGrid } from "@mui/x-data-grid";

import BackToTop from "../../components/backToTop/BackToTop";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import { db } from "../../config/firebase.config";

// const packingSectionColumns = [
// {
//   field: "packing_line_date",
//   headerName: "Packing date",
//   width: 130,
//   renderCell: (params) => {
//     params.row.data.map((item) => {
//       console.log( );
//     })
//   },
// },
// {
//   field: "packing_line_date",
//   headerName: "Packing date",
//   width: 110,
//   renderCell: (params) => {
//     return <div>{params.row?.packing_line_date}</div>;
//   },
// },
// {
//   field: "packing_type",
//   headerName: "Type",
//   width: 70,
//   renderCell: (params) => {
//     return (
//       <div>
//         {params.row.packing_type === "packing_type_20" ? "20kg" : "Other"}
//       </div>
//     );
//   },
// },
// {
//   headerName: "SD batch #",
//   width: 90,
//   renderCell: (params) => {
//     const resultString = params?.row?.production_batch_code.slice(9);
//     return <div>{resultString}</div>;
//   },
// },
// {
//   field: "production_batch_code",
//   headerName: "SD batch code",
//   width: 130,
// },
// {
//   field: "packing_job_sheet_number",
//   headerName: "JS #",
//   width: 80,
// },
// {
//   field: "packing_packing_batch_code",
//   headerName: "T code",
//   width: 80,
//   renderCell: (params) => {
//     return <div>{params.row.packing_packing_batch_code || "-"}</div>;
//   },
// },
// {
//   field: "packing_bag_number_range_start",
//   headerName: "T code range",
//   width: 100,
//   renderCell: (params) => {
//     return (
//       <div>
//         {params.row.packing_bag_number_range_start}
//         {" - "}
//         {params.row.packing_bag_number_range_end}
//       </div>
//     );
//   },
// },
// {
//   field: "packing_bag_numbers",
//   headerName: "SD 3 | 4 Bag #",
//   width: 230,
//   renderCell: (params) => {
//     return <div>{params.row.packing_bag_numbers.join()}</div>;
//   },
// },
// ];

const PackingLineSummary = () => {
  const [jobSheetNumbers, setJobSheetNumbers] = useState([]);
  const [nonDuplicationJSNumbers, setNonDuplicationJSNumbers] = useState([]);
  const [dataArray, setDataArray] = useState([]);

  useEffect(() => {
    const fetchJSNumbers = async () => {
      try {
        const list = [];
        const q = query(
          collection(db, "packing_line_data"),
          orderBy("packing_job_sheet_number", "asc")
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          if (doc.data()) list.push({ id: doc.id, ...doc.data() });
        });

        setJobSheetNumbers(list);
      } catch (error) {
        console.log(error);
      }
    };

    fetchJSNumbers();
  }, []);

  useEffect(() => {
    if (jobSheetNumbers.length > 0) {
      let jsNumbers = new Set();
      let nonDuplicationArray = [];

      jobSheetNumbers.forEach((doc) => {
        if (!jsNumbers.has(doc.packing_job_sheet_number)) {
          jsNumbers.add(doc.packing_job_sheet_number);
          nonDuplicationArray.push(doc.packing_job_sheet_number);
        }
      });

      setNonDuplicationJSNumbers(nonDuplicationArray);
    }
  }, [jobSheetNumbers]);

  useEffect(() => {
    if (jobSheetNumbers?.length > 0 && nonDuplicationJSNumbers?.length > 0) {
      const resultArray = [];

      nonDuplicationJSNumbers.forEach((jsNumber) => {
        const matchingObjects = jobSheetNumbers.filter(
          (obj) => obj.packing_job_sheet_number === jsNumber
        );

        resultArray.push({
          id: jsNumber,
          js_number: jsNumber,
          data: matchingObjects,
        });
      });

      setDataArray(resultArray);
    }
  }, [jobSheetNumbers, nonDuplicationJSNumbers]);

  console.log("dataArray -> ", dataArray);

  // const actionColumn = [
  //   {
  //     field: "action",
  //     headerName: "Action",
  //     width: 150,
  //     renderCell: (params) => {
  //       return (
  //         <div className="d-flex gap-4">
  //           <div>
  //             <InfoIcon className="tableAction" onClick={() => {}} />
  //           </div>
  //         </div>
  //       );
  //     },
  //   },
  // ];

  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="mb-2">
                <Link
                  to="/summary"
                  className="d-flex align-items-center customBackBtn"
                >
                  <ArrowBackIosIcon fontSize="small" /> Back
                </Link>
              </div>

              <div className="card-body formWrapper">
                <h3 className="mb-4 text-white">Packing line summary</h3>

                <div className="p-2 bg-white rounded">
                  <div className="row text-center smallText">
                    <div className="col-1">
                      <p>JS #</p>
                    </div>
                    <div className="col-1">
                      <p>Order name</p>
                    </div>
                    <div className="col-2">
                      <p>Communicated to packing</p>
                    </div>
                    <div className="col-1">
                      <p>Status</p>
                    </div>
                    <div className="col-1">
                      <p>Verification</p>
                    </div>
                    <div className="col-1">
                      <p>Packing line</p>
                    </div>
                    <div className="col-1">
                      <p>Pending products</p>
                    </div>
                    <div className="col-4">
                      <p>Remarks</p>
                    </div>
                  </div>

                  <div className="row text-center smallText">
                    <div className="col-1">
                      {dataArray.map((item, index) => (
                        <p key={index} className="fw-bold my-2">
                          {item.js_number}
                        </p>
                      ))}
                    </div>
                    <div className="col-1">
                      {dataArray.map((item, index) => (
                        <p key={index} className="fw-bold my-2 text-capitalize">
                          {item.data[0].packing_order_name || "-"}
                        </p>
                      ))}
                    </div>
                    <div className="col-2">
                      {dataArray.map((item) => (
                        <p className="fw-bold my-2">Submitted</p>
                      ))}
                    </div>
                    <div className="col-1">
                      {/* TODO: calculate - 100% */}
                      {dataArray.map((item) => (
                        <p className="fw-bold my-2">100%</p>
                      ))}
                    </div>
                    <div className="col-1">
                      {/* TODO: calculate Done - 30% -> this should get from verification module */}
                      {dataArray.map((item) => (
                        <p className="fw-bold my-2">Done</p>
                      ))}
                    </div>
                    <div className="col-1">
                      {/* TODO: calculate 70% */}
                      {dataArray.map((item) => (
                        <p className="fw-bold my-2">70%</p>
                      ))}
                    </div>
                    <div className="col-1">
                      {/* TODO: calculate 0 / 20% */}
                      {dataArray.map((item) => (
                        <p className="fw-bold my-2">0</p>
                      ))}
                    </div>
                    <div className="col-4">
                      {/* TODO: add button for remarks. open modal and text field -> save button -> update object (new property - remarks) */}
                      {/* if remarks -> show remarks else -> show add button */}
                      {dataArray.map((item) => (
                        <p className="fw-bold my-2 text-truncate">
                          Customer requested to close the order
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Data table */}
                {/* <div
                  style={{
                    height: "100%",
                    width: "100%",
                    padding: "0",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                  }}
                >
                  <DataGrid
                    rows={dataArray}
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
                </div> */}
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

export default PackingLineSummary;
