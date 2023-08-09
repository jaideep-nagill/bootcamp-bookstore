import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CartItemCard from './CartItemCard';
import { useNavigate } from 'react-router-dom';



function Cart () {
  const { cart, setCart, totalAmount, setTotalAmount, isAuthenticated, currentUser, host } = useContext( AppContext );
  const [ cartItems, setCartItems ] = useState( [] );
  const navigate = useNavigate();


  const performTransaction = async () => {
    console.log( isAuthenticated );
    if ( !isAuthenticated ) navigate( "/signin" );
    cartItems.map( async ( book ) => {
      if ( book.id in cart )
        await axios.patch( `http://${ host }/api/book/${ book.id }/`,
          {
            sale: book.sale + cart[ book.id ],
            stock: book.stock - cart[ book.id ]
          } );
    } );
    let books = [];

    let key, value;
    for ( [ key, value ] of Object.entries( cart ) ) {
      books.push( { id: key, qty: value } );
    }

    await axios.post( `http://${ host }/api/order`,
      {
        user: currentUser.id,
        books: books
      }
    );
    setCart( {} );

    localStorage.removeItem( `${ currentUser.username }Cart` );

    setCartItems( {} );
  };

  let amount = 0;

  const getCartItmes = async () => {
    const ids = Object.keys( cart ).map( id => parseInt( id ) );

    const items = await axios( {
      method: 'post',
      url: `http://${ host }/api/book/`,
      data: {
        cart: ids
      }
    } )
      .then( res => res.data.payload )
      .catch( err => console.log( err ) );

    setCartItems( items );
  };

  useEffect( () => {
    getCartItmes();
    window.scrollTo( 0, 0 );
  }, [ cart ] );

  const sadKaomoji = [ "(◞‸◟；)", "o(╥﹏╥)o", "ꃋᴖꃋ", "( ;´ - `;)", "(｡•́︿•̀｡) ", "๐·°(⋟﹏⋞)°·๐", "˚‧º·(˚ ˃̣̣̥᷄⌓˂̣̣̥᷅ )‧º·˚" ];
  return (
    <div className="cart-background">

      <div className="cart-container">
        <div className="cart">
          <div className="cart-item-container">
            <h1>Your Cart:</h1>
            <div className="welcome-border"></div>
            {
              (
                Object.keys( cart ).length === 0 ?
                  <div>
                    <h2>
                      Empty Cart!! &nbsp; &nbsp; &nbsp;
                      <span style={ { fontSize: "3rem" } }>
                        { sadKaomoji[ parseInt( sadKaomoji.length * Math.random() ) ] }
                      </span>
                    </h2>
                  </div>
                  :
                  cartItems?.map( ( book, idx ) => {
                    if ( String( book.id ) in cart ) amount += cart[ book.id ] * book.price;
                    return <CartItemCard key={ idx } bookId={ book.id } bookTitle={ book.title } bookPrice={ book.price } slug={ book.slug } />;
                  } )
              )
            }
            { setTotalAmount( amount ) }
            {
              Object.keys( cart ).length > 0 &&
              <div className="cart-amount-container" onClick={
                performTransaction
              }>
                <span className='cart-amount' >
                  Proceed to buy: { totalAmount }
                </span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
