// FoldersToFileContext.js
import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
export const MasterContext = createContext();

export const MasterContextProvider = ({children}) => {
    const [user, setUser] = useState({userEmail: '', firstName: '', lastName: '', profilePic: '', userType: ''});
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
   


    const contextValue = React.useMemo(() => ({
        loading, setLoading,
        user, setUser, 
        userList, setUserList
    }), [loading, setLoading, user, setUser, userList, setUserList]);
        
    return (
        <MasterContext.Provider value={contextValue}>
            {children}
        </MasterContext.Provider>
    );
};

// validate children
MasterContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

