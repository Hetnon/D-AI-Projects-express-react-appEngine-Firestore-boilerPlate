import React, {useState, useEffect, useRef} from 'react'

import styles from './TelephoneInput.module.css';

import CountryCodeSelect from 'GlobalComponents/SelectionBox/SelectionBoxesInstances/CountryCodeSelect.js';
import AreaCodeSelect from 'GlobalComponents/SelectionBox/SelectionBoxesInstances/AreaCodeSelect.js';
import DetailInput from 'GlobalComponents/DetailInput/DetailInput.js';
import {TelephoneNumberElement} from './TelephoneNumberElement.js';

export default function TelephoneInput({phoneNumber, setPhoneNumber, readOnly}){
    const [telephoneNumber, setTelephoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [areaCode, setAreaCode] = useState('');
    const isInternalChange = useRef(false);

    useEffect(() => {

        if (isInternalChange.current) {
            isInternalChange.current = false;
            return; // Skip the effect if it's an internal change
        }
        setCountryCode(phoneNumber.countryCode);
        setAreaCode(phoneNumber.areaCode);
        setTelephoneNumber(phoneNumber.number);
    }, [phoneNumber]);

    useEffect(() => {
        isInternalChange.current = true;
        setPhoneNumber({
            ...phoneNumber,
            countryCode: countryCode,
            areaCode: areaCode,
            number: telephoneNumber
        });
    }, [countryCode, areaCode, telephoneNumber]);

    return(
        <div className={styles.detail}>
            <DetailInput 
                inputElement={
                    <CountryCodeSelect 
                        readOnly={readOnly} 
                        countryCode={countryCode}
                        setCountryCode={setCountryCode}
                    />
                } 
                width={'60px'} 
                readOnly={readOnly} 
                backgroundReadOnly={'transparent'} 
                borderBottom={false}
            />
            <DetailInput 
                inputElement={
                    <AreaCodeSelect 
                        readOnly={readOnly} 
                        areaCode={areaCode}
                        setAreaCode={setAreaCode}
                        countryCode={countryCode}
                    />
                }                     
                width={'52px'} 
                readOnly={readOnly} 
                backgroundReadOnly={'transparent'} 
                borderBottom={false}
            />           
            <DetailInput 
                inputElement={
                    <TelephoneNumberElement 
                        telephoneNumber={telephoneNumber}
                        setTelephoneNumber={setTelephoneNumber}
                        readOnly={readOnly} 
                    />
                }
                width={'96px'} 
                readOnly={readOnly} 
                backgroundReadOnly={'transparent'} 
                borderBottom={false}
            />
        </div>
    )
}

// PropTypes for TelephoneInput
import PropTypes from 'prop-types';
TelephoneInput.propTypes = {
    phoneNumber: PropTypes.shape({
        countryCode: PropTypes.string.isRequired,
        areaCode: PropTypes.string.isRequired,
        number: PropTypes.string.isRequired
    }).isRequired,
    setPhoneNumber: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
};