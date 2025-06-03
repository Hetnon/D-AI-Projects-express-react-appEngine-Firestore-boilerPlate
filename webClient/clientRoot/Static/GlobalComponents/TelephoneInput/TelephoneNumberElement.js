import React, {useState, useRef, useEffect  } from 'react'
import PropTypes from 'prop-types';
import MaskElement from 'GlobalComponents/MaskedInput/MaskedInput.js';

export function TelephoneNumberElement({readOnly, telephoneNumber, setTelephoneNumber}){
    const [inputValue, setInputValue] = useState(telephoneNumber);
    
    const debounceTimeout = useRef(null);
    const handleChange = (event) => {
        const newValue = event.target.value;
        setInputValue(newValue);
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            console.log('Debounced value:', newValue);
                    setTelephoneNumber(newValue);		
        }, 100); // Adjust the debounce time as needed     
    }

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, []);

    useEffect(() => {
        setInputValue(telephoneNumber);
    }, [telephoneNumber]);

    return(
        <MaskElement 
            inputValue={inputValue}
            onChange={handleChange} 
            maskLayout={["9999-9999", "99999-9999"]} 
            width={'96px'} 
            readOnly={readOnly} 
        />
    )
}

// PropTypes for TelephoneNumberElement


TelephoneNumberElement.propTypes = {
    readOnly: PropTypes.bool,
    telephoneNumber: PropTypes.string.isRequired,
    setTelephoneNumber: PropTypes.func.isRequired,
};

