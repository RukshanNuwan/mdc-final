import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import ReportTile from "../../components/reportTile/ReportTile";
import Footer from "../../components/footer/Footer";

const Reports = () => {
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
                  to="/"
                  className="d-flex align-items-center customBackBtn"
                >
                  <ArrowBackIosIcon fontSize="small" /> Back
                </Link>
              </div>

              <div className="card-body formWrapper">
                <div className="row">
                  {/* <div className="col-md-3 mb-2">
                    <ReportTile
                      title="Production summary"
                      link="production-summary"
                    />
                  </div> */}

                  <div className="col-md-3 mb-2">
                    <ReportTile title="Daily summary" link="daily-summary" />
                  </div>

                  <div className="col-md-3 mb-2">
                    <ReportTile title="Breakdowns" link="breakdowns" />
                  </div>

                  <div className="col-md-3 mb-2">
                    <ReportTile title="Verifications" link="verifications" />
                  </div>

                  <div className="col-md-3">
                    <ReportTile title="Packing lines" link="packing-lines" />
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

export default Reports;
