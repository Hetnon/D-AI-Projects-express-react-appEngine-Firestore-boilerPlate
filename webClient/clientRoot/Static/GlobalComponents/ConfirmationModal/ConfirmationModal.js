import React, {useState, useContext} from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import styles from './ConfirmationModal.module.css';
import GlobalButton from 'GlobalComponents/GlobalButton/GlobalButton.js';
import WaitingProgressLine from 'GlobalComponents/WaitingProgressLine/WaitingProgressLine.js';
import {MasterContext} from 'Contexts/MasterContext.js';

export default function ConfirmationModal({message, buttons}){
    
    const {loading} = useContext(MasterContext);

    const [isOpen, setIsOpen] = useState(true);

    const buttonsPadding = 24;
    const totalButtonsWidth = buttons.reduce((acc, button) => acc + button.width, 0);
    const confirmationButtonsWidth = totalButtonsWidth + (buttons.length - 1)*buttonsPadding;  

    return(
        <Modal className={styles.confirmSODeletionPopup} 
            isOpen ={isOpen}
            onRequestClose={()=>{}} // This is to prevent the modal from closing when the user clicks outside of it
            style={{
                overlay: {
                    backgroundColor: 'transparent', // Makes the overlay (backdrop) transparent
                }
            }}
        >
            {loading && <WaitingProgressLine/>}
            <div className={styles.confirmationModalTitle}>
                {message}
            </div>
            <ul className={styles.confirmationButtons} style={{width: `${confirmationButtonsWidth}px`, padding: `0px ${buttonsPadding}px` }}> 
                {buttons.map((button, index) => (
                    <GlobalButton key={index} onClick={button.onClick} width={`${button.width}px`} height={'32px'} label={button.text} type={'primary'}/>
                ))}
            </ul>
        </Modal>
    )
}

ConfirmationModal.propTypes = {
    // message can be a string or an element
    message: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]).isRequired,
    buttons: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        width: PropTypes.number.isRequired
    })).isRequired
};