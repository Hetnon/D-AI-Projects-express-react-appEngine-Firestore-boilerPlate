import React from 'react';

import styles from './WorkArea.module.css';


export default function MainPage(mainPageDimensions) {


    return (
        <div className={styles.mainPageStructure} style={{width: mainPageDimensions.width, height: mainPageDimensions.height}}>
            {'Welcome to the Work Area!'}
        </div>
    )
}
