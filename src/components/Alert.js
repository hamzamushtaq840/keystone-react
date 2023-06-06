// CustomAlert.js
import React from 'react';
import AlertErrorIcon from '../assets/AlertErrorIcon.png';
import AlertSuccessIcon from '../assets/AlertSuccessIcon.png';

const Alert = ({ message, show, type, onClose }) => {
  if (!show) {
    return null;
  }

  const alertClasses = {
    success: 'alert_success',
    fail: 'alert_fail text-red-500',
  };
  const messageHead = type === "success" ? "Success" : "Error";
  return (
    <div className={`alert p-4 rounded-lg inline-block shadow-md ${alertClasses[type]}`}>

      <div className="flex items-center">
        {/* <p className="flex-grow">{message}</p> */}
        <img src={type === "success" ? AlertSuccessIcon : AlertErrorIcon} />        <div className='flex flex-col ml-5'>
          <p className={`font-semibold ${type === "success" ? "text-primarytext" : "alert_text"}`}>{messageHead}</p>

          <p className={`flex-grow${type === "success" ? "text-primarytext" : "alert_text"}`}>{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white ml-3 hover:text-gray-200">
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
