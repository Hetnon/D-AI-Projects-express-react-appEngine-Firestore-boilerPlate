import React from 'react';

import styles from './Icon.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestorePageOutlinedIcon from '@mui/icons-material/RestorePageOutlined';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

export default function Icon({originalIcon, size, onClick, tooltipPlacement="right", tooltipMessage=''}){ 
    const switchIcon = (icon) => {
        const style = {
            width: `${size-4}px`,
            height: `${size-4}px`
        }

        switch(icon){
            case 'deleteUser':
            case 'deleteProvider':
                return <DeleteIcon onClick={onClick} className={styles.icon} style={style}/>
            case 'restorePageOutlined':
                return <RestorePageOutlinedIcon onClick={onClick} className={styles.icon} style={style}/>
            case 'editProvider':
                return <EditIcon onClick={onClick} className={styles.icon} style={style}/>
            case 'newInfo':
                return <InfoIcon className={styles.icon} style={{...style, color: 'var(--whatsapp-green)'}}/>
            default:
                return null;
        }
    }  

    return(
        <div className={styles.iconWrapper} style={{width: `${size}px`, height: `${size}px`}}>
            <Tooltip title={tooltipMessage} placement={tooltipPlacement}> 
                {switchIcon(originalIcon)}
            </Tooltip>
        </div>
    )
}