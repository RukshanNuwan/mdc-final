import { Link, useLocation } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import DataPill from "../../components/dataPIll/DataPill";

const PackingLineDetails = () => {
  const { state } = useLocation();

  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="col-md-12">
            <Breadcrumb title="Packing Lines" />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="mb-2">
                <Link
                  to="/packing-lines"
                  className="d-flex align-items-center customBackBtn"
                >
                  <ArrowBackIosIcon fontSize="small" /> Back
                </Link>
              </div>

              {/* TODO: Update this layout */}
              <div className="card-body formWrapper">
                <div className="row">
                  <div className="col d-xs-none"></div>

                  <div className="col-md-8">
                    <p className="display-6 mb-4 text-white">Details</p>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Production date</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.packing_production_date || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">SD batch code</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.production_batch_code || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">SD 03 / 04 bag numbers</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-md-4">
                          <span className="bodyText fw-bold">
                            {
                              <DataPill
                                data={state?.packing_bag_numbers}
                                color="pink"
                              />
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Job sheet number</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.packing_job_sheet_number || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">T code</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.packing_packing_batch_code || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">T code range</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.packing_bag_number_range_start} -{" "}
                            {state?.packing_bag_number_range_end}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Total number of pieces</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.packing_total_number_of_pieces || "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Packing type</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.packing_type.replace(/_/g, " ") || "-"}
                          </p>
                        </div>
                      </div>

                      {state?.packing_type === "packing_type_20" && (
                        <div className="row py-1">
                          <div className="col-7">
                            <p className="bodyText">C bag numbers</p>
                          </div>
                          <div className="col-1" />
                          <div className="col-4">
                            <span className="bodyText fw-bold">
                              {
                                <DataPill
                                  data={state?.packing_craft_bag_number}
                                  color="pink"
                                />
                              }
                            </span>
                          </div>
                        </div>
                      )}

                      {state?.packing_type === "packing_type_other" && (
                        <>
                          <div className="row py-1">
                            <div className="col-7">
                              <p className="bodyText">Carton box number</p>
                            </div>
                            <div className="col-1" />
                            <div className="col-md-4">
                              <span className="bodyText fw-bold">
                                {
                                  <DataPill
                                    data={state?.packing_carton_box_number.split(
                                      ","
                                    )}
                                    color="pink"
                                  />
                                }
                              </span>
                            </div>
                          </div>

                          <div className="row py-1">
                            <div className="col-7">
                              <p className="bodyText">Time range</p>
                            </div>
                            <div className="col-1" />
                            <div className="col-4">
                              <p className="bodyText fw-bold">
                                {state?.packing_packet_time_range_start} -{" "}
                                {state?.packing_packet_time_range_end}
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Remarks</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.packing_remarks || "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Powder collecting QC name</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.packing_powder_collecting_qc_name || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Carton packing QC name</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.packing_carton_packing_qc_name || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Line supervisor name</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.packing_line_supervisor_name || "-"}
                          </p>
                        </div>
                      </div>
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

export default PackingLineDetails;
