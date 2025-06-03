import React from 'react';

import moment from 'moment-timezone';
import styles from './DateElement.module.css';
import {timeZone} from 'Contexts/static_options/Classes.js'

export default function DateElement({inputValue, onChange}){
    const today = moment().tz(timeZone).format('YYYY-MM-DD');


    return(
        <input 
            className={styles.dateElement}
            type="date" 
            min={today} 
            value={inputValue} 
            onChange={onChange}
        />
    )
}

DateElement.propTypes = {
    inputValue: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};