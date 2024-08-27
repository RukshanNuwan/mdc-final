import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { doc, getDoc } from "firebase/firestore";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";
import { db } from "../../config/firebase.config";
import DataPill from "../../components/dataPIll/DataPill";

const SearchResultDetails = () => {
  const [packingLineData, setPackingLineData] = useState({});
  const [productionData, setProductionData] = useState({});

  const { id } = useParams();

  useEffect(() => {
    const fetchPackingLineDataById = async () => {
      const docRef = doc(db, "packing_line_data", id);

      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) setPackingLineData(docSnap.data());
      } catch (error) {
        console.log(error);
      }
    };

    fetchPackingLineDataById();
  }, [id]);

  useEffect(() => {
    const fetchProductionDataById = async () => {
      if (packingLineData.production_batch_id) {
        const docRef = doc(
          db,
          "production_data",
          packingLineData.production_batch_id
        );

        try {
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) setProductionData(docSnap.data());
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchProductionDataById();
  }, [packingLineData.production_batch_id]);

  return (
    <>
      <Header />
      <SideBar />

      <main className="main" id="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="mb-2">
                <Link
                  to="/complaints"
                  className="d-flex align-items-center customBackBtn"
                >
                  <ArrowBackIosIcon fontSize="small" /> Back
                </Link>
              </div>

              <div className="card-body">
                <h1 className="display-6">Batch details</h1>

                <div className="row mt-5">
                  <div className="col-12 mb-2 formWrapper">
                    <span className="sectionTitle sectionTitleYellow text-uppercase">
                      Packing line
                    </span>

                    <div className="mt-4 text-white">
                      <div className="row m-0">
                        <div className="col-sm-6 col-md-3">
                          <div className="d-flex justify-content-between">
                            <h6>SD batch code</h6>
                            <p className="text-light-blue">
                              {packingLineData.production_batch_code}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3">
                          <div className="d-flex justify-content-between">
                            <h6>Job sheet number</h6>
                            <p className="text-light-blue">
                              {packingLineData.packing_job_sheet_number}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3">
                          <div className="d-flex justify-content-between">
                            <h6>Production date</h6>
                            <p className="text-light-blue">
                              {productionData.date}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3">
                          <div className="d-flex justify-content-between">
                            <h6>SD batch number</h6>
                            <p className="text-light-blue">
                              {productionData.batch_number}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3">
                          <div className="d-flex justify-content-between">
                            <h6>Order name</h6>
                            <p className="text-light-blue text-capitalize">
                              {productionData.order_name?.replace(/_/g, " ")}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3">
                          <div className="d-flex justify-content-between">
                            <h6>Packing type</h6>
                            <p className="text-light-blue">
                              {packingLineData.packing_type ===
                              "packing_type_20"
                                ? "20kg"
                                : "Other"}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3">
                          <div className="d-flex justify-content-between">
                            <h6>
                              {packingLineData.packing_type ===
                              "packing_type_20"
                                ? "Craft bag"
                                : "Carton box"}{" "}
                              number
                            </h6>
                            <p className="text-light-blue">
                              {packingLineData.packing_type ===
                              "packing_type_20" ? (
                                <DataPill
                                  data={
                                    packingLineData.packing_craft_bag_number
                                  }
                                  color="pink"
                                />
                              ) : (
                                <DataPill
                                  data={packingLineData.packing_carton_box_number?.split(
                                    ","
                                  )}
                                  color="pink"
                                />
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3">
                          <div className="d-flex justify-content-between">
                            <h6>T code range</h6>
                            <p className="text-light-blue">
                              {packingLineData.packing_bag_number_range_start} -{" "}
                              {packingLineData.packing_bag_number_range_end}
                            </p>
                          </div>
                        </div>

                        {packingLineData.packing_type ===
                          "packing_type_other" && (
                          <div className="col-sm-6 col-md-3">
                            <div className="d-flex justify-content-between">
                              <h6>Time range</h6>
                              <p className="text-light-blue">
                                {
                                  packingLineData.packing_packet_time_range_start
                                }{" "}
                                -{" "}
                                {packingLineData.packing_packet_time_range_end}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="col-sm-6 col-md-3">
                          <div className="d-flex justify-content-between">
                            <h6>SD bag number(s)</h6>
                            <p className="text-light-blue">
                              {
                                <DataPill
                                  data={packingLineData.packing_bag_numbers}
                                  color="pink"
                                />
                              }
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3">
                          <div className="d-flex justify-content-between">
                            <h6>T code</h6>
                            <p className="text-light-blue">
                              {packingLineData.packing_packing_batch_code?.trim()}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3 mt-xs-1" />

                        <div className="col-sm-6 col-md-3 mt-xs-1">
                          <div className="d-flex justify-content-between">
                            <h6>Powder collecting QC name</h6>
                            <p className="text-light-blue">
                              {
                                packingLineData.packing_powder_collecting_qc_name
                              }
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3 mt-xs-1">
                          <div className="d-flex justify-content-between">
                            <h6>Carton packing QC name</h6>
                            <p className="text-light-blue">
                              {packingLineData.packing_carton_packing_qc_name}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3 mt-xs-1">
                          <div className="d-flex justify-content-between">
                            <h6>Line supervisor name</h6>
                            <p className="text-light-blue">
                              {packingLineData.packing_line_supervisor_name}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3 mt-xs-1">
                          <div className="d-flex justify-content-between">
                            <h6>Added at</h6>
                            <p className="text-light-blue">
                              {packingLineData.packing_line_added_at
                                ?.toDate()
                                .toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-2 p-0 pe-md-1 d-flex">
                    <div className="formWrapper flex-1">
                      <span className="sectionTitle sectionTitleYellow text-uppercase">
                        Wet section
                      </span>

                      <div className="mt-4 text-white">
                        <div className="row m-0">
                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>W batch number</h6>
                              <p className="text-light-blue">
                                {productionData.primary_batch_number}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Tank number</h6>
                              <p className="text-light-blue">
                                {productionData.wet_tank_number}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Kernel weight</h6>
                              <p className="text-light-blue">
                                {productionData.wet_kernel_weight}Kg
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Blancher in time</h6>
                              <p className="text-light-blue">
                                {productionData.blancher_in_time}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Kernel quality</h6>
                              <p className="text-light-blue">
                                {productionData.wet_kernel_quality === true ? (
                                  <CheckIcon className="text-success" />
                                ) : (
                                  <CloseIcon className="text-danger" />
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Remarks</h6>
                              <p className="text-light-blue text-capitalize">
                                {productionData.wet_remark
                                  ? productionData.wet_remark
                                  : "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-2 p-0 ps-md-1 d-flex">
                    <div className="formWrapper">
                      <span className="sectionTitle sectionTitleYellow text-uppercase">
                        Cutter section
                      </span>

                      <div className="mt-4 text-white">
                        <div className="row m-0">
                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Location</h6>
                              <p className="text-light-blue">
                                {productionData.location === "mdc"
                                  ? "SD 03"
                                  : "SD 04"}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Cutter start time</h6>
                              <p className="text-light-blue">
                                {productionData.blancher_in_time}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Cutter finish time</h6>
                              <p className="text-light-blue">
                                {productionData.cutter_finish_time}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Expeller start time</h6>
                              <p className="text-light-blue">
                                {productionData.cutter_expeller_start_time}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Expeller finish time</h6>
                              <p className="text-light-blue text-capitalize">
                                {productionData.expeller_finish_time}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Process time</h6>
                              <p className="text-light-blue text-capitalize">
                                {`${
                                  productionData?.cutter_expeller_process_time
                                    ?.hours
                                    ? productionData
                                        ?.cutter_expeller_process_time?.hours
                                    : "-"
                                }hr ${
                                  productionData?.cutter_expeller_process_time
                                    ?.minutes
                                    ? productionData
                                        ?.cutter_expeller_process_time?.minutes
                                    : "-"
                                }min`}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Delay time</h6>
                              <p className="text-light-blue text-capitalize">
                                {productionData.cutter_expeller_delay_time}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Heat valve</h6>
                              <p className="text-light-blue text-capitalize">
                                {productionData.cutter_heat_valve === true ? (
                                  <CheckIcon className="text-success" />
                                ) : (
                                  <div>
                                    <CloseIcon className="text-danger" />
                                  </div>
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Special notes</h6>
                              <p className="text-light-blue text-capitalize">
                                {productionData.cutter_special_notes
                                  ? productionData.cutter_special_notes
                                  : "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-2 p-0 pe-md-1 d-flex">
                    <div className="formWrapper">
                      <span className="sectionTitle sectionTitleYellow text-uppercase">
                        Mixing section
                      </span>

                      <div className="mt-4 text-white">
                        <div className="row m-0">
                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Milk amount</h6>
                              <p className="text-light-blue">
                                {productionData.mixing_milk_quantity}Kg
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Expeller efficiency</h6>
                              <p className="text-light-blue">
                                {productionData.mixing_milk_recovery}%
                              </p>
                            </div>
                          </div>

                          {productionData.mixing_additional_crates_count !==
                            0 && (
                            <>
                              <div className="col-sm-6 col-md-4">
                                <div className="d-flex justify-content-between">
                                  <h6>Additionally added crates count</h6>
                                  <p className="text-light-blue">
                                    {
                                      productionData.mixing_additional_crates_count
                                    }
                                  </p>
                                </div>
                              </div>

                              <div className="col-sm-6 col-md-4">
                                <div className="d-flex justify-content-between">
                                  <h6>Informed to</h6>
                                  <p className="text-light-blue">
                                    {
                                      productionData.mixing_additional_crates_informed_to
                                    }
                                  </p>
                                </div>
                              </div>
                            </>
                          )}

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Raw milk in time</h6>
                              <p className="text-light-blue">
                                {productionData.expeller_finish_time}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Mixing tank in time</h6>
                              <p className="text-light-blue">
                                {productionData.mixing_tank_in_time}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Mix start time</h6>
                              <p className="text-light-blue text-capitalize">
                                {productionData.mixing_mix_start_time}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Mix finish time</h6>
                              <p className="text-light-blue text-capitalize">
                                {productionData.mixing_mix_finish_time}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Feeding tank in time</h6>
                              <p className="text-light-blue text-capitalize">
                                {productionData.mixing_feeding_tank_in_time}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Feed start time</h6>
                              <p className="text-light-blue text-capitalize">
                                {productionData.mixing_feed_start_time}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Pressure pump</h6>
                              <p className="text-light-blue text-capitalize">
                                {productionData.mixing_pressure_pump_value}MPa
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Steam pressure</h6>
                              <p className="text-light-blue text-capitalize">
                                {productionData.mixing_steam_pressure_value}MPa
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Remarks</h6>
                              <p className="text-light-blue text-capitalize">
                                {productionData.mixing_mix_details
                                  ? productionData.mixing_mix_details
                                  : "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-2 p-0 ps-md-1 d-flex">
                    <div className="formWrapper">
                      <span className="sectionTitle sectionTitleYellow text-uppercase">
                        Spray dryer
                      </span>

                      <div className="mt-4 text-white">
                        <div className="row m-0">
                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Powder spray start time</h6>
                              <p className="text-light-blue">
                                {productionData.sd_powder_spray_start_time}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Powder spray finish time</h6>
                              <p className="text-light-blue">
                                {productionData.sd_batch_finish_time}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Powder quantity</h6>
                              <p className="text-light-blue">
                                {productionData.sd_total_powder_quantity}Kg
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Expected powder quantity</h6>
                              <p className="text-light-blue">
                                {productionData.expected_powder_quantity}Kg
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>RP</h6>
                              <p className="text-light-blue">
                                {productionData.sd_rp_quantity}Kg
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Powder recovery</h6>
                              <p className="text-light-blue">
                                {productionData.sd_powder_recovery}%
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Atomizer size</h6>
                              <p className="text-light-blue">
                                {productionData.sd_atomizer_size}mm
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Inlet temperature</h6>
                              <p className="text-light-blue">
                                {productionData.sd_inlet_temp}&deg;C
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Outlet temperature</h6>
                              <p className="text-light-blue">
                                {productionData.sd_outlet_temp}&deg;C
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Other details</h6>
                              <p className="text-light-blue">
                                {productionData.sd_other_details
                                  ? productionData.sd_other_details
                                  : "-"}
                              </p>
                            </div>
                          </div>

                          <div className="col-sm-6 col-md-4">
                            <div className="d-flex justify-content-between">
                              <h6>Special notes</h6>
                              <p className="text-light-blue">
                                {productionData.sd_special_notes
                                  ? productionData.sd_special_notes
                                  : "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 formWrapper">
                    <span className="sectionTitle sectionTitleYellow text-uppercase">
                      Laboratory
                    </span>

                    <div className="mt-4 text-white">
                      <div className="row m-0">
                        <div className="col-sm-6 col-md-4">
                          <div className="d-flex justify-content-between">
                            <h6>Sample in time</h6>
                            <p className="text-light-blue">
                              {productionData.lab_sample_in_time}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-4">
                          <div className="d-flex justify-content-between">
                            <h6>Test start time</h6>
                            <p className="text-light-blue">
                              {productionData.lab_test_start_time}
                            </p>
                          </div>
                        </div>

                        <hr className="custom-hr-yellow" />

                        <span className="sectionTitle sectionTitlePink text-uppercase">
                          Raw milk
                        </span>

                        <div className="col-sm-4 col-md-2 mt-2">
                          <div className="d-flex justify-content-between">
                            <h6>pH</h6>
                            <p className="text-light-blue">
                              {productionData.lab_raw_ph}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-4 col-md-2 mt-sm-2">
                          <div className="d-flex justify-content-between">
                            <h6>TSS</h6>
                            <p className="text-light-blue">
                              {productionData.lab_raw_tss}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-4 col-md-2 mt-sm-2">
                          <div className="d-flex justify-content-between">
                            <h6>Fat</h6>
                            <p className="text-light-blue">
                              {productionData.lab_raw_fat}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-4 col-md-2 mt-sm-2">
                          <div className="d-flex justify-content-between">
                            <h6>Taste</h6>
                            <p className="text-light-blue">
                              {productionData?.lab_row_taste === true ? (
                                <CheckIcon className="text-success" />
                              ) : (
                                <CloseIcon className="text-danger" />
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-4 col-md-2 mt-sm-2">
                          <div className="d-flex justify-content-between">
                            <h6>Color</h6>
                            <p className="text-light-blue">
                              {productionData?.lab_row_color === true ? (
                                <CheckIcon className="text-success" />
                              ) : (
                                <CloseIcon className="text-danger" />
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-4 col-md-2 mt-sm-2">
                          <div className="d-flex justify-content-between">
                            <h6>Odor</h6>
                            <p className="text-light-blue">
                              {productionData?.lab_row_taste === true ? (
                                <CheckIcon className="text-success" />
                              ) : (
                                <CloseIcon className="text-danger" />
                              )}
                            </p>
                          </div>
                        </div>

                        <span className="sectionTitle sectionTitlePink text-uppercase mt-2">
                          Mix milk
                        </span>

                        <div className="col-sm-4 col-md-2 mt-2">
                          <div className="d-flex justify-content-between">
                            <h6>pH</h6>
                            <p className="text-light-blue">
                              {productionData.lab_mix_ph}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-4 col-md-2 mt-sm-2">
                          <div className="d-flex justify-content-between">
                            <h6>TSS</h6>
                            <p className="text-light-blue">
                              {productionData.lab_mix_tss}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-4 col-md-2 mt-sm-2">
                          <div className="d-flex justify-content-between">
                            <h6>Fat</h6>
                            <p className="text-light-blue">
                              {productionData.lab_mix_fat}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-4 col-md-2 mt-sm-2">
                          <div className="d-flex justify-content-between">
                            <h6>Taste</h6>
                            <p className="text-light-blue">
                              {productionData?.lab_mix_taste === true ? (
                                <CheckIcon className="text-success" />
                              ) : (
                                <CloseIcon className="text-danger" />
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-4 col-md-2 mt-sm-2">
                          <div className="d-flex justify-content-between">
                            <h6>Color</h6>
                            <p className="text-light-blue">
                              {productionData?.lab_mix_color === true ? (
                                <CheckIcon className="text-success" />
                              ) : (
                                <CloseIcon className="text-danger" />
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-4 col-md-2 mt-sm-2">
                          <div className="d-flex justify-content-between">
                            <h6>Odor</h6>
                            <p className="text-light-blue">
                              {productionData?.lab_mix_taste === true ? (
                                <CheckIcon className="text-success" />
                              ) : (
                                <CloseIcon className="text-danger" />
                              )}
                            </p>
                          </div>
                        </div>

                        {productionData.lab_mix_issue && (
                          <>
                            <div className="col-sm-6 col-md-4 mt-2">
                              <div className="d-flex justify-content-between">
                                <h6>Issue informed to</h6>
                                <p className="text-light-blue">
                                  {productionData.lab_mix_issue_informed_to}
                                </p>
                              </div>
                            </div>

                            <div className="col-sm-6 col-md-4 mt-2">
                              <div className="d-flex justify-content-between">
                                <h6>Details</h6>
                                <p className="text-light-blue">
                                  {productionData.lab_mix_issue_details
                                    ? productionData.lab_mix_issue_details
                                    : "-"}
                                </p>
                              </div>
                            </div>
                          </>
                        )}

                        <span className="sectionTitle sectionTitlePink text-uppercase mt-2">
                          Milk powder
                        </span>

                        <div className="col-sm-4 col-md mt-sm-2">
                          <div className="d-flex justify-content-between">
                            <h6>pH</h6>
                            <p className="text-light-blue">
                              {productionData.lab_powder_ph}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-4 col-md mt-sm-2">
                          <div className="d-flex justify-content-between">
                            <h6>Moisture</h6>
                            <p className="text-light-blue">
                              {productionData.lab_powder_moisture}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-4 col-md mt-2">
                          <div className="d-flex justify-content-between">
                            <h6>Fat</h6>
                            <p className="text-light-blue">
                              {productionData.lab_powder_fat}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-4 col-md mt-sm-2">
                          <div className="d-flex justify-content-between">
                            <h6>Bulk density</h6>
                            <p className="text-light-blue">
                              {productionData.lab_powder_bulk_density}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-4 col-md mt-sm-2">
                          <div className="d-flex justify-content-between">
                            <h6>Fat layer</h6>
                            <p className="text-light-blue">
                              {productionData.lab_powder_fat_layer} cm
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-4 col-md mt-sm-2">
                          <div className="d-flex justify-content-between">
                            <h6>Time</h6>
                            <p className="text-light-blue">
                              {productionData.lab_powder_fat_layer_time} min
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="row m-0 mt-2">
                        <div className="col-sm col-md">
                          <div className="d-flex justify-content-between">
                            <h6>Taste</h6>
                            <p className="text-light-blue">
                              {productionData?.lab_powder_taste === true ? (
                                <CheckIcon className="text-success" />
                              ) : (
                                <CloseIcon className="text-danger" />
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm col-md">
                          <div className="d-flex justify-content-between">
                            <h6>Color</h6>
                            <p className="text-light-blue">
                              {productionData?.lab_powder_color === true ? (
                                <CheckIcon className="text-success" />
                              ) : (
                                <CloseIcon className="text-danger" />
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm col-md">
                          <div className="d-flex justify-content-between">
                            <h6>Odor</h6>
                            <p className="text-light-blue">
                              {productionData?.lab_powder_odor === true ? (
                                <CheckIcon className="text-success" />
                              ) : (
                                <CloseIcon className="text-danger" />
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm col-md">
                          <div className="d-flex justify-content-between">
                            <h6>Solubility</h6>
                            <p className="text-light-blue">
                              {productionData?.lab_powder_solubility ===
                              true ? (
                                <CheckIcon className="text-success" />
                              ) : (
                                <CloseIcon className="text-danger" />
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm col-md">
                          <div className="d-flex justify-content-between">
                            <h6>Free flowing</h6>
                            <p className="text-light-blue">
                              {productionData?.lab_powder_free_flowing ===
                              true ? (
                                <CheckIcon className="text-success" />
                              ) : (
                                <CloseIcon className="text-danger" />
                              )}
                            </p>
                          </div>
                        </div>

                        {productionData.lab_powder_issue && (
                          <div className="row mt-2">
                            <div className="col-sm-6 col-md-4">
                              <div className="d-flex justify-content-between">
                                <h6>Issue informed to</h6>
                                <p className="text-light-blue">
                                  {productionData.lab_powder_issue_informed_to}
                                </p>
                              </div>
                            </div>

                            <div className="col-sm-6 col-md-4">
                              <div className="d-flex justify-content-between">
                                <h6>Details</h6>
                                <p className="text-light-blue">
                                  {productionData.lab_powder_issue_details
                                    ? productionData.lab_powder_issue_details
                                    : "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="col-sm-6 col-md-4">
                          <div className="d-flex justify-content-between">
                            <h6>Checked by</h6>
                            <p className="text-light-blue text-capitalize">
                              {productionData.lab_technician_name}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

export default SearchResultDetails;
