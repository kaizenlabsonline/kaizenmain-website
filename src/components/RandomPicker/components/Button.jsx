import React from 'react';

import PropTypes from 'prop-types';

const Button = ({
  onClick,
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  title
}) => {
  const baseStyle = "w-full px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg";
  
  // Updated offset color to match new card background (e.g., neutral-800 or neutral-900)
  const focusRingOffsetColor = 'focus:ring-offset-neutral-900'; 

  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle = `bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 ${disabled ? 'bg-blue-800 opacity-60 cursor-not-allowed' : ''}`;
      break;
    case 'secondary':
      variantStyle = `bg-neutral-700 hover:bg-neutral-600 focus:ring-neutral-500 ${disabled ? 'bg-neutral-800 opacity-60 cursor-not-allowed' : ''}`;
      break;
    default:
      variantStyle = `bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 ${disabled ? 'bg-blue-800 opacity-60 cursor-not-allowed' : ''}`;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${focusRingOffsetColor} ${className} transform hover:scale-105 active:scale-95`}
      title={title}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  title: PropTypes.string,
};

export default Button;