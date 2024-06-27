import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';

import { auth } from '../../config/firebase.config';

const NavAvatar = () => {
  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.replace('/login');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <li className="nav-item dropdown pe-3">
      <Link
        to="#"
        className="nav-link nav-profile d-flex align-items-center pe-0"
        data-bs-toggle="dropdown"
      >
        {loggedInUser && (
          <img
            src={loggedInUser?.photoURL}
            alt="profile"
            className="rounded-circle"
          />
        )}
        <span className="d-none d-md-block dropdown-toggle ps-2">
          {loggedInUser?.displayName.split(' ')[0]}
        </span>
      </Link>

      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
        <li className="dropdown-header d-flex flex-column align-items-baseline">
          <h6>{loggedInUser?.displayName}</h6>
          <span>{loggedInUser?.email}</span>
        </li>

        <li>
          <button
            className="dropdown-item d-flex align-items-center"
            onClick={handleLogOut}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </li>
  );
};

export default NavAvatar;
