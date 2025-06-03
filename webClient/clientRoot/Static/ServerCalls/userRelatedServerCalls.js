import { serverAddress,  checkError} from './serverCalls.js';

export const checkUserWithServer = async () => {
    try {
        const response = await fetch(`${serverAddress}/check-user-session/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'  
        });
        if(!response.ok) { 
            return await checkError(response, 'checkUserWithServer');
        }
        const userData = await response.json();
        const user = {
            userEmail: userData.responseUser.userEmail,
            userType: userData.responseUser.userType,
            firstName: userData.responseUser.firstName,
            lastName: userData.responseUser.lastName,
            userPic: userData.responseUser.userPic
        };

        return user;        
    } catch (error) {
        console.error("Network error during user check", error);
        return 'failed';
    }
};


export const logoff = async () => {
    try {
        const response = await fetch(`${serverAddress}/terminate-session/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        if (!response.ok) { // Handle error
            console.error("Logoff failed");
        }
        console.log("Logoff successful");
    } catch (error) {
        console.error("Network error during terminate session", error);
        return 'failed';
    }
};

export const userLogin = async (email, password) => {
    try {
        const response = await fetch(`${serverAddress}/user-login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
            credentials: 'include' 

        });
        const parsedResponse = await response.json();
        if (!response.ok) { // Handle error
            console.error("Login failed");
            return parsedResponse;
        }
        console.log("Login successful");

        return parsedResponse;
    } catch (error) {
        console.error("Network error during login", error);
        return 'failed';
    }
}

export async function passwordResetRequest(email){
    try {
        const response = await fetch(`${serverAddress}/password-reset-request/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email})
        });
        if (!response.ok) { // Handle error
            console.error("Password reset request failed");
            const message = await response.json();
            return message;
        }
        const message = await response.json();
        return message.message
    } catch (error) {
        console.error("Network error during password reset request", error);
        return error.message;
    }
}

export async function passwordResetConfirmation(userEmail, token){
    try {
        const response = await fetch(`${serverAddress}/password-reset-confirmation/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userEmail, token})
        });
        if (!response.ok) { // Handle error
            console.error("Password reset confirmation failed");
            const message = await response.json();
            return message;
        }
        const message = await response.json();
        return message.message
    } catch (error) {
        console.error("Network error during password reset confirmation", error);
        return error.message;
    }
}

export async function passwordChange(email, newPassword, currentPassword){
    try {
        const response = await fetch(`${serverAddress}/password-change/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, newPassword, currentPassword})
        });
        if (!response.ok) { // Handle error
            console.error("Password change failed");
            const message = await response.json();
            console.log('message', message.message);
            return message.message;
        }
        const message = await response.json();  
        return message.message;
    } catch (error) {
        console.error("Network error during password change", error);
        return 'failed';
    }
}

export async function getUsersList(){
    try{
        const response = await fetch(`${serverAddress}/get-users-list`,{
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if(response.ok){
            const data = await response.json();
            return data;
        } else {
            return await checkError(response, 'getUsersList');

        }
    } catch (error){
        console.error('Error on getUsersList', error);
        return 'failed';
    }
}

export async function deleteUserInDB(userEmail){ 
    try{
        const response = await fetch(`${serverAddress}/delete-user/${userEmail}`,{
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if(response.ok){
            
            return 'User deleted successfully';
        } else {
            return await checkError(response, 'deleteUserInDB');
        }
    } catch (error){
        console.error('Error on deleteUserInDB', error);
        return 'failed';
    }
}

export async function changeUserStatus(userEmail, newStatus){
    try{
        const response = await fetch(`${serverAddress}/change-user-status/`,{
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newStatus, userEmail})
        })
        if(response.ok){
            return 'success';
        } else {
            return await checkError(response, 'changeUserStatus');
        }
    } catch (error){
        console.error('Error on changeUserStatus', error);
        return 'failed';
    }
}

export async function createUserInDB(newUser){
    try{
        const response = await fetch(`${serverAddress}/create-user/`,{
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser)
        })

        if(response.ok){
            return 'success';
        } else {
            return await checkError(response, 'createUserInDB');
        }
    } catch (error){
        console.error('Error on createUserInDB', error);
        return error;
    }
}