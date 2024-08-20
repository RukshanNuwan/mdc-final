import { Link } from "react-router-dom";

const NavItem = ({ data }) => {
  return (
    <li className="nav-item">
      <Link to={data.path} className="nav-link collapsed">
        <img
          src={data.icon}
          alt={data.name}
          width={20}
          height={20}
          className="me-2"
        />
        <span>{data.name}</span>
      </Link>
    </li>
  );
};

export default NavItem;
