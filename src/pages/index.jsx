import { Link } from "react-router-dom";

import "./common.css";
import Header from "../components/header/Header";
import SideBar from "../components/sideBar/SideBar";
import Footer from "../components/footer/Footer";

const Index = () => {
  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="d-flex justify-content-center align-items-center m-md-5">
          <div className="row mt-2 d-flex justify-content-center align-items-center">
            <div className="col-md d-flex align-items-center justify-content-center">
              <Link
                to="mdc"
                className="p-5 d-flex align-items-center justify-content-center touchable-card"
              >
                <p className="text-center">Spray Dryer 03</p>
              </Link>
            </div>

            <div className="col-md-1"></div>

            <div className="col-md d-flex align-items-center justify-content-center">
              <Link
                to="araliya_kele"
                className="p-5 d-flex align-items-center justify-content-center touchable-card"
              >
                <p className="text-center">Spray Dryer 04</p>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Index;
