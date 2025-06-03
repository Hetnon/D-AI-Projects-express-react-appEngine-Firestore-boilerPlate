
import React, { useEffect, useState  } from 'react';
import styles from './SearchBar.module.css';

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Fuse from 'fuse.js';
import Tooltip from '@mui/material/Tooltip';
export default function SearchBar({groupToSearch, setGroup, keys, threshold=0.5, toolTipTitle='', toolTipPlacement='bottom', searchTerm, setSearchTerm}){


    useEffect(() => {
        if(searchTerm===''){
            setGroup(groupToSearch);
            return;
        }

        const options = {
            includeScore: true,
            keys: keys,
            threshold: threshold
        };
        const fuse = new Fuse(groupToSearch, options);
        if(searchTerm.length > 0){
            const results = fuse.search(searchTerm).slice().sort((a, b) => a.score - b.score);
            setGroup(results.map(result => result.item));
        } else {
            setGroup([]);
        }
    }, [searchTerm, groupToSearch, keys, threshold]);

    return(
        <Tooltip title={toolTipTitle} placement={toolTipPlacement}>
             <div className={styles.searchBar}>
                <SearchOutlinedIcon className={styles.iconStyle} />
                <input 
                    type='text' 
                    value={searchTerm} 
                    onChange={(event)=>setSearchTerm(event.target.value)} 
                    className={styles.input}
                />
            </div>
        </Tooltip>
    )
}