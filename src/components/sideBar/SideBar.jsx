import { Link } from "react-router-dom";

import "./sideBar.css";
import {
  otherNavList,
  packingLinesNavList,
  productionNavList,
} from "../../data/navItem";
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

        <li className="nav-heading">Productions</li>
        {productionNavList.map((nav, index) => (
          <NavItem data={nav} key={index} />
        ))}

        <li className="nav-heading">Packing Lines</li>
        {packingLinesNavList.map((nav, index) => (
          <NavItem data={nav} key={index} />
        ))}

        <li className="nav-heading">Reports</li>
        {otherNavList.map((nav, index) => (
          <NavItem data={nav} key={index} />
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
