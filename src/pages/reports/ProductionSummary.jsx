import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Col, Form, Row, Spinner, Table } from "react-bootstrap";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

import BackToTop from "../../components/backToTop/BackToTop";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import SideBar from "../../components/sideBar/SideBar";
import { db } from "../../config/firebase.config";

const ProductionSummary = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [productionData, setProductionData] = useState([]);
  const [dailyProductionData, setDailyProductionData] = useState([]);
  const [expellerRecovery, setExpellerRecovery] = useState([]);
  const [sd3TotalPowderQuantity, setSd3TotalPowderQuantity] = useState([]);
  const [sd3PowderQuantityRecovery, setSd3PowderQuantityRecovery] = useState(
    []
  );
  const [sd4TotalPowderQuantity, setSd4TotalPowderQuantity] = useState([]);
  const [sd4PowderQuantityRecovery, setSd4PowderQuantityRecovery] = useState(
    []
  );

  const fetchProductionDataByDateRange = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "production_data"),
        where("date", ">=", startDate),
        where("date", "<=", endDate),
        orderBy("wet_added_at", "desc")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) list.push({ id: doc.id, ...doc.data() });
      });

      setProductionData(list);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDailyProductionDataByDateRange = async () => {
    try {
      const list = [];
      const q = query(
        collection(db, "daily_production"),
        where("date", ">=", startDate),
        where("date", "<=", endDate),
        orderBy("timeStamp", "asc")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data()) list.push({ id: doc.id, ...doc.data() });
      });
      setDailyProductionData(list);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (startDate && endDate) {
      fetchProductionDataByDateRange().then(() => setIsLoading(false));
      fetchDailyProductionDataByDateRange().then(() => setIsLoading(false));
    }
    if (!startDate && !endDate) setIsLoading(false);
  };

  useEffect(() => {
    if (productionData.length > 0 && dailyProductionData.length > 0) {
      const calculate = () => {
        const productionDataMap = new Map();
        const sd3PowderQuantityMap = new Map();
        const sd4PowderQuantityMap = new Map();
        let avgExpellerRecovery = 0;

        dailyProductionData.forEach((data) => {
          let index = 0;
          let expellerRecoverySum = 0;
          let sd3PowderQuantity = 0;
          let sd3PowderQuantityRecovery = 0;
          let sd4PowderQuantity = 0;
          let sd4PowderQuantityRecovery = 0;

          productionData.forEach((item) => {
            if (data.date === item.date) {
              index++;
              expellerRecoverySum += Number(item.mixing_milk_recovery);

              if (item.location === "mdc") {
                sd3PowderQuantity += Number(item.sd_total_powder_quantity);
                // sd3PowderQuantityRecovery += Number(item.sd_powder_recovery);
              } else {
                sd4PowderQuantity += Number(item.sd_total_powder_quantity);
                // sd4PowderQuantityRecovery += Number(item.sd_powder_recovery);
              }
            }
          });

          avgExpellerRecovery = expellerRecoverySum / index;
          productionDataMap.set(data.date, avgExpellerRecovery);
          sd3PowderQuantityMap.set(data.date, sd3PowderQuantity);
          sd4PowderQuantityMap.set(data.date, sd4PowderQuantity);
        });

        const expellerRecoveryArr = dailyProductionData.map((item) => {
          return productionDataMap.get(item.date) || null;
        });

        const sd3PowderQuantityArr = dailyProductionData.map((item) => {
          return sd3PowderQuantityMap.get(item.date) || null;
        });

        const sd4PowderQuantityArr = dailyProductionData.map((item) => {
          return sd4PowderQuantityMap.get(item.date) || null;
        });

        setExpellerRecovery(expellerRecoveryArr);
        setSd3TotalPowderQuantity(sd3PowderQuantityArr);
        setSd4TotalPowderQuantity(sd4PowderQuantityArr);
      };

      calculate();
    }
  }, [dailyProductionData, productionData]);

  return (
    <>
      <Header />
      <SideBar />

      <main id="main" className="main">
        <div className="container-fluid py-md-2 ps-xs-0 pe-xs-0">
          <div className="pe-0 px-xs-0">
            <div className="card border-0">
              <div className="mb-2">
                <Link
                  to="/reports"
                  className="d-flex align-items-center customBackBtn"
                >
                  <ArrowBackIosIcon fontSize="small" /> Back
                </Link>
              </div>

              <div className="card-body formWrapper">
                <p className="display-6 mb-4 text-white">Production summary</p>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="startDate"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">Start date</Form.Label>
                      <Form.Control
                        type="date"
                        className="customInput"
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="endDate"
                      className="mb-2"
                    >
                      <Form.Label className="fw-bold">End date</Form.Label>
                      <Form.Control
                        type="date"
                        className="customInput"
                        onChange={(e) => setEndDate(e.target.value)}
                      ></Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} className="d-flex align-items-end">
                      <button type="submit" className="btn-submit customBtn">
                        {isLoading ? (
                          <div className="d-flex align-items-center gap-2">
                            <Spinner animation="border" size="sm" />
                            <p>Generating...</p>
                          </div>
                        ) : (
                          "Generate"
                        )}
                      </button>
                    </Form.Group>
                  </Row>
                </Form>

                <hr className="custom-hr-yellow" />

                <div className="report-container">
                  <div className="table-container">
                    {productionData.length > 0 ? (
                      <div className="container">
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th></th>
                              {dailyProductionData?.map((item, index) => (
                                <th key={index}>{item.date}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th>Cut nuts</th>
                              {dailyProductionData?.map((item, index) => (
                                <td key={index}>{item.totalCoconut}</td>
                              ))}
                            </tr>
                            <tr>
                              <th>Kernel weight</th>
                              {dailyProductionData?.map((item, index) => (
                                <td key={index}>{item.totalKernelWeight}kg</td>
                              ))}
                            </tr>
                            <tr>
                              <th>Outside kernel weight</th>
                              {dailyProductionData?.map((item, index) => (
                                <td key={index}>
                                  {item.outsideKernelQuantity}kg
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <th>Kernel recovery</th>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <th>Expeller recovery</th>
                              {expellerRecovery?.map((item, index) => (
                                <td key={index}>{item.toFixed(2)}%</td>
                              ))}
                            </tr>
                            <tr>
                              <th>SD 03 Powder quantity</th>
                              {sd3TotalPowderQuantity?.map((item, index) => (
                                <td key={index}>{item}kg</td>
                              ))}
                            </tr>
                            <tr>
                              <th>SD 03 Recovery</th>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <th>SD 04 Powder quantity</th>
                              {sd4TotalPowderQuantity?.map((item, index) => (
                                <td key={index}>{item}kg</td>
                              ))}
                            </tr>
                            <tr>
                              <th>SD 04 Recovery</th>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-center">No data found</p>
                    )}
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

export default ProductionSummary;
