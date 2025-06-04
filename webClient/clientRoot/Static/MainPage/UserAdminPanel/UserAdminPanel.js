
import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';

import styles from './UserAdminPanel.module.css';

import {getUsersList, changeUserStatus, deleteUserInDB} from 'Contexts/ServerCalls/userRelatedServerCalls.js';

import {MasterContext} from 'Contexts/MasterContext.js';
import GlobalButton from 'GlobalComponents/GlobalButton/GlobalButton.js'
import ConfirmationModal from 'GlobalComponents/ConfirmationModal/ConfirmationModal.js';
import NewUserModal from './NewUserModal.js';
import WaitingProgressLine from 'GlobalComponents/WaitingProgressLine/WaitingProgressLine.js';

import RestorePageOutlinedIcon from '@mui/icons-material/RestorePageOutlined';
import Icon from 'GlobalComponents/Icon/Icon.js';


export default function UserAdminPanel({ setActiveView }) {
    const {loading, setLoading, userList, setUserList} = useContext(MasterContext);
    const [userToDelete, setUserToDelete] = useState('');
    const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);

    useEffect(() => {
        if(userList?.length === 0){
            updateUserList();
        }
    }, []);

    async function updateUserList() {
        setLoading(true);
        const response = await getUsersList();
        if (response === 'failed') {
            console.log('Failed to get user list');
            return;
        }
        setUserList(response.users);
        setLoading(false);
    }

    const deleteUser = async () => {
        try{
            setLoading(true);
            const response = await deleteUserInDB(userToDelete.userEmail);
            if (response !== 'User deleted successfully'){
                alert('Error in deleting user:', response);
                return;
            }
            setUserList(prev=>prev.filter(user=>user.userEmail!==userToDelete.userEmail));
            setUserToDelete('');
            setLoading(false);
        } catch(error){
            alert('Error in deleting user:', error);
            console.error('Error in deleting user:', error);
        }
    }

    const userDeleteConfirmationMessage =
            `Are you certain you want to delete the user ${userToDelete.userEmail}? 
            \n This action cannot be undone.`;

    const userDeleteButtons = [
        {text: 'Cancel', onClick: ()=>setUserToDelete(''), width: 100},
        {text: 'Delete', onClick: deleteUser, width: 100}
    ];

    return (
        <div className={styles.adminPanel}>
            {loading ? <WaitingProgressLine /> : null}
            <div className={styles.adminPanelHeader}>
                <div className={styles.adminPanelHeaderButtons}>
                    <GlobalButton
                        onClick={() => setActiveView('workArea')}
                        label={'Back to Work Area'}
                        width={'150px'}
                        type={'secondary'}
                    />
                </div>
                <div className={styles.adminPanelTitle}>Painel de Usuários</div>
                <GlobalButton 
                    onClick={updateUserList} 
                    label={
                        <> 
                            <RestorePageOutlinedIcon /> 
                            <span>Atualizar Lista <br/>de Usuários</span>
                        </>
                    }
                    width={'184px'}
                    type={'secondary'}
                />
            </div>
            <UserList userList={userList} setUserList={setUserList} setUserToDelete={setUserToDelete} setIsNewUserModalOpen={setIsNewUserModalOpen}/>
            {userToDelete ? <ConfirmationModal message={userDeleteConfirmationMessage} buttons={userDeleteButtons}/> : null}
            {isNewUserModalOpen ? <NewUserModal setIsNewUserModalOpen={setIsNewUserModalOpen} setUserList={setUserList}/> : null}
        </div>

    )
}

UserAdminPanel.propTypes = {
    setActiveView: PropTypes.func.isRequired
};

function UserList({userList, setUserList, setUserToDelete, setIsNewUserModalOpen }) {
    return (
        <div className={styles.userList}>
            <div className={styles.userListMainRow}>
                <div className={styles.adminPanelTitle}>Lista de Usuários</div>
                <GlobalButton onClick={()=>setIsNewUserModalOpen(true)} label={'Criar Novo Usuário'} width={'184px'} type={'primary'}/>                
            </div>
            <div className={styles.userListHeader}>
                <div className={styles.userEmail}>Email</div>
                <div className={styles.userType}>Tipo</div>
                <div className={styles.userStatus}>Status</div>
                <div className={styles.userStatus}>WA Number</div>
            </div>
            {userList.map(user => (
                <User user={user} key={user.userEmail} setUserList={setUserList} setUserToDelete={setUserToDelete}/>
            ))}
        </div>
    )
}

UserList.propTypes = {
    userList: PropTypes.array.isRequired,
    setUserList: PropTypes.func.isRequired,
    setUserToDelete: PropTypes.func.isRequired,
    setIsNewUserModalOpen: PropTypes.func.isRequired
};

function User({user, setUserList, setUserToDelete}) {

    function deleteUser() {
        setUserToDelete(user);
    }

    async function handleChangeUserStatus(newStatus) {
        const response = await changeUserStatus(user.userEmail, newStatus);
        if (response === 'failed') {
            console.log(`Failed to change user status to ${newStatus}`);
            return;
        }
        setUserList(prevUserList => prevUserList.map(u => u.userEmail === user.userEmail ? {...u, status: newStatus} : u));
    }

    return (
        <div className={styles.user}>
            <div className={styles.userEmail}>{user.userEmail}</div>
            <div className={styles.userType}>{user.userType}</div>
            <div className={styles.userStatus}>{user.status}</div>
            <div className={styles.userStatus}>{user.WANumber}</div>
            <GlobalButton 
                onClick={user.status === 'active' ? 
                    ()=>handleChangeUserStatus('inactive')
                    : ()=>handleChangeUserStatus('active') 
                }
                label={user.status === 'active' ? 'Desativar Usário' : 'Ativar User' }
                width={'160px'}
                type={'secondary'}
            />
            {user.userType === 'master-admin' ? null : Icon({originalIcon: 'deleteUser', size: 24, onClick: deleteUser})}
        </div>
    )
}

User.propTypes = {
    user: PropTypes.object.isRequired,
    setUserList: PropTypes.func.isRequired,
    setUserToDelete: PropTypes.func.isRequired
};
