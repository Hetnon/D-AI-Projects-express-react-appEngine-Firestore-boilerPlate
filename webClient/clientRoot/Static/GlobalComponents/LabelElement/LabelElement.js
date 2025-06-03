import React from 'react'

import styles from './LabelElement.module.css';

export default function LabelElement({width, label}){
    return(
        <p 
            className={styles.labels} 
            style={{width: width}}
        >
            {label}
        </p>
    )
}