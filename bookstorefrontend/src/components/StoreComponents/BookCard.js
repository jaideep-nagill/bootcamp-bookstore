import React, { useContext, useEffect, useState } from 'react';
import { BsBagFill, BsBag, BsBagX } from 'react-icons/bs';
import { Link } from "react-router-dom";
import { AppContext } from '../../context/AppContext';
import axios from 'axios';

const BookCard = ( { bookId, bookName, genre, slug, bookStock } ) => {
  bookId = parseInt( bookId );
  const [ inCart, setInCart ] = useState( false );
  const [ isMouseOver, setIsMouseOver ] = useState( false );
  const { cart, setCart, isAuthenticated, currentUser, imageHost } = useContext( AppContext );
  const [ imageUrl, setImageUrl ] = useState( "#" );

  const getImage = async () => {
    const imageData = await axios.get( `http://${ imageHost }/${ slug }` );

    setImageUrl( imageData.data.payload.url );
  };

  const handleClick = () => {
    let newCart;
    if ( bookId in cart ) {
      newCart = { ...cart };
      delete newCart[ bookId ];
      setCart( newCart );
      setInCart( false );
    } else {
      newCart = { ...cart };
      newCart[ bookId ] = 1;
      setCart( newCart );
      setInCart( true );
    }
    if ( isAuthenticated ) {
      localStorage.setItem( `${ currentUser.username }Cart`, JSON.stringify( { ...newCart } ) );
    } else {
      localStorage.setItem( `unsignedUserCart`, JSON.stringify( { ...newCart } ) );
    }
  };

  useEffect( () => {
    getImage();
  }, [] );

  useEffect( () => {

    if ( Object.keys( cart ).length > 0 )
      if ( bookId in cart )
        setInCart( true );
      else
        setInCart( false );

  }, [ cart ] );

  return (
    <div className='book-card' onMouseOver={ () => setIsMouseOver( true ) } onMouseOut={ () => setIsMouseOver( false ) } style={ { background: `url${ imageUrl } center center/cover no-repeat` } }>
      <Link to={ `/store/${ slug }` }  >
        <div className='book-img'>
          <img src={ imageUrl } alt="" />
        </div>
      </Link>
      <div className='book-card-info'>
        <div className="book-card-info-left">
          <p className="genres"><span className='genre'>{ genre[ 0 ] }</span></p>
          <h3>{ bookName }</h3>
        </div>
        <div className="book-card-info-right">
          <div className='add-to-cart-icon' onClick={ handleClick }>
            { bookStock > 0 ?
              (
                isMouseOver ? true : ( inCart ? <BsBagFill /> : false ) ) && ( inCart ? <BsBagFill /> : <BsBag />
              )
              :
              <BsBagX />
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;