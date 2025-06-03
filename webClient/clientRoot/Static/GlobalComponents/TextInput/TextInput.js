import React from 'react'

import styles from './TextInput.module.css';

export default function TextInput({onChange, inputValue, onClick, color, width, readOnly}){
    const textColor = color || 'var(--letter-dark)';
    const inputWidth = width || '100%';


    return(
        <input 
            className={styles.textInput}
            type={'text'}
            value={inputValue} 
            onChange={onChange}
            onClick={onClick}
            readOnly={readOnly}
            cursor={onClick ? 'pointer' : 'default'}
            style={{color: textColor, width: inputWidth, pointerEvents: readOnly ?  'none' : 'auto'}}
        />
    )
}