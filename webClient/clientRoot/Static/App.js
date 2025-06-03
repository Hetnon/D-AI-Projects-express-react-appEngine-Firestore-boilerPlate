import React, { useEffect, useState, useContext } from 'react';
import Modal from 'react-modal';

import EntryMessage from './EntryMessagePage/EntryMessage.js';
import {MasterContext} from './MasterContext.js';
import {checkUserWithServer} from './ServerCalls/userRelatedServerCalls.js';
import MainPage from './MainPage/MainPage.js';

export default function App() {
    Modal.setAppElement('#root');
    const {user, setUser} = useContext(MasterContext);
    const [pageDimensions, setPageDimensions] = useState({width: window.innerWidth, height: window.innerHeight});
    
    const pageHeaderHeight = 80;
    const [mainPageDimensions, setMainPageDimensions] = useState({
        width: pageDimensions.width,
        height: pageDimensions.height - pageHeaderHeight
    });

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function handleResize() {
        setPageDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });
        setMainPageDimensions({
            width: window.innerWidth,
            height: window.innerHeight - pageHeaderHeight
        });
    }

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser(){
        const loggedUser = await checkUserWithServer();
        if (loggedUser) {
            setUser(loggedUser);
        } 
    }

    return (
        <>
            {!user.userEmail ?
                <EntryMessage areaDimensions={pageDimensions}/>
                : 
                <MainPage mainPageDimensions={mainPageDimensions} pageHeaderHeight={pageHeaderHeight}/>    
            }
        </>
    )
}




