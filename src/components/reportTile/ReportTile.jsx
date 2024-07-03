import { Link } from "react-router-dom";

import "./reportTile.css";

const ReportTile = ({ title, link }) => {
  return (
    <Link to={link}>
      <div className="d-flex justify-content-center align-items-center tile-container">
        <p className="tile-title text-center">{title}</p>
      </div>
    </Link>
  );
};

export default ReportTile;
