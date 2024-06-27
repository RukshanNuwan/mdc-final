import { useEffect, useState } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Fab } from '@mui/material';

import './backToTop.css';

const BackToTop = () => {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScroll(window.scrollY);
    });

    return () => {
      window.removeEventListener('scroll', () => {
        setScroll(window.scrollY);
      });
    };
  }, [scroll]);

  const handleBackToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <Fab
      variant="circular"
      size="small"
      color="primary"
      className={`back-to-top ${scroll > 100 ? 'active' : undefined}`}
      onClick={handleBackToTop}
    >
      <KeyboardArrowUpIcon />
    </Fab>
  );
};

export default BackToTop;
