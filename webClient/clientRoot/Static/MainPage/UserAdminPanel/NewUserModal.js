import React, {useCallback, useState, useContext} from 'react';
import PropTypes from 'prop-types';
import styles from './NewUserModal.module.css';
import LabelElement from 'GlobalComponents/LabelElement/LabelElement.js';
import commonStyles from 'GlobalComponents/CommonStyles.module.css';
import {createUserInDB} from 'ServerCalls/userRelatedServerCalls.js';
import ConfirmationModal from 'GlobalComponents/ConfirmationModal/ConfirmationModal';
import {MasterContext} from 'Contexts/MasterContext.js';
import DetailInput from 'GlobalComponents/DetailInput/DetailInput';
import TextInput from 'GlobalComponents/TextInput/TextInput.js';
import UserTypeSelect from 'GlobalComponents/SelectionBox/SelectionBoxesInstances/UserTypeSelect.js';

export default function NewUserModal({setIsNewUserModalOpen, setUserList}){
    const {setLoading} = useContext(MasterContext);
    const [newUser, setNewUser] = useState({
        userEmail: '',
        firstName: '',
        lastName: '',
        userType: '',
        status: ''
    });

    const changeTheValueOf = useCallback((field) => (event) => {
        const value = event.target.value; // Extract the value from the event object
        setNewUser((prev) => ({
            ...prev,
            [field]: value
        }));
    }, [newUser]);

    const inputWidth = '224px';
    const labelWidth = '160px';

    const message = 
    <>
        <div className={styles.actionModalTitle}>
            Criar Novo Usuário
        </div>
        <div className={commonStyles.parametersColumn}>
            <div className={commonStyles.parameterRow}>
                <LabelElement width={labelWidth} label={'email'}/>
                <DetailInput
                    width={inputWidth}
                    inputElement={
                        <TextInput
                            value={newUser.userEmail}
                            onChange={changeTheValueOf('userEmail')}
                        />
                    }
                />
            </div>
            <div className={commonStyles.parameterRow}>
                <LabelElement width={labelWidth} label={'Nome'}/>
                <DetailInput
                    width={inputWidth}
                    inputElement={
                        <TextInput
                            value={newUser.firstName}
                            onChange={changeTheValueOf('firstName')}
                        />
                    }
                />
            </div>
            <div className={commonStyles.parameterRow}>
                <LabelElement width={labelWidth} label={'Sobrenome'}/>
                <DetailInput
                    width={inputWidth}
                    inputElement={
                        <TextInput
                            value={newUser.lastName}
                            onChange={changeTheValueOf('lastName')}
                        />
                    }
                />
            </div>
            <div className={commonStyles.parameterRow}>
                <LabelElement width={labelWidth} label={'Tipo de Usuário'}/>
                <DetailInput
                    width={inputWidth}
                    inputElement={
                        <UserTypeSelect user={newUser} setUser={setNewUser} />
                    }
                />
            </div>
        </div>
    </>;

    const createNewUser = async () => {
        if (allUserFieldsCorrect()){
            setLoading(true);
            const response = await createUserInDB(newUser);
            if (response !== 'success'){
                alert(`Failed to create user: ${response}` );
                return;
            }
            newUser.status = 'active';
            setUserList(prev=>[...prev, newUser]);
            setIsNewUserModalOpen(false);
            setLoading(false);
        }
    }

    const allUserFieldsCorrect = () => {
        console.log('newUser', newUser);
        if (newUser.userEmail === '' || newUser.firstName === '' || newUser.lastName === '' || newUser.userType === ''){
            alert('Please fill all User fields');
            return false;
        }
        if (!validateEmail(newUser.userEmail)){
            alert('Invalid user email');
            return false;
        }
        return true;
    }

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    const newUserButtons = [
        {text: 'Cancelar', onClick: ()=>setIsNewUserModalOpen(false), width: 100},
        {text: 'Adicionar Usuário', onClick: createNewUser, width: 100}
    ];


    return(
        <ConfirmationModal message={message} buttons={newUserButtons}/>
    )
}

NewUserModal.propTypes = {
    setIsNewUserModalOpen: PropTypes.func.isRequired,
    setUserList: PropTypes.func.isRequired
};