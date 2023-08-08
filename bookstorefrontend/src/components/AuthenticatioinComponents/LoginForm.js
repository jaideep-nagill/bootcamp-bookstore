import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";

const LoginForm = ( { sendCredentials } ) => {
  const { register, handleSubmit } = useForm();
  return (
    <div className='login-form'>
      <h1>Sign in</h1>
      <form onSubmit={ handleSubmit( sendCredentials ) }>
        <div >
          <label htmlFor="username">Username: </label>
          <input type="text" id="username" name="username" { ...register( "username", { required: true } ) } />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input type="password" id="password" name="password"{ ...register( "password", { required: true } ) } />
        </div>
        <div>
          <input type="submit" className="signin-submit" />
        </div>
      </form>
      <p>Don't have an account { <Link to="/signup">create new account..</Link> }</p>
    </div >
  );
};

export default LoginForm;