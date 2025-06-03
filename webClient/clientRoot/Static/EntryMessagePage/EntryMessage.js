import React, {useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './EntryMessage.module.css'
import LogoDisplay from '../../Assets/HFYIcon/HFYIcon.js';
import {userLogin, passwordResetRequest, passwordChange} from '../ServerCalls/userRelatedServerCalls.js';
import {MasterContext} from '../MasterContext.js';
import GlobalButton from 'GlobalComponents/GlobalButton/GlobalButton.js';


export default function EntryMessage({areaDimensions}) {

    const iconHeight = areaDimensions.height * 0.3;
    const iconMarginTop = areaDimensions.height * 0;
    
    const [operation, setOperation] = useState('login');

    return (
        <div className={styles.entryPage}>
            <div 
                className={styles.title} 
                style={{marginTop: `${iconMarginTop}px`}}
            >
                HFY
            </div>
            <LogoDisplay 
                dimension={`${iconHeight}px`} 
                color={'purple'} 
            />
            <LoginBox
                setOperation={setOperation} 
                operation={operation} 
            />
        </div>
    );
}

EntryMessage.propTypes = {
    areaDimensions: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired
    }).isRequired,
};

function LoginBox({ setOperation, operation }){
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [cancelLabel, setCancelLabel] = useState('Cancel');
    const [operationLabel, setOperationLabel] = useState('Login');
    const [title, setTitle] = useState(null);
    const {setUser, setLoading} = useContext(MasterContext);

    useEffect(() => {
        switch(operation){
            case 'login':
                setCancelLabel('Cancel');
                setOperationLabel(operation === 'login' ? 'Login' : 'Sign Up');
                setTitle(operation === 'login' ? 'User Login' : 'User Sign Up');
                break;
            case 'passwordReset':
            case 'passwordChange':
                setCancelLabel('Back To Login');
                setOperationLabel(operation === 'passwordReset' ? 'Reset Password' : 'Change Password');
                setTitle(operation === 'passwordReset' ? 'Password Reset' : 'Password Change');
                break;
        }
    }, [operation]);

    const handleOperation = () => {
        if(email === '' ){
            alert('Email required');
            return;
        }
        if((operation === 'login' || operation === 'passwordChange') && currentPassword === ''){
            alert('Password required');
            return;
        }
        switch(operation){
            case 'login':
                handleLogin();
                break; 
            case 'passwordReset':
                handlePasswordReset();
                break;
            case 'passwordChange':
                handlePasswordChange();
                break;
        }
    }

    const handleLogin = async () => {

        try{
            setLoading(true)
            const response = await userLogin(email, currentPassword);
            if(response.message === 'Login successful'){
                const newUser = {userEmail: email, userType:response.userType, firstName: response.firstName, lastName: response.lastName};
                setUser(newUser);
                setOperation(null);
                setLoading(false);
            } else{
                setLoading(false);
                alert('Login failed - ' + response.message);
            }
        } catch(error){
            alert('Login failed - Error: ' + error.message);
            setLoading(false);
        }
    }

    const cancelOperation = () => {
        console.log('cancelOperation', operation);
        switch(operation){
            case 'passwordReset':
            case 'passwordChange':
                console.log('setOperation login')
                setOperation('login');
                break;
        }
    };

    const handlePasswordReset = async () => {
        if(email === ''){	
            alert('Please enter your email address');
            return;
        } 
        try {
            const response = await passwordResetRequest(email);

            if(response === 'Password reset email sent'){
                alert('Password reset email sent to ' + email + '. Please check your email and follow the instructions.');
                setCurrentPassword('');
                setNewPassword('');
                setOperation('login');
            } else{
                alert(response);    
            }
        } catch(error){
            alert('Password reset failed' + error.message);
            console.error('Password reset failed', error);
        }
    }

    const handlePasswordChange = async () => {
        console.log('handlePasswordChange', email, newPassword, currentPassword);
        try{
           const response = await passwordChange(email, newPassword, currentPassword);
           if(response === 'Password changed successfully'){
                setOperation('login');
                alert('Password Change Successful');
           } else{
               alert(response);
           }
        } catch(error){
            alert('Password Change failed - Error: ' + error.message);
            console.error('Password Change failed', error);
        }
    }
    
    return (
        <div className={styles.loginArea}>
            <div>{title}</div>
            <input
                type="text" 
                placeholder={"email"} 
                className={styles.inputArea} 
                value={email}
                onInput={(e) => {setEmail(e.target.value)}}
                onKeyDown={(e) => {
                    if(e.key === 'Enter'){
                        e.preventDefault();
                        if(e.key === 'Enter'){
                            handleOperation();
                        } 
                    }
                }}
            />
            {(operation==='login' || operation==='passwordChange')  &&
                <input
                    type="password" 
                    placeholder={operation==='login' ? "password" : "current password"} 
                    className={styles.inputArea} 
                    value={currentPassword}
                    onInput={(e) => {setCurrentPassword(e.target.value)}}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' ){
                            e.preventDefault();
                            if(e.key === 'Enter'){
                                handleOperation();
                            } 
                        }
                    }}
                />
            }
            {operation==='passwordChange'  && 
                <>
                    <input
                        type="password" 
                        placeholder={"new password"} 
                        className={styles.inputArea} 
                        value={newPassword}
                        onInput={(e) => {setNewPassword(e.target.value)}}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter'){
                                e.preventDefault();
                                handleOperation();
                            }
                        }}
                    />
                
                    <input
                        type="password" 
                        placeholder={"new password confirmation"} 
                        className={styles.inputArea} 
                        value={passwordConfirmation}
                        onInput={(e) => {setPasswordConfirmation(e.target.value)}}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter'){
                                e.preventDefault();
                                handleOperation();
                            }
                        }}
                    />
                </>
            }
            <div className={styles.buttonsLoginSignupArea} style={{justifyContent: operation!=='login' ? 'space-between': 'center' }}>
                {operation!=='login' && 
                    <GlobalButton
                        onClick={cancelOperation}
                        label={cancelLabel}
                        width={'120px'}
                        type={'primary'}
                        height={'44px'}

                    />                    
                }
                <GlobalButton
                    onClick={handleOperation}
                    label={operationLabel}
                    width={'120px'}
                    type={'primary'}
                    height={'44px'}
                /> 
            </div>
            {operation==='login' &&  
                <div className={styles.buttonsLoginSignupArea}>
                    <GlobalButton onClick={()=>setOperation('passwordReset')} label={'Forgot Password?'} width={'120px'} type={'secondary'} height={'44px'}/>
                    <GlobalButton onClick={()=>setOperation('passwordChange')}  label={'Change Password'} width={'120px'} type={'secondary'} height={'44px'}/> 
                </div>
            }
        </div>
    );
}

LoginBox.propTypes = {
    setOperation: PropTypes.func.isRequired,
    operation: PropTypes.string.isRequired,
};