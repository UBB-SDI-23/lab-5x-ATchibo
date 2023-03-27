import './Header.scss'

import DashboardIcon from '@mui/icons-material/Dashboard';

const Header = () => {

    return (
        <div className="header">
            <DashboardIcon sx={{ fontSize: 40 }} className='header-icon'/>
            <p className='header-title'>Admin Dashboard</p>
        </div>
    );
}

export default Header;