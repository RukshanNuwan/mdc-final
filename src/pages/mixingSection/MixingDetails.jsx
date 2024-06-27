import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";
import { db } from "../../config/firebase.config";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import DataPill from "../../components/dataPIll/DataPill";

const MixingDetails = () => {
  const [data, setData] = useState();
  const [operators, setOperators] = useState();

  const { id, location } = useParams();

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const docRef = doc(db, "mixing_section", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data());
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDocument();
  }, [id]);

  useEffect(() => {
    const getOperatorNames = async () => {
      try {
        const q = query(
          collection(db, "mixing_section"),
          where("location", "==", location),
          where("date", "==", data?.date),
          where("batchNumber", "==", data?.batchNumber)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setOperators(doc.data().operators);
        });
      } catch (error) {
        console.log(error);
      }
    };

    getOperatorNames();
  }, [location, data]);

  console.log(data);

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
              } / Mixing Section`}
            />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="col-md-12 d-flex justify-content-between mb-2">
                <Link
                  to={`/mixing-section/${location}`}
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
                          <p className="bodyText fw-bold">{data?.date}</p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Batch number (Wet)</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {data?.wet_batch_number}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Batch number</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {data?.batchNumber}
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
                            {data?.recipeName}
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
                            {data?.recipeType === "organic"
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
                            {data?.milkQuantity}kg
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
                              data?.milkRecovery < "75"
                                ? "text-danger"
                                : "text-success"
                            }`}
                          >
                            {data?.milkRecovery}%
                          </p>
                        </div>
                      </div>

                      {data?.additionalCratesCount !== 0 && (
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
                                {data?.additionalCratesCount}
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
                                {data?.informedTo}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="dataItemWrapper">
                      <span className="sectionTitle sectionTitleBlue text-uppercase">
                        Previous batch raw milk details
                      </span>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">pH value</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {data?.prevBatchPhValue
                              ? data?.prevBatchPhValue
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
                            {data?.prevBatchTSSValue
                              ? `${data?.prevBatchTSSValue}%`
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
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {data?.rawMilkInTime}
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
                            {data?.mixingTankInTime}
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
                            {data?.mixingStartTime}
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
                            {data?.mixingFinishTime}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Feed tank in time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {data?.feedTankInTime}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Feeding start time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {data?.feedingStartTime}
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
                            {data?.steamBars} MPa
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
                            {data?.pressurePumpValue} MPa
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
                            {<DataPill data={operators} />}
                          </div>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Mix details</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {data?.mixDetails ? data?.mixDetails : "---"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-end">
                      <p className="smallText">
                        Added at {data?.timeStamp?.toDate().toLocaleString()}
                      </p>
                      <p className="smallText text-capitalize">
                        by {data?.addedBy?.displayName}
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

export default MixingDetails;
