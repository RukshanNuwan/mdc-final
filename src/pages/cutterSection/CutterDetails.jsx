import { Link, useLocation } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import LoopIcon from "@mui/icons-material/Loop";

import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";

const CutterDetails = () => {
  const { state } = useLocation();

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
              <div className="mb-2">
                <Link
                    to="/cutter-section"
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
                          <p className="bodyText">Location</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.location === "mdc" ? "MDC" : "Araliya Kele"}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Status</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.status === "completed" ? (
                                <PublishedWithChangesIcon className="text-success"/>
                            ) : (
                                <div>
                                  <LoopIcon className="text-primary"/>
                                </div>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Blancher start time</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.blancherStartTime}
                          </p>
                        </div>
                      </div>

                      {/* <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Cutter start time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {data?.cutterStartTime}
                          </p>
                        </div>
                      </div> */}

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Cutter finish time</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.cutterFinishTime}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Expeller start time</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.expellerStartTime}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Expeller finish time</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.expellerFinishTime}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Process time</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {`${
                                state?.expellerProcessTime?.hours
                                    ? state?.expellerProcessTime?.hours
                                    : "-"
                            }hr ${
                                state?.expellerProcessTime?.minutes
                                    ? state?.expellerProcessTime?.minutes
                                    : "-"
                            }min`}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Delay time</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold text-danger">
                            {state?.expellerDelayTime}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Heat valve</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.heatValve === true ? (
                                <CheckIcon className="text-success"/>
                            ) : (
                                <div>
                                  <CloseIcon className="text-danger"/>
                                </div>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Special notes</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.specialNotes ? state?.specialNotes : "---"}
                          </p>
                        </div>
                      </div>

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
                        by {data?.addedBy?.displayName}
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

export default CutterDetails;
