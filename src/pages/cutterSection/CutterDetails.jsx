import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import LoopIcon from '@mui/icons-material/Loop';
import { doc, getDoc } from 'firebase/firestore';

import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import Header from '../../components/header/Header';
import SideBar from '../../components/sideBar/SideBar';
import Footer from '../../components/footer/Footer';
import BackToTop from '../../components/backToTop/BackToTop';
import { db } from '../../config/firebase.config';

const CutterDetails = () => {
  const [data, setData] = useState();

  const { id } = useParams();

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const docRef = doc(db, 'cutter_section', id);
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

  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="col-md-12">
            <Breadcrumb title="Cutter Section" />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="col-md-12 d-flex justify-content-between mb-2">
                <Link
                  to="/cutter-section"
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
                          <p className="bodyText">Location</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {data?.location === 'mdc' ? 'MDC' : 'Araliya Kele'}
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
                            {data?.status === 'completed' ? (
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
                          <p className="bodyText">Blancher start time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {data?.blancherStartTime}
                          </p>
                        </div>
                      </div>

                      {/* <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Cutter start time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {data?.cutterStartTime}
                          </p>
                        </div>
                      </div> */}

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Cutter finish time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {data?.cutterFinishTime}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Expeller start time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {data?.expellerStartTime}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Expeller finish time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {data?.expellerFinishTime}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Process time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {`${
                              data?.expellerProcessTime?.hours
                                ? data?.expellerProcessTime?.hours
                                : '-'
                            }hr ${
                              data?.expellerProcessTime?.minutes
                                ? data?.expellerProcessTime?.minutes
                                : '-'
                            }min`}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Delay time</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold text-danger">
                            {data?.expellerDelayTime}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dataItemWrapper">
                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Heat valve</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold">
                            {data?.heatValve === true ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <div>
                                <CloseIcon className="text-danger" />
                              </div>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Special notes</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold text-capitalize">
                            {data?.specialNotes ? data?.specialNotes : '---'}
                          </p>
                        </div>
                      </div>

                      <div className="row py-1">
                        <div className="col-7">
                          <p className="bodyText">Operator's name</p>
                        </div>
                        <div className="col-1" />
                        <div className="col-4">
                          <p className="bodyText fw-bold text-capitalize">
                            {data?.operator}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* <div className="mt-4 text-end">
                      <p className="smallText">
                        Added at {data?.timeStamp?.toDate().toLocaleString()}
                      </p>
                      <p className="smallText">
                        by {data?.addedBy?.displayName}
                      </p>
                    </div> */}
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

export default CutterDetails;
