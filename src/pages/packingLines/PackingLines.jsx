import { useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";

import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import Footer from "../../components/footer/Footer";

const PackingLines = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    // set input state
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // ...
  };

  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="col-md-12">
            <Breadcrumb title="Packing Lines" />
          </div>

          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="row mb-2 subFormWrapper">
                <div className="col-md subFormParent">
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Form.Group as={Col} md="6" controlId="date">
                        <Form.Label className="fw-bold">Batch code</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          className="customInput"
                          placeholder="Enter batch code (SD324073124)"
                          onChange={handleInputChange}
                        />
                      </Form.Group>

                      <div className="col">
                        <button
                          type="submit"
                          className="d-flex align-items-center justify-content-center mt-md-4 gap-2 subform-btn-submit customBtn"
                        >
                          {isLoading && (
                            <Spinner animation="border" size="sm" />
                          )}
                          {isLoading ? "Searching..." : "Search"}
                        </button>
                      </div>
                    </Row>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PackingLines;
