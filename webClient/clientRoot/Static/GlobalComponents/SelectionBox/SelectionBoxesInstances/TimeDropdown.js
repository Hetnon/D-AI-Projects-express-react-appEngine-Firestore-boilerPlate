import React from 'react';
import SelectionBox from 'GlobalComponents/SelectionBox/SelectionBox';
import PropTypes from 'prop-types';

export default function TimeDropdown({readOnly, selectedTime, setSelectedTime} ){
    const timeOptions = generateTimeSlots();

    return (
        <SelectionBox
            selectionItems={timeOptions} 
            mainFunction={setSelectedTime} 
            mainValue={selectedTime} 
            instanceName={'Hora'}
            readOnly={readOnly}
        />
    );
}

// validate props for TimeDropdown
TimeDropdown.propTypes = {
    readOnly: PropTypes.bool,
    selectedTime: PropTypes.string.isRequired,
    setSelectedTime: PropTypes.func.isRequired,
};


function generateTimeSlots(interval = 30, startHour = 8, endHour = 19) {
    const times = [];
    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
            const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            times.push({value: timeString, label: timeString});
        }
    }
    return times;
}