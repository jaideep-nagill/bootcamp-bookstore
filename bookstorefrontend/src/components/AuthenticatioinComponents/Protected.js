import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';


const Protected = ( { children } ) => {
  const { isAuthenticated } = useContext( AppContext );
  const navigate = useNavigate();


  if ( isAuthenticated )
    return children;
  else {
    navigate( "/signin" );
  }
};

export default Protected;