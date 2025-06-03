import React, { useEffect, useState } from 'react';
import {passwordResetConfirmation} from '../ServerCalls/userRelatedServerCalls.js';

export default function PasswordReset() {
    let [userEmail, token] = ['', ''];
    const [message, setMessage] = useState('Password Reset');
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        userEmail = urlParams.get('userEmail');
        token = urlParams.get('token');
        console.log(userEmail, token);
        confirmPasswordReset(userEmail, token); 

    }, []);

    async function confirmPasswordReset(userEmail, token){
        try {
            const response = await passwordResetConfirmation(userEmail, token);
            if(response===`Password reset email sent`){
                setMessage(                
                    <span>
                        Senha redefinida com sucesso. Um email com a nova senha foi enviado para {userEmail}.<br />
                        Você já pode fechar esta janela.
                    </span>
                )
            } else {
                setMessage(`Houve um erro ao confirmar a redefinição de senha. Por favor, tente novamente mais tarde.`);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            {message}
        </div>
    )
}