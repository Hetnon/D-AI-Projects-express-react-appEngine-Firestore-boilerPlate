import React from 'react'
import styles from './NumberInput.module.css';

export default function NumberInput({inputValue, onChange, spin, minValue, maxValue, step, preventingDefault, color, width, readOnly}){

    const onKeyDownFunction = (e) => {
        if(preventingDefault){
            e.preventDefault();
        }
    }

    const textColor = color || 'var(--letter-dark)';
    const inputWidth = width || '100%';



    return(
        <input 
            type='number'
            className={spin ? styles.numberInput : styles.numberInputNoSpin}
            step={step}
            min={minValue}
            max={maxValue}
            value={inputValue}
            onKeyDown={onKeyDownFunction} 
            onChange={onChange}
            readOnly={readOnly}
            style={{color: textColor, width: inputWidth, pointerEvents: readOnly ?  'none' : 'auto'}}
        />
    )
}