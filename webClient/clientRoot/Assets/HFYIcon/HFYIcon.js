import React from 'react';
import HFYIcoWhite from './icon_white_transparentbackground.ico';
import HFYIcoPurple from './icon_purple_transparentbackground.ico';
import PropTypes from 'prop-types';


export default function HFYIcon({dimension = '24px', color = 'white'}) {
    const source = color === 'white' ? HFYIcoWhite : HFYIcoPurple;
    return (
       
      <img src={source} alt="HFY Icon" style={{widht:dimension, height: dimension}} />
  );    
}

HFYIcon.propTypes = {
    dimension: PropTypes.string,
    color: PropTypes.oneOf(['white', 'purple'])
};