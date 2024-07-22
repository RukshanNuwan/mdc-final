import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form } from "react-bootstrap";

import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import DataTable from "../../components/dataTable/DataTable";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";
import { cutterSectionColumns } from "../../data/dataTableSource";
import Breakdown from "../../components/breakdown/breakdown";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase.config";

const CutterSection = () => {
  const [isBreakdown, setIsBreakdown] = useState(false);
  const [ongoingBreakdown, setOngoingBreakdown] = useState();

  // const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const handleBreakdownToggle = (e) => {
    setIsBreakdown(e.target.checked);
  };

  useEffect(() => {
    const fetchBreakdownData = async () => {
      try {
        const q = query(
          collection(db, "breakdowns"),
          where("status", "==", "ongoing"),
          where("sectionName", "==", "cutter")
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setOngoingBreakdown({ id: doc.id, ...doc.data() });
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchBreakdownData();

    setIsBreakdown(ongoingBreakdown?.status === "ongoing");
  }, [ongoingBreakdown?.status]);

  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="col-md-12">
            <Breadcrumb title="Cutter Section" />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
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
                    section="cutter"
                    location="mdc"
                    isBreakdown={isBreakdown}
                    ongoingBreakdown={ongoingBreakdown}
                  />
                )}

                <DataTable columnName={cutterSectionColumns} />
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

export default CutterSection;
