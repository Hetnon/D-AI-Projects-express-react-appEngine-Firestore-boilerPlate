import React, {useState} from 'react';
import PropTypes from 'prop-types';

import styles from './MainPage.module.css';
import PageHeader from './PageHeader/PageHeader.js';
import UserAdminPanel from './UserAdminPanel/UserAdminPanel.js';
import WorkArea from './WorkArea/WorkArea.js';


export default function MainPage({ mainPageDimensions, pageHeaderHeight }) {
    const [activeView, setActiveView] = useState(false);
    const views = {
        admin: <UserAdminPanel setActiveView={setActiveView}/>,
        workArea: <WorkArea mainPageDimensions={mainPageDimensions}/>
    };

    return (
        <div className={styles.mainPageStructure}>
            <PageHeader setActiveView={setActiveView} pageHeaderHeight={pageHeaderHeight}/>
            {views[activeView] || views['workArea']}
        </div>
    )
}

MainPage.propTypes = {
    mainPageDimensions: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired
    }).isRequired,
    pageHeaderHeight: PropTypes.number.isRequired
};




