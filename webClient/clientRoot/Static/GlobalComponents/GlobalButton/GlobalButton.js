
import React from 'react'

import Button from '@mui/material/Button'; 
import styles from './GlobalButton.module.css';


export default function GlobalButton({onClick, label, width, type, height, uppercase=true}) {

    // type can be primary, secondary or selected - selected is only used for buttons that shows a selected state. These buttons have to vary their type betweeen selected and primary/secondary
    //buttons that are only promary os secondary are action butons that run something once pressed
    // width and height have to be in the format 'XXpx' 

    const buttonStyle = {
        width: width || '160px',
        height: height || 'auto',
        textTransform: uppercase ? 'uppercase': 'none'	
    };

    return(
        <>
            <Button 
                onClick={onClick} 
                className={styles[type]} 
                style={buttonStyle} 
            >
                {label}
            </Button>
        </>
    )
}



