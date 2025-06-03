
import React, {useState, useEffect, useRef } from 'react'

import SelectionBox from 'GlobalComponents/SelectionBox/SelectionBox.js';

const areaCodesUSA = [
    {state: 'Alabama', value: 'AL', label: 'AL'},
]

const CNsBrasil = [
    {state: 'SP', value: '11', label: '11'},
    {state: 'SP', value: '12', label: '12'},
    {state: 'SP', value: '13', label: '13'},
    {state: 'SP', value: '14', label: '14'},
    {state: 'SP', value: '15', label: '15'},
    {state: 'SP', value: '16', label: '16'},
    {state: 'SP', value: '17', label: '17'},
    {state: 'SP', value: '18', label: '18'},
    {state: 'SP', value: '19', label: '19'},
    {state: 'RJ', value: '21', label: '21'},
    {state: 'RJ', value: '22', label: '22'},
    {state: 'RJ', value: '24', label: '24'},
    {state: 'ES', value: '27', label: '27'},
    {state: 'ES', value: '28', label: '28'},
    {state: 'MG', value: '31', label: '31'},
    {state: 'MG', value: '32', label: '32'},
    {state: 'MG', value: '33', label: '33'},
    {state: 'MG', value: '34', label: '34'},
    {state: 'MG', value: '35', label: '35'},
    {state: 'MG', value: '37', label: '37'},
    {state: 'MG', value: '38', label: '38'},
    {state: 'PR', value: '41', label: '41'},
    {state: 'PR', value: '42', label: '42'},
    {state: 'PR', value: '43', label: '43'},
    {state: 'PR', value: '44', label: '44'},
    {state: 'PR', value: '45', label: '45'},
    {state: 'PR', value: '46', label: '46'},
    {state: 'SC', value: '47', label: '47'},
    {state: 'SC', value: '48', label: '48'},
    {state: 'RS', value: '51', label: '51'},
    {state: 'RS', value: '53', label: '53'},
    {state: 'RS', value: '54', label: '54'},
    {state: 'RS', value: '55', label: '55'},
    {state: 'DF', value: '61', label: '61'},
    {state: 'GO', value: '62', label: '62'},
    {state: 'TO', value: '63', label: '63'},
    {state: 'GO', value: '64', label: '64'},
    {state: 'MT', value: '65', label: '65'},
    {state: 'MT', value: '66', label: '66'},
    {state: 'MS', value: '67', label: '67'},
    {state: 'AC', value: '68', label: '68'},
    {state: 'RO', value: '69', label: '69'},
    {state: 'BA', value: '71', label: '71'},
    {state: 'BA', value: '73', label: '73'},
    {state: 'BA', value: '74', label: '74'},
    {state: 'BA', value: '75', label: '75'},
    {state: 'BA', value: '77', label: '77'},
    {state: 'PE', value: '81', label: '81'},
    {state: 'AL', value: '82', label: '82'},
    {state: 'PB', value: '83', label: '83'},
    {state: 'RN', value: '84', label: '84'},
    {state: 'CE', value: '85', label: '85'},
    {state: 'PI', value: '86', label: '86'},
    {state: 'PE', value: '87', label: '87'},
    {state: 'CE', value: '88', label: '88'},
    {state: 'PI', value: '89', label: '89'},
    {state: 'SE', value: '79', label: '79'},
    {state: 'PA', value: '91', label: '91'},
    {state: 'AM', value: '92', label: '92'},
    {state: 'PA', value: '93', label: '93'},
    {state: 'PA', value: '94', label: '94'},
    {state: 'RR', value: '95', label: '95'},
    {state: 'AP', value: '96', label: '96'},
    {state: 'AM', value: '97', label: '97'},
    {state: 'MA', value: '98', label: '98'},
    {state: 'MA', value: '99', label: '99'},
];

const areaCodesLists = [
    {countryCode: '+55', areaCodes: CNsBrasil},
    {countryCode: '+1', areaCodes: areaCodesUSA},
    {countryCode: '+61', areaCodes: []}, // Australia doesn't have area codes for mobile phones
];


export default function AreaCodeSelect({readOnly, areaCode, setAreaCode, countryCode}) {
    const [selectionItems, setSelectionItems] = useState([]);
    const firstLoadCompleted = useRef(false);

    useEffect(() => {
        if(!firstLoadCompleted.current) {
            firstLoadCompleted.current = true; // Set to true after the first load
            return; // Skip the effect if it's not the first load
        }

        if(countryCode === '') {
            setSelectionItems([]);
            return;
        }

        const areaCodeList = areaCodesLists.find(areaCodes => areaCodes.countryCode === countryCode);
        if(!areaCodeList){
            setSelectionItems([]);
            return;
        }
        
        setSelectionItems(areaCodeList.areaCodes);

    },[countryCode]);

    useEffect(() => {
        // If mainValue is not in selectionItems, set it to the first item to ''
        const areaCodeExists = selectionItems.length > 0 && selectionItems.some(option => option.value === areaCode) 
        if (!areaCodeExists) {
            setAreaCode('');
        }

    }, [selectionItems]);
    
    return (
        <SelectionBox 
            selectionItems={selectionItems} 
            mainFunction={setAreaCode} 
            mainValue={areaCode} 
            instanceName={'DDD'} 
            readOnly={readOnly}
            width={'32px'}
        />
    );
}

import PropTypes from 'prop-types';
// check props for AreaCodeSelect
AreaCodeSelect.propTypes = {
    readOnly: PropTypes.bool,
    areaCode: PropTypes.string.isRequired,
    setAreaCode: PropTypes.func.isRequired,
    countryCode: PropTypes.string.isRequired,
};
