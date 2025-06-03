import React from 'react'
import PropTypes from 'prop-types';
import styles from './DetailInput.module.css';

export default function DetailInput({width, inputElement, readOnly, backgroundReadOnly='var(--background-non-editable)', borderBottom=true}){

    const standardStyles = () => {
        if(readOnly===false){
            return {backgroundColor: 'var(--background-light)'}
        }
        const nonEditableInputStyles = {
            backgroundColor: backgroundReadOnly,
            pointerEvents: 'none',
            color: 'var(--letter-dark)',
            readOnly: readOnly
        };
        if(readOnly){
            return nonEditableInputStyles
        }   
   
        return {}
    }

        
    return(
        <div 
            className={styles.detailInput} 
            style={{width: width, borderBottom: borderBottom ? '1px solid var(--border-dark)':'none', ...standardStyles()}} 
        >
            {inputElement}
        </div>
    )
}

DetailInput.propTypes = {
    width: PropTypes.string.isRequired,
    inputElement: PropTypes.element.isRequired,
    readOnly: PropTypes.bool,
    backgroundReadOnly: PropTypes.string,
    borderBottom: PropTypes.bool
};


