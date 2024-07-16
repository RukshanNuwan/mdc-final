import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { doc, getDoc } from "firebase/firestore";

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

  console.log("packingLineData -> ", packingLineData);
  console.log("productionData -> ", productionData);

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
                            <h6>Batch code</h6>
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
                            <h6>Batch number</h6>
                            <p className="text-light-blue">
                              {productionData.batch_number}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3">
                          <div className="d-flex justify-content-between">
                            <h6>Order name</h6>
                            <p className="text-light-blue">
                              {productionData.order_name}
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
                              "packing_type_20"
                                ? packingLineData.packing_craft_bag_number
                                : packingLineData.packing_carton_box_number}
                            </p>
                          </div>
                        </div>

                        <div className="col-sm-6 col-md-3">
                          <div className="d-flex justify-content-between">
                            <h6>Bag number range</h6>
                            <p className="text-light-blue">
                              {packingLineData.packing_bag_number_range_start} -{" "}
                              {packingLineData.packing_bag_number_range_end}
                            </p>
                          </div>
                        </div>

                        {packingLineData.packing_type === "packing_type_20" && (
                          <div className="col-sm-6 col-md-3">
                            <div className="d-flex justify-content-between">
                              <h6>Bag number range</h6>
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
                            <h6>Bag number(s)</h6>
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

                  <div className="col-md-6 mb-2 p-0 pe-md-1">
                    <div className="formWrapper">
                      <span className="sectionTitle sectionTitleYellow text-uppercase">
                        Wet section
                      </span>

                      <div className="mt-4 text-white">content</div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-2 p-0 ps-md-1">
                    <div className="formWrapper">
                      <span className="sectionTitle sectionTitleYellow text-uppercase">
                        Cutter section
                      </span>

                      <div className="mt-4 text-white">content</div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-2 p-0 pe-md-1">
                    <div className="formWrapper">
                      <span className="sectionTitle sectionTitleYellow text-uppercase">
                        Mixing section
                      </span>

                      <div className="mt-4 text-white">content</div>
                    </div>
                  </div>

                  <div className="col-md-6 mb-2 p-0 ps-md-1">
                    <div className="formWrapper">
                      <span className="sectionTitle sectionTitleYellow text-uppercase">
                        Spray dryer
                      </span>

                      <div className="mt-4 text-white">content</div>
                    </div>
                  </div>

                  <div className="col-12 formWrapper">
                    <span className="sectionTitle sectionTitleYellow text-uppercase">
                      Laboratory
                    </span>

                    <div className="mt-4 text-white">content</div>
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
