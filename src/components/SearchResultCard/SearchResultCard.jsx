import { Link } from "react-router-dom";

const SearchResultCard = ({ data }) => {
  return (
    <div className="card p-3 rounded bg-dark-blue-2">
      <Link to={`${data?.id}`} className="d-flex flex-wrap gap-3">
        <div
          className="p-2 d-flex justify-content-center align-items-center border"
          style={{ width: "60px", height: "60px", borderRadius: "50%" }}
        >
          <div className="fw-bold text-pink" style={{ fontSize: "1.2rem" }}>
            {data?.packing_job_sheet_number}
          </div>
        </div>

        <div className="d-flex flex-wrap gap-4">
          <div className="d-flex flex-column justify-content-center">
            <div className="text-white">SD batch code</div>
            <div className="text-light-blue">{data?.production_batch_code}</div>
          </div>

          <div className="d-flex flex-column justify-content-center">
            <div className="text-white">Production date</div>
            <div className="text-yellow">{data?.packing_production_date}</div>
          </div>

          <div className="d-flex flex-column justify-content-center">
            <div className="text-white">
              {data?.packing_type === "packing_type_20"
                ? "Craft bag"
                : "Carton"}{" "}
              number
            </div>
            <div className="text-yellow carton-number-section">
              {data?.packing_type === "packing_type_20"
                ? data?.packing_craft_bag_number.join(", ")
                : data?.packing_carton_box_number.split(",").join(", ")}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SearchResultCard;
