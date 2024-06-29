import './header.css';
import Logo from '../logo/Logo';
import Nav from '../nav/Nav';

const Header = () => {
  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      <Logo />
      {/*<Nav />*/}
    </header>
  );
};

export default Header;
