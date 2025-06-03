
import React from 'react'


import SelectionBox from 'GlobalComponents/SelectionBox/SelectionBox.js';

const selectionItems = [
    {value: '+55', label: '+55 - Brasil'},
    {value: '+61', label: '+61 - Australia'},
]

export default function CountryCodeSelect({readOnly, width='100px', countryCode, setCountryCode}) {


    return (
        <SelectionBox 
            selectionItems={selectionItems} 
            mainFunction={setCountryCode} 
            mainValue={countryCode} 
            instanceName={'País'} 
            readOnly={readOnly}
            noWrap={false}
            width={width}
        />
    );
}
import PropTypes from 'prop-types';
// check props for CountryCodeSelect
CountryCodeSelect.propTypes = {
    readOnly: PropTypes.bool,
    width: PropTypes.string,
    countryCode: PropTypes.string.isRequired,
    setCountryCode: PropTypes.func.isRequired,
};


