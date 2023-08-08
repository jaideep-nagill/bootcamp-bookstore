import React, { useState, useContext, useEffect } from 'react';
import AddBook from './AddBook';
import DeleteBook from './DeleteBook';
import AllUsers from './AllUsers';
import GetAllOrders from './GetAllOrders';
import Protected from '../AuthenticatioinComponents/Protected';
import { AppContext } from '../../context/AppContext';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [ value, setValue ] = useState( -1 );
  const { role, setRole, setIsAuthenticated, setCart, currentUser, cart } = useContext( AppContext );
  const navigate = useNavigate();

  const signOut = () => {
    Cookies.remove( 'jwt_token' );
    Cookies.remove( 'user_role' );
    Cookies.remove( 'user_id' );
    if ( Object.keys( cart ).length > 0 )
      localStorage.setItem( `${ currentUser.username }Cart`, JSON.stringify( cart ) );
    console.log( localStorage.getItem( `${ currentUser.username }Cart` ) );
    setIsAuthenticated( false );
    setCart( {} );
    setRole( "" );
    navigate( "/signin" );
  };
  const arr = [
    <Protected><AddBook role={ role } /></Protected>,
    <Protected><DeleteBook role={ role } /></Protected>,
    <Protected><GetAllOrders /></Protected>
  ];
  if ( role === "admin" )
    arr.push( <Protected ><AllUsers /></Protected> );

  useEffect( () => {
    window.scrollTo( 0, 0 );
  }, [] );

  return (
    <div className="admin-container">
      <div className="button-container">
        <div className="sign-out button" onClick={ signOut }>Sign Out</div>
        { role !== 'buyer' && <div className="button" onClick={ () => setValue( 0 ) }>add book</div>
        }
        { role !== 'buyer' && <div className="button" onClick={ () => setValue( 1 ) }>delete book</div>
        }
        <div className="button" onClick={ () => setValue( 2 ) }>all orders</div>
        { role === "admin" && <div className="button" onClick={ () => setValue( 3 ) }>all users</div> }
      </div>
      <div className="welcome-border"></div>
      <div className="admin-view">
        { value >= 0 && arr[ value ] }
      </div>
    </div>
  );
};

export default Admin;