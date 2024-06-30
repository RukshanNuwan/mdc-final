import { Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import './logo.css';

const Logo = () => {
  const handleToggleSideBar = () => {
    document.body.classList.toggle('toggle-sidebar');
  };

  return (
    <Box>
      <button onClick={handleToggleSideBar} className="sidebarToggle">
        <MenuIcon />
      </button>
    </Box>
  );
};

export default Logo;
