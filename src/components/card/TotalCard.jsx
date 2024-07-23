import "../dashboard/dashboard.css";

const TotalCard = ({ value_1, value_2, text }) => {
  const calculateTotalAmount = (value_1 = 0, value_2 = 0) => {
    // console.log("1", value_1);
    // console.log("2", value_2);
    
    if (isNaN(value_1)) return value_2;
    if (isNaN(value_2)) return value_1;

    // console.log(value_1 + value_2);
    return value_1 + value_2;

  };

  return (
    <div className="col mb-2 sectionContainer">
      <p className="sectionHeading text-white">Total {text}</p>
      <p className="sectionMainValue text-center mt-3">
        {value_1 || value_2 ? calculateTotalAmount(value_1, value_2) : 0}Kg
      </p>

      <div className="col-12 mt-4 sectionDetailsContainer">
        <div className="sectionSubHeadingContainer d-flex justify-content-between mt-2">
          <p className="sectionSubHeading">SD 03 {text}</p>
          <p className="sectionSubValue fw-bold">{value_1 ? value_1 : 0}Kg</p>
        </div>

        <div className="sectionSubHeadingContainer d-flex justify-content-between">
          <p className="sectionSubHeading">SD 04 {text}</p>
          <p className="sectionSubValue fw-bold">{value_2 ? value_2 : 0}Kg</p>
        </div>
      </div>
    </div>
  );
};

export default TotalCard;
