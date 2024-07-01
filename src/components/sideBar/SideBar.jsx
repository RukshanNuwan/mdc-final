import { Link } from "react-router-dom";

import "./sideBar.css";
import { firstNavList, secondNavList } from "../../data/navItem";
import NavItem from "../nav/NavItem";

const SideBar = () => {
  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            <i className="bi bi-grid"></i>
            <span>Home</span>
          </Link>
        </li>

        <li className="nav-heading">Operations</li>
        {firstNavList.map((nav, index) => (
          <NavItem data={nav} key={index} />
        ))}

        <li className="nav-heading">Other</li>
        {secondNavList.map((nav, index) => (
          <NavItem data={nav} key={index} />
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
