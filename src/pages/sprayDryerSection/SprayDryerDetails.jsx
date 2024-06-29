import { Link, useLocation, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import LoopIcon from "@mui/icons-material/Loop";

import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import DataPill from "../../components/dataPIll/DataPill";

const SprayDryerDetails = () => {
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
              } / Spray Dryer Section`}
            />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="col-md-12 d-flex justify-content-between mb-2">
                <Link
                  to={`/sd-section/${location}`}
                  className="d-flex align-items-center customClearBtn"
                >
                  <ArrowBackIosIcon fontSize="small" /> Back
                </Link>
              </div>

              <div className="card-body formWrapper">
                <div className="row">
                  <div className="col d-xs-none"></div>

                  <div className="col-md-6">
                    <p className="display-6 mb-2">Batch details</p>

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
                          <p className="bodyText">Batch number</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.batchNumber}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Status</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.status === "completed" ? (
                              <PublishedWithChangesIcon className="text-success" />
                            ) : (
                              <div>
                                <LoopIcon className="text-primary" />
                              </div>
                            )}
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
                            {state?.recipeType === "organic"
                              ? "Organic"
                              : "Conventional"}
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
                            {state?.recipeName}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Powder spray start time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.powderSprayStartTime}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Powder spray finish time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.powderSprayStartTime
                              ? state?.powderSprayStartTime
                              : "Not finish yet"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Powder quantity</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.powderQuantity} kg
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Expected powder quantity</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.expectedPowderQuantity} kg
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">RP</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.rp ? `${state?.rp}kg` : "-"}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Powder recovery</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.powderRecovery} %
                          </p>
                        </div>
                      </div>

                      {/* <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Powder quality</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.quality === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>
                      </div> */}
                    </div>

                    {/* <div className="dataItemWrapper"> */}
                    {/* 
                      TODO: show data by bag wise
                            - .map(new component ekak hadanna)
                       */}
                    {/* </div> */}

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Atomizer size</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.atomizerSize} mm
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Inlet temperature</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.inletTemp} &deg;C
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Outlet temperature</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.outletTemp} &deg;C
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
                          <p className="bodyText fw-bold">
                            {<DataPill data={state.operators} />}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Other details</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.otherDetails ? state?.otherDetails : "-"}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Special notes</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {state?.specialNotes ? state?.specialNotes : "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-end">
                      <p className="smallText">
                        Added at {state?.timeStamp?.toDate().toLocaleString()}
                      </p>
                      {/* <p className="smallText text-capitalize">
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

export default SprayDryerDetails;
