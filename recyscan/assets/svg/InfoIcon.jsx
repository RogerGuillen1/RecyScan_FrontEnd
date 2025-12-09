import React from 'react';
import Svg, { Path } from 'react-native-svg';

const InfoCircleIcon = ({ width = 48, height = 48, color = '#fff' }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 512 512"
      fill="none"
    >
      <Path
        d="M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM224 160a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm-8 64l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"
        fill={color}
      />
    </Svg>
  );
};

export default InfoCircleIcon;
