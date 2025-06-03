
import React, {useEffect, useState } from 'react'
import Select from 'react-select';
import styles from './SelectionBox.module.css';



export default function SelectionBox({selectionItems, mainFunction, mainValue, instanceName, readOnly, height='32px', width, noWrap=true}) {
    const [dropdownOpen, setDropdownOpen ] = useState(false);
    const [currentSelection, setCurrentSelection] = useState(null);
    const handleChange = (selectedOption) => {
        mainFunction(selectedOption.value); // Make sure selectedOption is not null
        setDropdownOpen(false);
    };

    useEffect(() => {
        const currentSelectionAux = selectionItems
        .map((option) =>
            instanceName === 'País' && mainValue === option.value
                ? { ...option, label: option.value } // Replace label with value for 'País'
                : option
        )
        .find((option) => mainValue === option.value);
        setCurrentSelection(currentSelectionAux || null);
    }, [mainValue, selectionItems]);

    const fontSize = '15px';

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            boxShadow: state.isFocused ? 'none' : 'none',
            border: state.isFocused ? 'none' : 'none',
            height: `${height}  !important`,
            lineHeight: `${height}  !important`,
            maxHeight: `${height} !important`,
            width:'100%', 
            fontSize: fontSize,
            padding: '0px 0px 0px 0px', 
            margin: '0px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxSizing: 'border-box',
            caretColor: 'transparent',
            backgroundColor:  (readOnly) ? 'transparent' : 'var(--background-light)',
        }),
        dropdownIndicator: (provided, state) => ({
            ...provided,
            padding: '0',
            margin: '0px',
            border: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: `${height} !important`,
            lineHeight: `${height} !important`,
            color: (readOnly) ? 'transparent' : 'var(--letter-dark)',
            svg: {
                width: '20px', // Adjust size of the SVG icon
                height: '20px' // Adjust size of the SVG icon
            },
            ':hover': {
                color: 'var(--letter-selected-button)',
            },

        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: instanceName==='DDD' ? '0px':'0px 0px 0px 6px',
            margin: '0px',
            height: `${height} !important`,
            border: 'none',
            borderRight: 'none',
            color: 'var(--letter-dark)',
            width:  '100%',
            maxWidth: '100%',
            
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            height: `${height} !important`,
            marginTop: '3px', // gambiarra para centralizar o ícone
            padding: '0px',
            border: 'none',
            borderLeft: 'none',

        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            display: 'none', // This hides the divider
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'var(--background-regular)',
            marginTop: '5px',
            width: instanceName==='DDD' ? '60px' : '100%',
            zIndex: 9999,
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? 'var(--background-dark)' : 'transparent',
            color: state.isSelected ? 'var(--letter-selected-button:)' : 'var(--letter-dark)',
            ':hover': {
                backgroundColor: 'var(--background-hovered)', // Background color on hover
                color: 'var(--letter-dark)',
            },
            height: '100%',
            userSelect: 'none',
            fontSize: fontSize,
            whiteSpace: noWrap? 'nowrap':'normal',	
            overflow: noWrap? 'hidden':'visible',
            textOverflow: noWrap?'ellipsis':'clip',
        }), 
        singleValue: (provided, state) => ({
            ...provided,
            color: 'var(--letter-dark)',
            whiteSpace: noWrap? 'nowrap':'normal',	
            overflow: noWrap? 'hidden':'visible',
            textOverflow: noWrap?'ellipsis':'clip',
            width: '100%',

        }),
        placeholder: (provided, state) => ({
            ...provided,
            color: 'var(--letter-dark)', // Color for the placeholder text when nothing is selected
            userSelect: 'none',
            margin: '0px',
            width: width ? width : '100%',
        }),
        input: (provided) => ({
            ...provided,
            margin: '0px',
            padding: instanceName==='DDD' ? '0px':'0px 6px',
            height: '100%',
            lineHeight: 'normal',
            display: 'inline-block',
            verticalAlign: 'middle',
            width: '100%',
        }),
    };
      
    return (
        <Select
            value={currentSelection}
            options={selectionItems}
            onChange={handleChange}
            className={styles.selectionBox}
            menuIsOpen={dropdownOpen}
            onMenuOpen={() => setDropdownOpen(true)}
            onMenuClose={() => setDropdownOpen(false)}
            styles={customStyles}
            placeholder={instanceName}
            isDisabled={readOnly}
            menuPortalTarget={document.body}  // Ensures the menu is appended to the body
        />
    );
        
}
