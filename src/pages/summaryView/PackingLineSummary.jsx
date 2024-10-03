import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

import BackToTop from "../../components/backToTop/BackToTop";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import { db } from "../../config/firebase.config";

const PackingLineSummary = () => {
  const [allJobSheetNumbers, setAllJobSheetNumbers] = useState([]);
  const [nonDuplicateJobSheetNumbers, setNonDuplicateJobSheetNumbers] =
    useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const getJobSheetNumbers = async () => {
      try {
        const list = [];
        const q = query(
          collection(db, "packing_line_data"),
          orderBy("packing_job_sheet_number", "asc")
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          if (doc.data()) {
            list.push({ id: doc.id, ...doc.data() });
          }
        });

        setAllJobSheetNumbers(list);
      } catch (error) {
        console.log(error);
      }
    };

    getJobSheetNumbers();
  }, []);

  useEffect(() => {
    if (allJobSheetNumbers.length > 0) {
      let jobSheetNumbers = new Set();
      let nonDuplicateJobSheetNumbersArray = [];

      allJobSheetNumbers.forEach((doc) => {
        if (!jobSheetNumbers.has(doc.packing_job_sheet_number)) {
          jobSheetNumbers.add(doc.packing_job_sheet_number);
          nonDuplicateJobSheetNumbersArray.push(doc.packing_job_sheet_number);
        }
      });

      setNonDuplicateJobSheetNumbers(nonDuplicateJobSheetNumbersArray);
    }
  }, [allJobSheetNumbers]);

  useEffect(() => {
    if (nonDuplicateJobSheetNumbers.length > 0) {
      const filteredData = [];

      nonDuplicateJobSheetNumbers.forEach((jobSheetNumber) => {
        const matchingObjects = allJobSheetNumbers.filter(
          (obj) => obj.packing_job_sheet_number === jobSheetNumber
        );

        filteredData.push({
          id: jobSheetNumber,
          job_sheet_number: jobSheetNumber,
          data: matchingObjects,
        });
      });

      setData(filteredData);
    }
  }, [allJobSheetNumbers, nonDuplicateJobSheetNumbers]);

  const getOrderName = (item) => {
    let orderNameObj = {
      id: "",
      order_name: "",
    };

    item.data.forEach((i) => {
      if (i.packing_order_name) {
        orderNameObj = {
          id: i.packing_job_sheet_number,
          order_name: i.packing_order_name,
        };
      }
    });

    return <p className="text-capitalize">{orderNameObj.order_name || "-"}</p>;
  };

  // console.log("data -> ", data);

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

                <div className="bg-white rounded">
                  <div className="row text-center rounded d-flex align-items-center fw-bold smallText">
                    <div className="col-1">
                      <p>JS #</p>
                    </div>
                    <div className="col-2">
                      <p>Order name</p>
                    </div>
                    <div className="col-1">
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
                      {nonDuplicateJobSheetNumbers.map(
                        (jobSheetNumber, index) => (
                          <p key={index} className="py-1">
                            {jobSheetNumber}
                          </p>
                        )
                      )}
                    </div>

                    <div className="col-2">
                      {data.map((item, index) => (
                        <p key={index} className="py-1">
                          {getOrderName(item)}
                        </p>
                      ))}
                    </div>
                    <div className="col-1">
                      {data.map((item, index) => (
                        <p key={index} className="py-1">
                          Done
                        </p>
                      ))}
                    </div>
                    <div className="col-1"></div>
                    <div className="col-1"></div>
                    <div className="col-1"></div>
                    <div className="col-1"></div>
                    <div className="col-4"></div>
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

export default PackingLineSummary;
