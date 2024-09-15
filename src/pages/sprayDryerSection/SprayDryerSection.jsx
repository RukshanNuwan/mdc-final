import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Form } from "react-bootstrap";

import DataTable from "../../components/dataTable/DataTable";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";
import { sprayDryerSectionColumns } from "../../data/dataTableSource";
import { db } from "../../config/firebase.config";
import Breakdown from "../../components/breakdown/breakdown";

const SprayDryerSection = () => {
  const [isBreakdown, setIsBreakdown] = useState(false);
  const [ongoingBreakdown, setOngoingBreakdown] = useState();

  // const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const { location } = useParams();

  const handleBreakdownToggle = (e) => {
    setIsBreakdown(e.target.checked);
  };

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const q = query(
          collection(db, "breakdowns"),
          where("status", "==", "ongoing"),
          where("breakdown_section_name", "==", "sd"),
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
          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="mb-2">
                <Link
                  to="/sd-section"
                  className="d-flex align-items-center customBackBtn"
                >
                  <ArrowBackIosIcon fontSize="small" /> Back
                </Link>
              </div>

              <div className="card-body p-0">
                <div className="addNewBtnWrapper d-flex justify-content-between align-items-center">
                  {!isBreakdown && (
                    <>
                      <Link to="new" className="addNewBtn customBtn">
                        Add new
                      </Link>

                      <Form>
                        <Form.Group>
                          <Form.Label className="fw-bold breakdownToggle">
                            Breakdown
                          </Form.Label>

                          <Form.Switch
                            type="switch"
                            id="breakdown-switch"
                            checked={isBreakdown}
                            onChange={handleBreakdownToggle}
                          />
                        </Form.Group>
                      </Form>
                    </>
                  )}
                </div>

                {isBreakdown && (
                  <Breakdown
                    section="sd"
                    location={location}
                    ongoingBreakdown={ongoingBreakdown}
                    isBreakdown={isBreakdown}
                  />
                )}

                <DataTable
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
