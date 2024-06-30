import { Link } from "react-router-dom";

const NavItem = ({ data }) => {
  return (
    <li className="nav-item">
      <Link to={data.path} className="nav-link collapsed">
        <i className={data.icon} />
        <span>{data.name}</span>
      </Link>
    </li>
  );
};

export default NavItem;
