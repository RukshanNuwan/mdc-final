import { Link, useLocation, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
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
          <div className="col-md-12">
            <Breadcrumb
              title={`${
                location === "mdc" ? "SD 03" : "SD 04"
              } / Mixing Section`}
            />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="mb-2">
                <Link
                    to={`/mixing-section/${location}`}
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
                          <p className="bodyText">Batch number (Wet)</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.wet_batch_number ? state?.wet_batch_number : '-'}
                          </p>
                        </div>
                      </div>

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
                          <p className="bodyText">Recipe name</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.recipeName}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Recipe type</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.recipeType === "organic"
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
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.milkQuantity}kg
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Milk recovery</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p
                              className={`bodyText fw-bold ${
                                  state?.milkRecovery < "75"
                                      ? "text-danger"
                                      : "text-success"
                              }`}
                          >
                            {state?.milkRecovery}%
                          </p>
                        </div>
                      </div>

                      {state?.additionalCratesCount !== 0 && (
                          <>
                            <div className="row py-1">
                              <div className="col-7">
                                <p className="bodyText">
                                  Additionally added crates count
                                </p>
                              </div>
                              <div className="col-1"/>
                              <div className="col-4">
                                <p className="bodyText fw-bold">
                                  {state?.additionalCratesCount}
                                </p>
                              </div>
                            </div>

                            <div className="row py-1">
                              <div className="col-7">
                                <p className="bodyText">Informed to</p>
                              </div>
                              <div className="col-1"/>
                              <div className="col-4">
                                <p className="bodyText fw-bold text-capitalize">
                                  {state?.informedTo}
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
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.prevBatchPhValue
                                ? state?.prevBatchPhValue
                                : "-"}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">TSS value</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.prevBatchTSSValue
                                ? `${state?.prevBatchTSSValue}%`
                                : "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Raw milk in time</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.rawMilkInTime}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Mixing tank in time</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.mixingTankInTime}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Mix start time</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.mixingStartTime}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Mix finish time</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.mixingFinishTime}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Feeding tank in time</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.feedTankInTime}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Feed start time</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.feedingStartTime}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Steam pressure</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.steamBars} MPa
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Pressure pump</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.pressurePumpValue} MPa
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Operator's name(s)</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <div className="bodyText fw-bold">
                            {<DataPill data={state.operators}/>}
                          </div>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Mix details</p>
                        </div>
                        <div className="col-1"/>
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.mixDetails ? state?.mixDetails : "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-end">
                      <p className="smallText text-white">
                        Added at {state?.timeStamp?.toDate().toLocaleString()}
                      </p>
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

      <Footer/>
      <BackToTop/>
    </>
  );
};

export default MixingDetails;
