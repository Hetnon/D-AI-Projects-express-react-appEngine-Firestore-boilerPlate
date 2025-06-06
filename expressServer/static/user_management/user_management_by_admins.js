import {encryptToken} from '../utils/encryption/token_encryption.js';
import {createPassword } from '../utils/newPassword.js';
import {sendEmail} from '../externalConnections/Email/sendEmail.js';

import {getMethods } from '../database/databases.js';
const {getUserDocument, createUserDB, getUsersListDB, deleteUserDB, updateUserFields} = getMethods();

export async function createUser(req, res){
    try{
        const newUser = req.body;

        // check if user email is already in use
        const userDoc = await getUserDocument(newUser.userEmail);
        if(userDoc){
            res.status(403).json({error: 'UserExists', message: 'User already exists'});
            return;
        }
       
        // create 16 random characters password
        const password = createPassword();  

        // encrypt password and save user in user Doc
        newUser.password = encryptToken(password);
        newUser.status = 'active';

        await createUserDB(newUser);
        await sendNewPassword(newUser.userEmail, password);
        res.status(200).json({message: 'User created'});
    } catch (error){
        console.error('Error on createUser', error);
        res.status(500).json({error: 'ServerError', message: 'Server error'});
    }
}

export async function sendNewPassword(emailAddress, password) {
    try{
        const subject = 'Nova senha do Quote Master ';
        const content = `Olá do Quote Master! Sua nova senha é: ${password}
                        \nVocê pode alterar essa senha para uma de sua escolha após na página de login do QuoteMaster.
                        \n\n{https://quotemaster.carglass.com.br}

                        \nObrigado!`;
        await sendEmail(emailAddress, content, subject);
    } catch (error) {
        console.error('sendNewPassword Error:', error.message);
        throw new Error('sendNewPassword Error:', error.message);
    }
}


export async function getUsersList(req, res){
    try{
        const usersDocs = await getUsersListDB();
        // map to all fields
        const users = usersDocs.map(doc => {
            delete doc.password;
            return doc;
        });
        res.status(200).send({users});
    } catch (error){
        console.error('Error in getUsersList:', error);
        res.status(500).send('Error in getUsersList');
    }
}

export async function deleteUser(req, res){
    try{
        const userEmail = req.params.userEmail;
        if(!userEmail){
            res.status(400).send('User email is required');
            return;
        }
        await deleteUserDB(userEmail);
        res.status(200).send('User deleted');
    } catch (error){
        console.error('Error in deleteUser:', error);
        res.status(500).send('Error in deleteUser');
    }
}

export async function changeUserStatus(req, res){
    try{
        const userEmail = req.body.userEmail;

        if(!userEmail){
            res.status(400).send('User email is required');
            return;
        }
        const newStatus = req.body.newStatus;
        await updateUserFields(userEmail, {status: newStatus})
        res.status(200).send('User status updated');
    } catch (error){
        console.error('Error in changeUserStatus:', error);
        res.status(500).send('Error in changeUserStatus');
    }
}