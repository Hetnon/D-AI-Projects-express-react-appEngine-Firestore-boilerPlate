import React, { useState, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './PageHeader.module.css';

import { logoff} from '../../ServerCalls/userRelatedServerCalls.js';
// import {SocketContext} from 'Contexts/SocketContext.js';
import {MasterContext} from 'Contexts/MasterContext.js';

import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem'; 
import Typography from '@mui/material/Typography';

export default function PageHeader({setActiveView, pageHeaderHeight}) { 
    const {user, setUser} = useContext(MasterContext);
    const avatarRef = useRef(null);
    // const {socketShouldReconnect} = useContext(SocketContext);
    const [anchorElUser, setAnchorElUser] = useState(null);
    
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
        avatarRef.current?.focus(); // restore focus manually
    };


    const regularUserSettings = {
        Logout: {label: 'Logout', handler: handleLogout},
    };
    const masterAdminSettings = {
       ...regularUserSettings,
        OpenUserAdminPanel: {label: 'Users Admin Panel', handler: handleOpenUserAdminPanel},
    };
    const settings = user.userType === 'master-admin' ? masterAdminSettings : regularUserSettings;
  
    async function handleLogout(){
        try{
            // socketShouldReconnect.current = false;
            await logoff();
            localStorage.removeItem('user');
            setUser({});
            setActiveView('workArea');
        } catch(error){
            console.error("Error during logoff", error);
        }
    }

    function handleOpenUserAdminPanel(){
        setActiveView('admin');
    }

    return(
        <div className={styles.pageHeader} style={{height: `${pageHeaderHeight}px`}}>
            <div className={styles.pageHeaderTitle}>{`Hey ${user.firstName}!`}</div>
            <Tooltip title={user.userEmail} placement="bottom">
                <Avatar
                    ref={avatarRef}
                    tabIndex={0}
                    alt={user.userEmail} 
                    src={user.profilePic} 
                    className={styles.avatar}  
                    style={{width: '40px', height: '40px'}}
                    onClick={handleOpenUserMenu}
                />
            </Tooltip>
            <Menu
                sx={{mt: '35px'}}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                {Object.keys(settings).map((setting) => (
                    <MenuItem key={setting} onClick={() => {handleCloseUserMenu();  settings[setting].handler()}} sx={{height: 35}} >
                        <Typography textAlign="center" sx={{fontSize: 16}}>{settings[setting].label}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </div>
    )
}

PageHeader.propTypes = {
    setActiveView: PropTypes.func.isRequired,
    pageHeaderHeight: PropTypes.number.isRequired
};

