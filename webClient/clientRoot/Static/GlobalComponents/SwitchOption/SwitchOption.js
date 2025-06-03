import React from 'react';
import styles from './SwitchOption.module.css';
import Switch from '@mui/material/Switch';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function SwitchOption({checked, onChange, name='checked', color='primary', disabled=false}){

    const theme = createTheme({
      components: {
        MuiSwitch: {
          styleOverrides: {
            colorPrimary: {
              '&.Mui-checked': {
                color: 'var(--background-dark)',
              },
              '&.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: 'var(--background-dark)',
              },
            },
          }
        }
      }
    });

      return(
        <ThemeProvider theme={theme}>
          <div className={styles.linkBox}>
            <Switch
              checked={checked}
              onChange={onChange}
              name={name}
              color={color}
              disabled={disabled}
            />
          </div>    
        </ThemeProvider>
      )
  }