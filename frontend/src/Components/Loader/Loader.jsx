import React from 'react';
import '../../Styles/components/Loader.scss';

const Loader = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
  const spinnerSize = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  }[size];

  const loaderContent = (
    <div className="loader-content">
      <div className={`spinner-border ${spinnerSize} text-primary`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader; 