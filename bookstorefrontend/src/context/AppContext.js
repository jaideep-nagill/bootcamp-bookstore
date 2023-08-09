import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const AppContext = createContext();
export const AppContextProvider = props => {
  const [ books, setBooks ] = useState( [] );
  const [ cart, setCart ] = useState( {} );
  const [ totalAmount, setTotalAmount ] = useState( 0 );
  const [ showSearch, setShowSearch ] = useState( false );
  const [ isAuthenticated, setIsAuthenticated ] = useState( false );
  const [ role, setRole ] = useState( "" );
  const [ currentUser, setCurrentUser ] = useState( {} );

  const host = '13.126.41.53:8000';
  const imageHost = '13.126.41.53:8080';


  const authorize = async () => {
    try {
      if ( Cookies.get( 'user_role' ) !== undefined ) {

        const response = await axios.get( `http://${ host }/api/user/authorization`, {
          'withCredentials': true
        } );
        if ( response.status === 200 ) {
          setIsAuthenticated( true );
          setRole( Cookies.get( 'user_role', "" ) );


        }
      }
    } catch ( err ) {
      console.log( err );
      localStorage.setItem( 'unsignedUserCart', {} );

    }
  };

  const getCartFromLocal = () => {
    const prevGuestCart = localStorage?.getItem( `unsignedUserCart` );

    if ( prevGuestCart ) {
      setCart( { ...JSON.parse( prevGuestCart ) } );
    }
  };

  const getUser = async () => {
    const user_id = Cookies.get( 'user_id' );

    if ( user_id === undefined ) return;
    const response = await axios.get(
      `http://${ host }/api/user/get-user/${ user_id }/`
    );

    setCurrentUser( response.data.payload );
    console.log( response.data.payload );
    const prevUserCart = localStorage?.getItem(
      `${ response.data.payload.username }Cart`
    );
    if ( prevUserCart ) {
      setCart( { ...JSON.parse( prevUserCart ) } );
      return;
    }

    const prevGuestCart = localStorage?.getItem( `unsignedUserCart` );

    if ( prevGuestCart ) {
      setCart( { ...JSON.parse( prevGuestCart ) } );
      localStorage.setItem( `${ currentUser.username }Cart`, JSON.stringify( prevGuestCart ) );
      localStorage.removeItem( `unsignedUserCart` );
    }
  };

  useEffect( () => {
    authorize();
    getCartFromLocal();
    getUser();
  }, [ isAuthenticated ] );

  return (
    <AppContext.Provider value={ {
      books,
      setBooks,
      cart,
      setCart,
      totalAmount,
      setTotalAmount,
      showSearch,
      setShowSearch,
      isAuthenticated,
      setIsAuthenticated,
      role,
      setRole,
      currentUser,
      setCurrentUser,
      getUser,
      host,
      imageHost
    } }>
      { props.children }
    </AppContext.Provider>
  );
};