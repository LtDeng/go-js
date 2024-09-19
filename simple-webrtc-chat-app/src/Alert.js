import React from 'react';

const Alert = (props) => {
  return (
    <div className='alert alert-primary' role='alert'>
      <div>
        <h1>{props.title}</h1>
        <hr />
        <p>{props.children}</p>
        <button onClick={props.onClose}>Close</button>
      </div>
    </div>
  );
};

export default Alert;
