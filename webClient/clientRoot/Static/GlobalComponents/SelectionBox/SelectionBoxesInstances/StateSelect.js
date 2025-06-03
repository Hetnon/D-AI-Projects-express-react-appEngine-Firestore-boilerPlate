
import React from 'react'
import SelectionBox from 'GlobalComponents/SelectionBox/SelectionBox.js';
import PropTypes from 'prop-types';

const selectionItems = [
    {state: 'Acre', value: 'AC', label: 'AC'},
    {state: 'Alagoas', value: 'AL', label: 'AL'},
    {state: 'Amapá', value: 'AP', label: 'AP'},
    {state: 'Amazonas', value: 'AM', label: 'AM'},
    {state: 'Bahia', value: 'BA', label: 'BA'},
    {state: 'Ceará', value: 'CE', label: 'CE'},
    {state: 'Distrito Federal', value: 'DF', label: 'DF'},
    {state: 'Espírito Santo', value: 'ES', label: 'ES'},
    {state: 'Goiás', value: 'GO', label: 'GO'},
    {state: 'Maranhão', value: 'MA', label: 'MA'},
    {state: 'Mato Grosso', value: 'MT', label: 'MT'},
    {state: 'Mato Grosso do Sul', value: 'MS', label: 'MS'},
    {state: 'Minas Gerais', value: 'MG', label: 'MG'},
    {state: 'Pará', value: 'PA', label: 'PA'},
    {state: 'Paraíba', value: 'PB', label: 'PB'},
    {state: 'Paraná', value: 'PR', label: 'PR'},
    {state: 'Pernambuco', value: 'PE', label: 'PE'},
    {state: 'Piauí', value: 'PI', label: 'PI'},
    {state: 'Rio de Janeiro', value: 'RJ', label: 'RJ'},
    {state: 'Rio Grande do Norte', value: 'RN', label: 'RN'},
    {state: 'Rio Grande do Sul', value: 'RS', label: 'RS'},
    {state: 'Rondônia', value: 'RO', label: 'RO'},
    {state: 'Roraima', value: 'RR', label: 'RR'},
    {state: 'Santa Catarina', value: 'SC', label: 'SC'},
    {state: 'São Paulo', value: 'SP', label: 'SP'},
    {state: 'Sergipe', value: 'SE', label: 'SE'},
    {state: 'Tocantins', value: 'TO', label: 'TO'}
];

export default function StateSelect({readOnly, state, setState}) {
        return (
        <SelectionBox 
            selectionItems={selectionItems} 
            mainFunction={setState} 
            mainValue={state} 
            instanceName={'Estado'} 
            readOnly={readOnly}
        />
    );
}

// Validate props for StateSelect
StateSelect.propTypes = {
    readOnly: PropTypes.bool,
    state: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
};

