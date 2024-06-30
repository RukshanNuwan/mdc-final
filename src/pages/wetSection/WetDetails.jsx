import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link, useLocation } from "react-router-dom";

import BackToTop from "../../components/backToTop/BackToTop";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";

const WetDetails = () => {
  const { state } = useLocation();

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
              <div className="mb-2">
                <Link
                    to="/wet-section"
                    className="d-flex align-items-center customBackBtn"
                >
                  <ArrowBackIosIcon fontSize="small"/> Back
                </Link>
              </div>

              <div className="card-body formWrapper">
                <div className="row">
                  <div className="col d-xs-none"></div>

                  <div className="col-md-8">
                    <p className="display-6 mb-4 text-white">Batch details</p>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Production date</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">{state?.date}</p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Batch number</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.batchNumber}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Tank number</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.tankNumber}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Coconut kernel weight</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.kernelWeight}kg
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Coconut kernel quality</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.quality === true ? (
                                <CheckIcon className="text-success"/>
                            ) : (
                                <CloseIcon className="text-danger"/>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">
                            Coconut kernel quality remark
                          </p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.kernelQualityRemark
                                ? state?.kernelQualityRemark
                                : "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Blancher in time</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.blancherInTime}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Operator's name</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.operator}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-end">
                      <p className="smallText text-white">
                        Added at {state?.timeStamp?.toDate().toLocaleString()}
                      </p>
                      {/* <p className="smallText">
                        by {data?.addedBy.displayName}
                      </p> */}
                    </div>
                  </div>

                  <div className="col d-xs-none"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer/>
      <BackToTop/>
    </>
  );
};

export default WetDetails;
