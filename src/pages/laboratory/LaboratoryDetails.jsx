import { Link, useLocation, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import LoopIcon from "@mui/icons-material/Loop";

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
              title={`${
                location === "mdc" ? "MDC" : "Araliya Kele"
              } / Laboratory`}
            />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="col-md-12 d-flex justify-content-between mb-2">
                <Link
                  to={`/lab-section/${location}`}
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
                        <div className="col-5">
                          <p className="bodyText fw-bold">{state?.date}</p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Batch number</p>
                        </div>
                        <div className="col-5">
                          <p className="bodyText fw-bold">
                            {state?.batchNumber}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Expected powder quantity</p>
                        </div>
                        <div className="col-5">
                          <p className="bodyText fw-bold">
                            {state?.expectedPowderQuantity}kg
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Status</p>
                        </div>
                        <div className="col-5">
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
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Recipe name</p>
                        </div>
                        <div className="col-5">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.recipeName}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Recipe type</p>
                        </div>
                        <div className="col-5">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.recipeType}
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
                            {state?.sampleInTime}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Test start time</p>
                        </div>
                        <div className="col-5">
                          <p className="bodyText fw-bold text-capitalize">
                            {state?.testStartTime}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <span className="sectionTitle sectionTitleBlue text-uppercase">
                        Raw milk
                      </span>

                      <div className="col-12 d-flex justify-content-evenly mt-2">
                        <div className="text-center">
                          <p className="subSectionKey bodyText">pH</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.rawMilkPh}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">TSS</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.rawMilkTSS}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Fat</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.rawMilkFat}
                          </p>
                        </div>
                      </div>

                      <div className="col-12 d-flex justify-content-evenly mt-4">
                        <div className="text-center">
                          <p className="subSectionKey bodyText">Taste</p>
                          <p className="subSectionValue bodyText">
                            {state?.rawMilkTaste === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Color</p>
                          <p className="subSectionValue bodyText">
                            {state?.rawMilkColor === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Odor</p>
                          <p className="subSectionValue bodyText">
                            {state?.rawMilkOdor === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <span className="sectionTitle sectionTitleBlue text-uppercase">
                        Mix milk
                      </span>

                      <div className="col-12 d-flex justify-content-evenly mt-2">
                        <div className="text-center">
                          <p className="subSectionKey bodyText">pH</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.mixMilkPh}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">TSS</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.mixMilkTSS}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Fat</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.mixMilkFat}
                          </p>
                        </div>
                      </div>

                      <div className="col-12 d-flex justify-content-evenly mt-4">
                        <div className="text-center">
                          <p className="subSectionKey bodyText">Taste</p>
                          <p className="subSectionValue bodyText">
                            {state?.mixMilkTaste === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Color</p>
                          <p className="subSectionValue bodyText">
                            {state?.mixMilkColor === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Odor</p>
                          <p className="subSectionValue bodyText">
                            {state?.mixMilkOdor === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {state?.isMixHaveIssue && (
                      <div className="dataItemWrapper">
                        <>
                          <div className="row py-1">
                            <div className="col-7">
                              <p className="bodyText">Informed to</p>
                            </div>
                            <div className="col-5">
                              <p className="bodyText fw-bold text-capitalize">
                                {state?.informedToAboutMix}
                              </p>
                            </div>
                          </div>

                          <div className="row py-1">
                            <div className="col-7">
                              <p className="bodyText">Issue details</p>
                            </div>
                            <div className="col-5">
                              <p className="bodyText fw-bold text-danger">
                                {state?.remarkAboutMixIssue}
                              </p>
                            </div>
                          </div>
                        </>
                      </div>
                    )}

                    <div className="dataItemWrapper">
                      <span className="sectionTitle sectionTitleBlue text-uppercase">
                        Milk powder
                      </span>

                      <div className="col-12 d-flex justify-content-evenly mt-2">
                        <div className="text-center">
                          <p className="subSectionKey bodyText">Fat</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.milkPowderFat}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Moisture</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.milkPowderMoisture}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Bulk density</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.bulkDensity}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Fat layer</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.milkPowderFatLayer}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Time</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {state?.milkPowderTime}
                          </p>
                        </div>
                      </div>

                      <div className="col-12 d-flex justify-content-evenly mt-4">
                        <div className="text-center">
                          <p className="subSectionKey bodyText">Taste</p>
                          <p className="subSectionValue bodyText">
                            {state?.powderTaste === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Color</p>
                          <p className="subSectionValue bodyText">
                            {state?.powderColor === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Odor</p>
                          <p className="subSectionValue bodyText">
                            {state?.powderOdor === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Solubility</p>
                          <p className="subSectionValue bodyText">
                            {state?.powderSolubility === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Free flowing</p>
                          <p className="subSectionValue bodyText">
                            {state?.powderFreeFlowing === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {state?.isPowderHaveIssue && (
                      <div className="dataItemWrapper">
                        <div className="row py-1">
                          <div className="col-7">
                            <p className="bodyText">Informed to</p>
                          </div>
                          <div className="col-5">
                            <p className="bodyText fw-bold text-capitalize">
                              {state?.informedToAboutPowder}
                            </p>
                          </div>
                        </div>

                        <div className="row py-1">
                          <div className="col-7">
                            <p className="bodyText">Remarks</p>
                          </div>

                          <div className="col-5">
                            <p className="bodyText fw-bold text-capitalize">
                              {state?.remarks ? state?.remarks : "---"}
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
                            {state?.laboratoryTechnician}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-end">
                      <p className="smallText">
                        Added at {state?.timeStamp?.toDate().toLocaleString()}
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
