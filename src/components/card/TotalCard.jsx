import '../dashboard/dashboard.css';

const TotalCard = ({ value_1, value_2, text }) => {
  const calculateTotalAmount = (value_1 = 0, value_2 = 0) => {
    return value_1 + value_2;
  };

  return (
    <div className="col mb-2 sectionContainer">
      <p className="sectionHeading">Total {text}</p>
      <p className="sectionMainValue">
        {value_1 || value_2 ? calculateTotalAmount(value_1, value_2) : '-'}kg
      </p>

      <div className="col-12 sectionDetailsContainer">
        <div className="sectionSubHeadingContainer d-flex justify-content-between mt-2">
          <p className="sectionSubHeading">SD 03 {text}</p>
          <p className="sectionSubValue fw-bold">
            {value_1 ? value_1 : '-'}kg
          </p>
        </div>

        <div className="sectionSubHeadingContainer d-flex justify-content-between">
          <p className="sectionSubHeading">Araliya kele {text}</p>
          <p className="sectionSubValue fw-bold">
            {value_2 ? value_2 : '-'}kg
          </p>
        </div>
      </div>
    </div>
  );
};

export default TotalCard;
