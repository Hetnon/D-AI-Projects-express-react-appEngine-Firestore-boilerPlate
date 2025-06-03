import styles from './MaskedInput.module.css';
import Inputmask from 'inputmask';
import React, {useRef, useEffect} from 'react'


export default function MaskElement({onChange, maskLayout, inputValue, width, color, readOnly}){
    const inputRef = useRef(null);
    const inputWidth = width || '100%';
    const inputColor = color || 'var(--letter-dark)';
    const placeholderColor = color || 'var(--letter-dark)';

    useEffect(() => {
        // Apply the input mask
        const mask = new Inputmask({
            mask: maskLayout,
            placeholder: "_",
            showMaskOnHover: true,
            greedy: false,
        });
        mask.mask(inputRef.current);

        // Set placeholder color using JavaScript
        if (inputRef.current) {
            inputRef.current.style.setProperty('--placeholder-color', placeholderColor);

            // Create a new style element
            const styleSheet = document.createElement("style");
            styleSheet.innerHTML = `
                input::placeholder {
                    color: ${placeholderColor} !important;
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }, [maskLayout, inputColor, placeholderColor, inputWidth]);

    return (
        <input 
            value={inputValue}
            ref={inputRef} 
            onChange={onChange}
            className={styles.maskedInput}
            style={{width: inputWidth, color: inputColor, pointerEvents: readOnly ?  'none' : 'auto'}}
        />  
    );
}