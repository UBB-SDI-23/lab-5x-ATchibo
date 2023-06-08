import './Header.scss'

import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Values from '../../Values';
import { useContext, useEffect, useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import LocalStorageManager from '../../helpers/LocalStorageManager';
import UserDTO from '../../domain/User/UserDTO';
import UserRequests from '../../api/UserRequests';
import { UserContext } from '../../helpers/UserContext';

const Header = () => {

    const { user, setUser } = useContext(UserContext) || new UserDTO();
    
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

    const fetchUser = async () => {
        if (LocalStorageManager.getAuthToken() === "") 
            return;

        await UserRequests.getCurrentUser()
            .then((response) => {
                console.log(response);
                setUser(new UserDTO(response.data));
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchUser();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                        {
                            user?.getRole() !== "ROLE_GUEST" &&
                            <MenuItem onClick={goToProfile}>Profile</MenuItem>
                        }
                        <MenuItem id="logout" onClick={logout}>{user?.getRole() === "ROLE_GUEST" ? "Log in" : "Logout"}</MenuItem>
                    </Menu>
                </div>
            </div>

            <Outlet />
        </>
    );
}

export default Header;