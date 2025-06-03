import React from 'react';
import { createRoot } from 'react-dom/client';
import App   from './Static/App.js';
import { MasterContextProvider } from './Static/MasterContext.js';
import { StyledEngineProvider } from '@mui/material/styles';
import './global.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { SocketContextProvider } from './Static/SocketContext.js';
import PasswordReset from './Static/PasswordReset/PasswordReset.js';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <StyledEngineProvider injectFirst>
        <MasterContextProvider>
            {/* <SocketContextProvider> */}
                <BrowserRouter future={{ v7_relativeSplatPath: true,  v7_startTransition: true }}> 
                    <Routes>
                        <Route path="/password-reset" element={<PasswordReset />} />
                        <Route path="/" element={<App />} />
                    </Routes>
                </BrowserRouter>
            {/* </SocketContextProvider>   */}
        </MasterContextProvider>
    </StyledEngineProvider>
);