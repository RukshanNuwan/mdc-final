import { Link, useLocation, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";
import DataPill from "../../components/dataPIll/DataPill";

const MixingDetails = () => {
  const { location } = useParams();
  const { state } = useLocation();

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
                  to={`/mixing-section/${location}`}
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
                            {state?.primary_batch_number
                              ? state?.primary_batch_number
                              : "-"}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">
                            {state.location === "mdc" ? "SD 03" : "SD 04"} batch
                            number
                          </p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.batch_number}
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
                            {state?.batch_code}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Recipe name</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.order_name.replace(/_/g, " ")}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Recipe type</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.order_type === "organic"
                              ? "Organic"
                              : "Conventional"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Milk amount</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.mixing_milk_quantity}Kg
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Milk recovery</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p
                            className={`bodyText fw-bold ${
                              state?.mixing_milk_recovery < "75"
                                ? "text-danger"
                                : "text-success"
                            }`}
                          >
                            {state?.mixing_milk_recovery}%
                          </p>
                        </div>
                      </div>

                      {state?.mixing_additional_crates_count !== 0 && (
                        <>
                          <div className="row py-1">
                            <div className="col-7">
                              <p className="bodyText">
                                Additionally added crates count
                              </p>
                            </div>
                            <div className="col-1" />
                            <div className="col-4">
                              <p className="bodyText fw-bold">
                                {state?.mixing_additional_crates_count}
                              </p>
                            </div>
                          </div>

                          <div className="row py-1">
                            <div className="col-7">
                              <p className="bodyText">Informed to</p>
                            </div>
                            <div className="col-1" />
                            <div className="col-4">
                              <p className="bodyText fw-bold text-capitalize">
                                {state?.mixing_additional_crates_informed_to}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="dataItemWrapper">
                      <span className="sectionTitle sectionTitlePink text-uppercase">
                        Previous batch raw milk details
                      </span>

                      <div className="row py-1 mt-3">
                        <div className="col-7">
                          <p className="bodyText">pH value</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.mixing_prev_batch_raw_ph
                              ? state?.mixing_prev_batch_raw_ph
                              : "-"}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">TSS value</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.mixing_prev_batch_raw_tss
                              ? `${state?.mixing_prev_batch_raw_tss}%`
                              : "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {state.location === "araliya_kele" && (
                      <div className="dataItemWrapper">
                        <div className="row py-1">
                          <div className="col-7">
                            <p className="bodyText">Bowser in time</p>
                          </div>
                          <div className="col-1" />
                          <div className="col-4">
                            <p className="bodyText fw-bold">
                              {state?.sd_4_bowser_in_time}
                            </p>
                          </div>
                        </div>

                        <div className="row py-1">
                          <div className="col-7">
                            <p className="bodyText">Batches in bowser</p>
                          </div>
                          <div className="col-1" />
                          <div className="col-4">
                            <p className="bodyText fw-bold">
                              {state?.sd_4_batches_in_bowser}
                            </p>
                          </div>
                        </div>

                        <div className="row py-1">
                          <div className="col-7">
                            <p className="bodyText">Filling hole cleaning</p>
                          </div>
                          <div className="col-1" />
                          <div className="col-4">
                            <p className="bodyText fw-bold">
                              {state?.sd_4_is_bowser_filling_hole_cleaned ===
                              true ? (
                                <CheckIcon className="text-success" />
                              ) : (
                                <CloseIcon className="text-danger" />
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="row py-1">
                          <div className="col-7">
                            <p className="bodyText">Output tap cleaning</p>
                          </div>
                          <div className="col-1" />
                          <div className="col-4">
                            <p className="bodyText fw-bold">
                              {state?.sd_4_is_bowser_output_tap_cleaned ===
                              true ? (
                                <CheckIcon className="text-success" />
                              ) : (
                                <CloseIcon className="text-danger" />
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="row py-1">
                          <div className="col-7">
                            <p className="bodyText">Overall condition</p>
                          </div>
                          <div className="col-1" />
                          <div className="col-4">
                            <p className="bodyText fw-bold">
                              {state?.sd_4_bowser_overall_condition
                                ? state?.sd_4_bowser_overall_condition
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Raw milk in time</p>
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
                          <p className="bodyText">Mixing tank in time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.mixing_tank_in_time}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Mix start time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.mixing_mix_start_time}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Mix finish time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.mixing_mix_finish_time}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Feeding tank in time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.mixing_feeding_tank_in_time}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Feed start time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.mixing_feed_start_time}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Steam pressure</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.mixing_steam_pressure_value} MPa
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Pressure pump</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.mixing_pressure_pump_value} MPa
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Operator's name(s)</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <div className="bodyText fw-bold">
                            {<DataPill data={state.mixing_operator_names} />}
                          </div>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Remarks</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.mixing_mix_details
                              ? state?.mixing_mix_details
                              : "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-end">
                      <p className="smallText text-white">
                        Added at{" "}
                        {state?.mixing_added_at?.toDate().toLocaleString()}
                      </p>
                      {state?.mixing_updated_at && (
                        <p className="smallText text-white">
                          Last updated at{" "}
                          {state?.mixing_updated_at?.toDate().toLocaleString()}
                        </p>
                      )}
                      {/* <p className="smallText text-capitalize">
                        by {state?.addedBy?.displayName}
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

export default MixingDetails;
