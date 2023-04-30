import './Header.scss'

import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link, Outlet } from 'react-router-dom';
import Values from '../../Values';

const Header = () => {

    return (
        <>
            <div className="header">
                <Link to={Values.homePageUrl} style={{ textDecoration: 'none' }}>
                    <div id="title-div">
                        <DashboardIcon sx={{ fontSize: 40 }} className='header-icon'/>
                        <p className='header-title'>Admin Dashboard</p>
                    </div>
                </Link>
            </div>

            <Outlet />
        </>
    );
}

export default Header;