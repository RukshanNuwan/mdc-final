import { Link } from 'react-router-dom';

import './breadcrumb.css';

const Breadcrumb = ({ title }) => {
  return (
    <nav className="p-2 mb-3 breadcrumb-container">
      <ol className="breadcrumb m-0">
        <li className="breadcrumb-item d-flex align-items-center">
          <Link to="/" className="bodyText text-white">
            <i className="bi bi-house-door" />
          </Link>
        </li>
        <li className="breadcrumb-item active bodyText text-white">{title}</li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
