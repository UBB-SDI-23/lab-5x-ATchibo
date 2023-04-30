import './Header.scss';

import DashboardIcon from '@mui/icons-material/Dashboard';

export const LoginHeader = () => {

    return (
        <div className="header">
            <div id="title-div">
                <DashboardIcon sx={{ fontSize: 40 }} className='header-icon'/>
                <p className='header-title'>Tchibo Dealerships Dashboard</p>
            </div>
        </div>
    );
}