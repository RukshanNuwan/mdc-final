import { Link, useLocation, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";

const LaboratoryDetails = () => {
  const { location } = useParams();
  const { state } = useLocation();

  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="col-md-12">
            <Breadcrumb
              title={`${location === "mdc" ? "SD 03" : "SD 04"} / Laboratory`}
            />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="mb-2">
                <Link
                  to={`/lab-section/${location}`}
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
                        <div className="col-5">
                          <p className="bodyText fw-bold">{state?.date}</p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Wet batch number</p>
                        </div>
                        <div className="col-5">
                          <p className="bodyText fw-bold">
                            {state?.primary_batch_number}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Batch number</p>
                        </div>
                        <div className="col-5">
                          <p className="bodyText fw-bold">
                            {state?.batch_number}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Batch code</p>
                        </div>
                        <div className="col-5">
                          <p className="bodyText fw-bold">
                            {state?.batch_code}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Expected powder quantity</p>
                        </div>
                        <div className="col-5">
                          <p className="bodyText fw-bold">
                            {state?.expected_powder_quantity}kg
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Status</p>
                        </div>
                        <div className="col-5">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.lab_status}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Order name</p>
                        </div>
                        <div className="col-5">
                          <p className="bodyText fw-bold text-capitalize">
                            {state.order_name}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Order type</p>
                        </div>
                        <div className="col-5">
                          <p className="bodyText fw-bold text-capitalize">
                            {state.order_type}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Sample in time</p>
                        </div>
                        <div className="col-5">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.lab_sample_in_time}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Test start time</p>
                        </div>
                        <div className="col-5">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.lab_test_start_time}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <span className="sectionTitle sectionTitlePink text-uppercase">
                        Raw milk
                      </span>

                      <div className="col-12 d-flex justify-content-evenly mt-2">
                        <div className="text-center">
                          <p className="subSectionKey bodyText">pH</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.lab_raw_ph}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">TSS</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.lab_raw_tss}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Fat</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.lab_raw_fat}
                          </p>
                        </div>
                      </div>

                      <div className="col-12 d-flex justify-content-evenly mt-4">
                        <div className="text-center">
                          <p className="subSectionKey bodyText">Taste</p>
                          <p className="subSectionValue bodyText">
                            {state?.lab_row_taste === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Color</p>
                          <p className="subSectionValue bodyText">
                            {state?.lab_row_color === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Odor</p>
                          <p className="subSectionValue bodyText">
                            {state?.lab_row_odor === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <span className="sectionTitle sectionTitlePink text-uppercase">
                        Mix milk
                      </span>

                      <div className="col-12 d-flex justify-content-evenly mt-2">
                        <div className="text-center">
                          <p className="subSectionKey bodyText">pH</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.lab_mix_ph}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">TSS</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.lab_mix_tss}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Fat</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.lab_mix_fat}
                          </p>
                        </div>
                      </div>

                      <div className="col-12 d-flex justify-content-evenly mt-4">
                        <div className="text-center">
                          <p className="subSectionKey bodyText">Taste</p>
                          <p className="subSectionValue bodyText">
                            {state?.lab_mix_taste === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Color</p>
                          <p className="subSectionValue bodyText">
                            {state?.lab_mix_color === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Odor</p>
                          <p className="subSectionValue bodyText">
                            {state?.lab_mix_odor === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {state?.lab_mix_issue && (
                      <div className="dataItemWrapper">
                        <>
                          <div className="row py-1">
                            <div className="col-7">
                              <p className="bodyText">Informed to</p>
                            </div>
                            <div className="col-5">
                              <p className="bodyText fw-bold text-capitalize">
                                {state?.lab_mix_issue_informed_to}
                              </p>
                            </div>
                          </div>

                          <div className="row py-1">
                            <div className="col-7">
                              <p className="bodyText">Issue details</p>
                            </div>
                            <div className="col-5">
                              <p className="bodyText fw-bold text-capitalize">
                                {state?.lab_mix_issue_details}
                              </p>
                            </div>
                          </div>
                        </>
                      </div>
                    )}

                    <div className="dataItemWrapper">
                      <span className="sectionTitle sectionTitlePink text-uppercase">
                        Milk powder
                      </span>

                      <div className="col-12 d-flex justify-content-evenly mt-2">
                        <div className="text-center">
                          <p className="subSectionKey bodyText">Fat</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.lab_powder_fat}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Moisture</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.lab_powder_moisture}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Bulk density</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.lab_powder_bulk_density}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Fat layer</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.lab_powder_fat_layer}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Time</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.lab_powder_fat_layer_time} min
                          </p>
                        </div>
                      </div>

                      <div className="col-12 d-flex justify-content-evenly mt-4">
                        <div className="text-center">
                          <p className="subSectionKey bodyText">Taste</p>
                          <p className="subSectionValue bodyText">
                            {state?.lab_powder_taste === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Color</p>
                          <p className="subSectionValue bodyText">
                            {state?.lab_powder_color === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Odor</p>
                          <p className="subSectionValue bodyText">
                            {state?.lab_powder_odor === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Solubility</p>
                          <p className="subSectionValue bodyText">
                            {state?.lab_powder_solubility === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Free flowing</p>
                          <p className="subSectionValue bodyText">
                            {state?.lab_powder_free_flowing === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {state?.lab_powder_issue && (
                      <div className="dataItemWrapper">
                        <div className="row py-1">
                          <div className="col-7">
                            <p className="bodyText">Informed to</p>
                          </div>
                          <div className="col-5">
                            <p className="bodyText fw-bold text-capitalize">
                              {state?.lab_powder_issue_informed_to}
                            </p>
                          </div>
                        </div>

                        <div className="row py-1">
                          <div className="col-7">
                            <p className="bodyText">Remarks</p>
                          </div>

                          <div className="col-5">
                            <p className="bodyText fw-bold text-capitalize">
                              {state.lab_powder_issue_details
                                ? state?.lab_powder_issue_details
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Checked by</p>
                        </div>

                        <div className="col-5">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.lab_technician_name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Reason for last update</p>
                        </div>

                        <div className="col-5">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.lab_reason_for_update}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-end">
                      <p className="smallText text-white">
                        Added at{" "}
                        {state?.lab_added_at?.toDate().toLocaleString()}
                      </p>

                      <p className="smallText text-white">
                        Last updated at{" "}
                        {state?.lab_updated_at?.toDate().toLocaleString()}
                      </p>
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

export default LaboratoryDetails;
