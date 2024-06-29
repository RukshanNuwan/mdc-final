import { Link, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import DataTable from "../../components/dataTable/DataTable";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";
import { laboratorySectionColumns } from "../../data/dataTableSource";

const LaboratorySection = () => {
  const { location } = useParams();

  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="col-md-12">
            <Breadcrumb
              title={`${
                location === "mdc" ? "SD 03" : "SD 04"
              } / Laboratory`}
            />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="card-body p-0">
                <Link
                  to="/lab-section"
                  className="d-flex align-items-center customClearBtn"
                >
                  <ArrowBackIosIcon fontSize="small" /> Back
                </Link>

                <div className="addNewBtnWrapper">
                  {/* print button */}
                  <Link
                    to="new"
                    className="addNewBtn customBtn"
                  >
                    Add new
                  </Link>
                </div>

                <DataTable
                  collectionName="lab_section"
                  columnName={laboratorySectionColumns}
                  location={location}
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

export default LaboratorySection;
