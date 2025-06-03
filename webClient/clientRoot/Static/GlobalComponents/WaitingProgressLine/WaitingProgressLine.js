import React from 'react';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

export default function WaitingProgressLine(){
    return (
      <div style={{width: '100%', height: '8px'}}>
          <BorderLinearProgress />
      </div>
    )
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 7,
    borderRadius: 3,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor:  'var(--background-dark)',
      borderColor: 'var(--border-medium)',
    },
}));