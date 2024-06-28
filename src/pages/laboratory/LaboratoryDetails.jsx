import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import LoopIcon from "@mui/icons-material/Loop";

import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";
import { db } from "../../config/firebase.config";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";

const LaboratoryDetails = () => {
  const [data, setData] = useState();

  const { id, location } = useParams();

  // TODO: Remove this & get data from state
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const docRef = doc(db, "lab_section", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data());
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDocument().then((r) => {});
  }, [id]);

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
                          <p className="bodyText fw-bold">{data?.date}</p>
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
                            {data?.batchNumber}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Expected powder quantity</p>
                        </div>
                        <div className="col-5">
                          <p className="bodyText fw-bold">
                            {data?.expectedPowderQuantity}kg
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Status</p>
                        </div>
                        <div className="col-5">
                          <p className="bodyText fw-bold">
                            {data?.status === "completed" ? (
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
                            {data?.recipeName}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Recipe type</p>
                        </div>
                        <div className="col-5">
                          <p className="bodyText fw-bold text-capitalize">
                            {data?.recipeType}
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
                            {data?.sampleInTime}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Test start time</p>
                        </div>
                        <div className="col-5">
                          <p className="bodyText fw-bold text-capitalize">
                            {data?.testStartTime}
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
                            {data?.rawMilkPh}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">TSS</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {data?.rawMilkTSS}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Fat</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {data?.rawMilkFat}
                          </p>
                        </div>
                      </div>

                      <div className="col-12 d-flex justify-content-evenly mt-4">
                        <div className="text-center">
                          <p className="subSectionKey bodyText">Taste</p>
                          <p className="subSectionValue bodyText">
                            {data?.rawMilkTaste === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Color</p>
                          <p className="subSectionValue bodyText">
                            {data?.rawMilkColor === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Odor</p>
                          <p className="subSectionValue bodyText">
                            {data?.rawMilkOdor === true ? (
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
                            {data?.mixMilkPh}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">TSS</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {data?.mixMilkTSS}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Fat</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {data?.mixMilkFat}
                          </p>
                        </div>
                      </div>

                      <div className="col-12 d-flex justify-content-evenly mt-4">
                        <div className="text-center">
                          <p className="subSectionKey bodyText">Taste</p>
                          <p className="subSectionValue bodyText">
                            {data?.mixMilkTaste === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Color</p>
                          <p className="subSectionValue bodyText">
                            {data?.mixMilkColor === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Odor</p>
                          <p className="subSectionValue bodyText">
                            {data?.mixMilkOdor === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {data?.isMixHaveIssue && (
                      <div className="dataItemWrapper">
                        <>
                          <div className="row py-1">
                            <div className="col-7">
                              <p className="bodyText">Informed to</p>
                            </div>
                            <div className="col-5">
                              <p className="bodyText fw-bold text-capitalize">
                                {data?.informedToAboutMix}
                              </p>
                            </div>
                          </div>

                          <div className="row py-1">
                            <div className="col-7">
                              <p className="bodyText">Issue details</p>
                            </div>
                            <div className="col-5">
                              <p className="bodyText fw-bold text-danger">
                                {data?.remarkAboutMixIssue}
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
                            {data?.milkPowderFat}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Moisture</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {data?.milkPowderMoisture}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Bulk density</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {data?.bulkDensity}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Fat layer</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {data?.milkPowderFatLayer}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Time</p>
                          <p className="subSectionValue bodyText fw-bold">
                            {data?.milkPowderTime}
                          </p>
                        </div>
                      </div>

                      <div className="col-12 d-flex justify-content-evenly mt-4">
                        <div className="text-center">
                          <p className="subSectionKey bodyText">Taste</p>
                          <p className="subSectionValue bodyText">
                            {data?.powderTaste === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Color</p>
                          <p className="subSectionValue bodyText">
                            {data?.powderColor === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Odor</p>
                          <p className="subSectionValue bodyText">
                            {data?.powderOdor === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Solubility</p>
                          <p className="subSectionValue bodyText">
                            {data?.powderSolubility === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="subSectionKey bodyText">Free flowing</p>
                          <p className="subSectionValue bodyText">
                            {data?.powderFreeFlowing === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <CloseIcon className="text-danger" />
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {data?.isPowderHaveIssue && (
                      <div className="dataItemWrapper">
                        <div className="row py-1">
                          <div className="col-7">
                            <p className="bodyText">Informed to</p>
                          </div>
                          <div className="col-5">
                            <p className="bodyText fw-bold text-capitalize">
                              {data?.informedToAboutPowder}
                            </p>
                          </div>
                        </div>

                        <div className="row py-1">
                          <div className="col-7">
                            <p className="bodyText">Remarks</p>
                          </div>

                          <div className="col-5">
                            <p className="bodyText fw-bold text-capitalize">
                              {data?.remarks ? data?.remarks : "---"}
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
                            {data?.laboratoryTechnician}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-end">
                      <p className="smallText">
                        Added at {data?.timeStamp?.toDate().toLocaleString()}
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
