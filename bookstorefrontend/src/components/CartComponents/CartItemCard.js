import React, { useEffect } from 'react';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const CartItemCard = ( { bookId, bookTitle, bookPrice, slug } ) => {
  const { cart, setCart, isAuthenticated, currentUser, imageHost } = useContext( AppContext );
  const [ imageUrl, setImageUrl ] = useState( "#" );

  const navigate = useNavigate();

  const handleClickNeg = () => {
    let newCart = { ...cart };
    if ( bookId in cart )
      newCart[ bookId ] = newCart[ bookId ] - 1;
    if ( newCart[ bookId ] === 0 ) {
      delete newCart[ bookId ];
    }
    setCart( newCart );
    if ( isAuthenticated ) {
      localStorage.setItem( `${ currentUser.username }Cart`, JSON.stringify( newCart ) );
    } else {
      localStorage.setItem( `unsignedUserCart`, JSON.stringify( newCart ) );
    }
  };

  const getImage = async () => {
    const imageData = await axios.get( `http://${ imageHost }/${ slug }` );

    setImageUrl( imageData.data.payload.url );
  };

  const handleClickPos = () => {
    let newCart = { ...cart };
    if ( bookId in cart ) {
      newCart[ bookId ] = newCart[ bookId ] + 1;
    } else {
      newCart[ bookId ] = 1;
    }
    setCart( newCart );

    if ( isAuthenticated ) {
      localStorage.setItem( `${ currentUser.username }Cart`, JSON.stringify( newCart ) );
    } else {
      localStorage.setItem( `unsignedUserCart`, JSON.stringify( newCart ) );
    }
  };

  useEffect( () => {
    getImage();
  }, [] );

  return (
    <div className="cart-item-card">
      <div className="cart-item-card-left">
        <div className="img">
          <img src={ imageUrl } alt="book img" />
        </div>
        <div className="title">
          <div onClick={ () => navigate( `/store/${ slug }` ) }>
            { bookTitle }

          </div>
        </div>
      </div>
      <div className="cart-item-card-right">

        <div className="qty">
          <button onClick={ handleClickNeg }>-</button>
          &nbsp; { cart[ bookId ] || 0 } &nbsp;
          <button onClick={ handleClickPos }>+</button>
        </div>
        <div className="price">Price: { bookPrice } x { cart[ bookId ] || 0 }</div>
      </div>
    </div>
  );
};

export default CartItemCard;