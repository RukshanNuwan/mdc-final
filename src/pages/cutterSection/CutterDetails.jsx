import { Link, useLocation } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

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
                  <ArrowBackIosIcon fontSize="small" /> Back
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
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">{state?.date}</p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">W batch number</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.primary_batch_number}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Location</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.location === "mdc" ? "SD 03" : "SD 04"}
                          </p>
                        </div>
                      </div>

                      {state.location && state.location === "araliya_kele" && (
                        <div className="row py-1">
                          <div className="col-7">
                            <p className="bodyText">Bowser load time</p>
                          </div>
                          <div className="col-1" />
                          <div className="col-4">
                            <p className="bodyText fw-bold">
                              {state?.cutter_bowser_load_time}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Status</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.cutter_status}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Blancher start time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.blancher_in_time}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Cutter finish time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.cutter_finish_time}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Expeller start time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.cutter_expeller_start_time}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Expeller finish time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.expeller_finish_time}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Process time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {`${
                              state?.cutter_expeller_process_time?.hours
                                ? state?.cutter_expeller_process_time?.hours
                                : "-"
                            }hr ${
                              state?.cutter_expeller_process_time?.minutes
                                ? state?.cutter_expeller_process_time?.minutes
                                : "-"
                            }min`}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Delay time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold text-danger">
                            {state?.cutter_expeller_delay_time}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Heat valve</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.cutter_heat_valve === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <div>
                                <CloseIcon className="text-danger" />
                              </div>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Special notes</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.cutter_special_notes
                              ? state?.cutter_special_notes
                              : "-"}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Operator name</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.cutter_operator_name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-end">
                      <p className="smallText text-white">
                        Added at{" "}
                        {state?.cutter_added_at?.toDate().toLocaleString()}
                      </p>

                      <p className="smallText text-white">
                        Last updated at{" "}
                        {state?.cutter_updated_at?.toDate().toLocaleString()}
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

      <Footer />
      <BackToTop />
    </>
  );
};

export default CutterDetails;
