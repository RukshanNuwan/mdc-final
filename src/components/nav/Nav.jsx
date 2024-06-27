import "./nav.css";
import NavAvatar from "./NavAvatar";

const Nav = () => {
  return (
    <nav className="header-nav ms-auto">
      <ul className="d-flex align-items-center gap-3 navAvatarParent">
        <NavAvatar />
      </ul>
    </nav>
  );
};

export default Nav;
