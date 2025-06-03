
import React, {useState, useRef,useEffect } from 'react'

import SelectionBox from 'GlobalComponents/SelectionBox/SelectionBox.js';
import { userOptions } from 'Contexts/static_options/static_options.js';
import PropTypes from 'prop-types';

export default function UserTypeSelect({user, setUser}) {
    const [userType, setUserType] = useState(user.userType);

    const firstLoadCompleted = useRef(false);   

    useEffect(() => {
        if(firstLoadCompleted.current){ // if the page is just loading for the first time
            const newUser = {...user};
            newUser.userType = userType;
            setUser(newUser);
        } else {
            firstLoadCompleted.current = true;
        }
    }, [userType]);

    useEffect(() => {
        setUserType(user.userType);
    }, [user.userType]);

    return (
        <SelectionBox 
            selectionItems={userOptions} 
            mainFunction={setUserType} 
            mainValue={userType} 
            instanceName={'User Type'} 
            readOnly={false}
        />
    );
}

// validate props
UserTypeSelect.propTypes = {
    user: PropTypes.shape({
        userEmail: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        userType: PropTypes.string.isRequired,
    }).isRequired,
    setUser: PropTypes.func.isRequired,
};