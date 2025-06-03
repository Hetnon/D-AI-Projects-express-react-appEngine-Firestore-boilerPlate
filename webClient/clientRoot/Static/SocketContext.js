// FoldersToFileContext.js
import React, { createContext, useState, useEffect, useRef, useContext} from 'react';
import io from 'socket.io-client';
import {serverAddressPreAddress} from './ServerCalls/serverCalls.js';
import {MasterContext} from './MasterContext.js';
import PropTypes from 'prop-types';

export const SocketContext = createContext();

export const SocketContextProvider = ({children}) => {
    const {currentSomething, setCurrentSomething, somethingList, setSomethingList, user} = useContext(MasterContext);
    const [socket, setSocket] = useState(null);
    const socketShouldReconnect = useRef(false);
    const socketCallBack = useRef(null);
    const currentSomethingRef = useRef(currentSomething);
    const somethingListRef = useRef(somethingList);  
   
    function connectSocket(){
        console.log('Connecting to socket on address', serverAddressPreAddress);
        const newSocket = io(serverAddressPreAddress, {
            withCredentials: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 3000,
        });
        setSocket(newSocket);
        socketShouldReconnect.current = true;
        console.log('Connecting to server');
    }

    function socketEmitter(event, data){
        if(socket?.connected){
            if(user.userType !== 'agent'){ // join the admin room
                socket.emit('joinRoom', {room: 'admins'});
            }
            socket.emit(event, data);
        } else {
                socketCallBack.current = () => {
                    if(user.userType !== 'agent'){ // join the admin room
                        socket.emit('joinRoom', {room: 'admins'});
                    }
                    socket.emit(event, data);
                }
                socketShouldReconnect.current = true;
                socket.connect();
        }
    }

    useEffect(() => {
        if(user.userEmail){
            connectSocket();
        }
    }, [user]);

    useEffect(() => {
        if(socket){
            socket.connect();
            socket.on('connect_error', (err) => {
                console.error('Connection failed', err);
            });
        
            socket.on('connect', () => {
                console.log('Connected to server');
                if(socketCallBack.current){
                    socketCallBack.current();
                    socketCallBack.current = null;
                }
                if(user.userType === 'admin' || user.userType==='master-admin'){ // join the admin room
                    socket.emit('joinRoom', {room: 'admins'});
                }
            });

            socket.on('errorResponse', (error) => {
                console.error('Error received from server', error);
                alert('Error received from server: ' + error.message)
            })

            
            socket.on('error', (err) => {
                console.error('Error received', err);
            });
        
            socket.on('disconnect', (reason) => {
                console.log('Disconnected from server', reason);
                if(reason === 'io server disconnect' && socketShouldReconnect.current){
                    console.log('Reconnecting to server');
                    socket.connect();
                };
            });

            socket.on('newSomething', (something) => {
                if(somethingListRef.current.find(somethingAux => somethingAux.somethingId === something.somethingId)){
                    console.log('Something already exists', something);
                    return;
                }
                console.log('Received new something', something);
                const newSomethingList = [...somethingListRef.current];
                newSomethingList.push(something);
                setSomethingList(newSomethingList);
            });

            socket.on('updateSomething', (something) => {
                console.log('updateSomething', something);
                updateSomethingList(something);
                if(currentSomethingRef.current.somethingId !== something.somethingId){
                    // simply update the list
                    return;
                }
                // update the current something 
                setCurrentSomething(something);
            });


            socket.on('deleteSomething', (something) => {
                console.log('deleteSomething', something);
                const newSomethingList = somethingListRef.current.filter(somethingAux => somethingAux.somethingId !== something.somethingId);
                setSomethingList(newSomethingList);
                if(currentSomethingRef.current.somethingId === something.somethingId){
                    setCurrentSomething(null);
                }
            });
        }
    }, [socket]);



    function updateSomethingList(something){
        const newSomethingList = [...somethingListRef.current];
        const currentSomethingAux = newSomethingList.find(somethingAux => something.somethingId === somethingAux.somethingId);
        if(!currentSomethingAux){
            return;
        }
        currentSomethingAux.field1 = something.field1;
        if(currentSomethingAux.somethingId !== currentSomethingRef.current.somethingId){
            currentSomethingAux.newInfo = true;
        }
        setSomethingList(newSomethingList);
    }

    useEffect(() => {
        currentSomethingRef.current = currentSomething;
    }, [currentSomething]);

    useEffect(() => {
        somethingListRef.current = somethingList;
    }, [somethingList]);


    const contextValue = React.useMemo(() => ({
        connectSocket,
        socketShouldReconnect,
        socketEmitter,
        socketCallBack,
        socket,
    }), [connectSocket, socketShouldReconnect, socketEmitter, socketCallBack, socket]);
        
    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
};

//validate the children
SocketContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
