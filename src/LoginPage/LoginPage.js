import React from 'react';
import LoginForm from '../LoginForm/LoginForm';
import './LoginPage.css';

const LoginPage = (props) => {
  return (
    <div className='LoginPage'>
      <LoginForm 
        history={props.history}
        handleLogin={props.handleLogin}
      />
    </div>
  );
};

export default LoginPage;