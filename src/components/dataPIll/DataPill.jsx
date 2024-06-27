import { Badge } from 'react-bootstrap';

import './dataPill.css';

const DataPill = ({ data }) => {
  return (
    <div className="d-flex flex-wrap gap-1">
      {data?.map((item, index) => (
        <Badge pill className="data-pill text-capitalize p-md-2" key={index}>
          {item}
        </Badge>
      ))}
    </div>
  );
};

export default DataPill;
