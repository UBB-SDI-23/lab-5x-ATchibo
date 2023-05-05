import './Header.scss'

import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Values from '../../Values';
import { useContext, useState } from 'react';
import { UserContext } from '../../helpers/UserContext';
import { Button, Menu, MenuItem } from '@mui/material';
import LocalStorageManager from '../../helpers/LocalStorageManager';
import UserDTO from '../../domain/User/UserDTO';

const Header = () => {

    const { user } = useContext(UserContext) || new UserDTO();

    const navigate = useNavigate();

    const userRole = user?.getRole().split('_')[1] || "App";
    const username = user?.getUsername() || "User";


    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const goToProfile = () => {
        handleClose();
        navigate(Values.usersPageUrl + "/" + username);
    }

    const logout = () => {
        handleClose();
        LocalStorageManager.performLogoutCleaning();
        navigate(Values.loginPageUrl);
    }

    return (
        <>
            <div className="header">
                <Link to={Values.homePageUrl} style={{ textDecoration: 'none' }}>
                    <div id="title-div">
                        <DashboardIcon sx={{ fontSize: 40 }} className='header-icon'/>
                        <p className='header-title'>{userRole} Dashboard</p>
                    </div>
                </Link>

                <div id="user-menu-div">
                    <Button
                        id="basic-button"
                        style={{ color: 'white' }}
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        Logged in as {username}
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={goToProfile}>Profile</MenuItem>
                        <MenuItem onClick={logout}>{user?.getRole() === "ROLE_GUEST" ? "Log in" : "Logout"}</MenuItem>
                    </Menu>
                </div>
            </div>

            <Outlet />
        </>
    );
}

export default Header;