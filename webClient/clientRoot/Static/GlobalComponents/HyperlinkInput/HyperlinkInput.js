import React from 'react'

import styles from './Hyperlink.module.css';

export default function TextInput({inputValue, color, width, href}){
    const textColor = color || 'blue';
    const inputWidth = width || '100%';
    href = href || inputValue;

    if(href && !href.includes('https://')){
        href = 'https://' + href;
    }

    return(
      <a
        href={href}
        target="_blank" // Ensures the link opens in a new tab
        rel="noopener noreferrer" // Improves security by preventing referrer leaks
        className={styles.textInput}
        style={{
          color: textColor,
          width: inputWidth,
          textDecoration: 'none', // Optional styling
          pointerEvents: 'auto',
          cursor:  href ? 'pointer' : 'default',
        }}
      >
        {inputValue}
      </a>
    )
}