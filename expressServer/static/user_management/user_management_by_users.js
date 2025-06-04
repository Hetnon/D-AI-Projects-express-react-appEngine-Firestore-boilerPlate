import {getUsersCollection} from '../firebase/firebase_apis.js';
import {encryptToken, decryptToken, createUniquePasswordResetToken} from '../utils/encryption/token_encryption.js';
import { createPassword } from '../utils/newPassword.js';
import { sendEmail } from '../externalConnections/Email/sendEmail.js';
import { sendNewPassword } from './user_management_by_admins.js';

const usersCollection = getUsersCollection();
export async function userLogin(req, res){
    try{
        const {email, password} = req.body;
        console.log('userLogin called with email:', email);
        if(!email || !password){
            res.status(400).json({error: 'MissingFields', message: 'Email and password are required'});
            return;
        }
        const allUsers = await usersCollection.get();
        console.log('All users:', allUsers.docs.map(doc => doc.id))
        const userDoc = await usersCollection.doc(email).get();
        if(!userDoc.exists){
            res.status(404).json({error: 'UserNotFound', message: 'User not found'});
            return;
        }
        const userData = userDoc.data();
        if(decryptToken(userData.password) !== password){
            res.status(401).json({error: 'IncorrectPassword', message: 'Incorrect password'});
            return;
        }

        if(userData.status!== 'active'){
            res.status(403).json({error: 'UserStatus', message: 'User not active or pending approval - contact admin'});
            return;
        }
        const user = {
            userEmail: email,
            userType: userData.userType,
            firstName: userData.firstName,
            lastName: userData.lastName
        }


        await createSession(req, user)
        
        console.log('User logged in:', req.session.user.userEmail);
        res.status(200).json({message: 'Login successful', userType: userData.userType, firstName: userData.firstName, lastName: userData.lastName});

    } catch (error){
        console.error('Error on userLogin', error);
        res.status(500).json({error: 'ServerError', message: 'Server error'});
    }
}

async function createSession(req, user) {
    return new Promise((resolve, reject) => {
        req.session.regenerate(err => {  // discard any pre-login stub
            if (err) return reject(err);
            req.session.user = user;
            const origin = getOrigin(req);

            if (process.env.NODE_ENV === 'production') {
                req.session.cookie.domain =
                    origin?.includes(process.env.ALLOWED_ORIGIN)
                    ? process.env.MAIN_DOMAIN
                    : process.env.SECONDARY_DOMAIN;
            } else {
                req.session.cookie.domain = 'localhost';
            }

            req.session.cookie.sameSite = origin === process.env.ALLOWED_ORIGIN ? 'Strict' : 'None';

            req.session.save(err => {
                if(err) return reject(err);    
                return resolve();          // everything persisted
            })
        });
    })
}

function getOrigin(req) {
    // with this logic we can understand the origin of the request
    // and then we can cancel the request if it is not from the allowed origin
    if (req.url?.includes('/socket.io/')) { // Adjust this according to where you expect the origin to be in a socket request
        return req.headers.origin;
    }  else if (req.headers) {
        if (req.headers['api-key-name-1']) {
            console.log('this is a call made from whoever has the api-key-name-1');
            return 'API_Key_1';
        } else if (req.headers['api-key-name-2']) {
            console.log('this is a call made from whoever has the api-key-name-2');
            return 'API_Key_2';
        }
        return req.get('Origin');
    } 
    return null;
}

export async function passwordResetRequest(req, res){
    try{
        console.log('passwordResetRequest req.body', req.body)
        const email = req.body.email;
        if(!email){
            console.log('request without email')
            res.status(400).json({error: 'MissingFields', message: 'Email is required'});
            return;
        }
        const userDoc = await usersCollection.doc(email).get();
        if(!userDoc.exists){
            console.log(`user ${email} not found`)
            res.status(404).json({error: 'UserNotFound', message: 'User not found'});
            return;
        }
        const uniqueToken = createUniquePasswordResetToken();
        const encryptedToken = encryptToken(uniqueToken);
        await usersCollection.doc(userDoc.id).update({passwordResetToken: encryptedToken});
        await sendPasswordResetConfirmation(email, uniqueToken);
        res.status(200).json({message: 'Password reset email sent'});
    } catch (error){
        console.error('Error on passwordResetRequest', error);
        res.status(500).json({error: 'ServerError', message: 'Server error'});
    }
}


async function sendPasswordResetConfirmation(emailAddress, token) {
    try{
        const subject = 'Quote Master - Confirmação de redefinição de senha';
        const content = `Olá do Quote Master!  
                        \n Alguém solicitou a redefinição da sua senha no nosso sistema.
                        \nPara confirmar, apenas clique no link: ${`quotemaster.carglass.com.br/password-reset?token=${token}&userEmail=${emailAddress}`}
                        \nApós clicar no link, uma página de confirmação irá se abrir. Você pode fechá-la após a confirmação.
                        \nSua senha será alterada e você receberá um email com a nova senha.

                        \nSe você não solicitou essa redefinição de senha, por favor, ignore este email.
                        \nObrigado!`;

        await sendEmail(emailAddress, content, subject);
    } catch (error) {
        console.error('sendNewPasswordEmail365 Error:', error.message);
        throw new Error('sendNewPasswordEmail365 Error:', error.message);
    }
}

export async function passwordResetConfirmation(req, res){
    try{
        console.log('passwordResetConfirmation req.body', req.body)
        const email = req.body.userEmail;
        
        if(!email){
            res.status(400).json({error: 'MissingFields', message: 'Email is required'});
            return;
        }

        const userDoc = await usersCollection.doc(email).get();
        if(!userDoc.exists){
            res.status(404).json({error: 'UserNotFound', message: 'User not found'});
            return;
        }
        const resetToken = req.body.token;
        if(!resetToken){
            res.status(400).json({error: 'MissingFields', message: 'Token is required'});
            return;
        }

        const userData = userDoc.data(); 

        if(!userData.passwordResetToken){
            res.status(401).json({error: 'InvalidToken', message: 'No password reset request found for this user'});
            return;
        }
        
        const savedResetToken = decryptToken(userData.passwordResetToken);
        if(savedResetToken !== resetToken){
            res.status(401).json({error: 'InvalidToken', message: 'Token invalido'});
            return;
        }
        
        const newPassword = createPassword();
        const encryptedPassword = encryptToken(newPassword);
        await usersCollection.doc(userDoc.id).update({passwordResetToken: '', password: encryptedPassword});
        await sendNewPassword(email, newPassword);
        res.status(200).json({message: 'Password reset email sent'});
    } catch (error){
        console.error('Error on passwordReset', error);
        res.status(500).json({error: 'ServerError', message: 'Server error'});
    }
}

export async function passwordChange(req, res){
    try{
        console.log('req.body', req.body)
        const {email, currentPassword, newPassword} = req.body;
        console.log('email', email)
        console.log('currentPassword', currentPassword)
        console.log('newPassword', newPassword)
        
        if(!email || !currentPassword || !newPassword){
            res.status(400).json({error: 'MissingFields', message: 'Email, current password and new password are required'});
            return;
        }

        const userDoc = await usersCollection.doc(email).get();
        if(!userDoc.exists){
            res.status(404).json({error: 'UserNotFound', message: 'User not found'});
            return;
        }
        const userData = userDoc.data();

        if(decryptToken(userData.password) !== currentPassword){
            res.status(401).json({error: 'IncorrectPassword', message: 'Incorrect current password'});
            return;
        }

        const encryptedPassword = encryptToken(newPassword);
        await usersCollection.doc(userDoc.id).update({password: encryptedPassword});
        res.status(200).json({message: 'Password changed successfully'});

    } catch (error){
        console.error('Error on passwordChange', error);
        res.status(500).json({error: 'ServerError', message: 'Server error'});
    }
}