import React from 'react';
import '../../assets/css/Alert.css';



const Alert = ({ message, type }) => {
  const alertType = type === 'error' ? 'alert-error' : 'alert-success';

  return (
    <div className={`alert ${alertType}`}>
      <p>{message}</p>
    </div>
  );
};

export default Alert;
