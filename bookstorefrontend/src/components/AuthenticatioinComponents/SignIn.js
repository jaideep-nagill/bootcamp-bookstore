import axios from 'axios';
import LoginForm from './LoginForm';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import Cookies from 'js-cookie';

const SignIn = () => {
  const { setRole, setIsAuthenticated, getUser, host } = useContext( AppContext );

  const onSubmit = async ( data ) => {
    try {
      await axios.post(
        `http://${ host }/api/user/sign-in/`,
        data,
        { 'withCredentials': true }
      );
      console.log( "called" );
      setIsAuthenticated( true );
      getUser();
      setRole( Cookies.get( 'user_role' ) );
    } catch ( err ) {
      console.log( err );
    };
  };

  useEffect( () => {
    window.scrollTo( 0, 0 );
  }, [] );

  return (
    <div className="signin">

      <div className="signin-container">
        <LoginForm sendCredentials={ onSubmit } />
      </div>
    </div>
  );
};

export default SignIn;