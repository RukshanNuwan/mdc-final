import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { doc, getDoc } from "firebase/firestore";

import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";
import BackToTop from "../../components/backToTop/BackToTop";
import { db } from "../../config/firebase.config";

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
      const docRef = doc(
        db,
        "production_data",
        packingLineData?.production_batch_id
      );

      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) setProductionData(docSnap.data());
      } catch (error) {
        console.log(error);
      }
    };

    fetchProductionDataById();
  }, [packingLineData?.production_batch_id]);

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

                    <div className="mt-4 text-white">content</div>
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
