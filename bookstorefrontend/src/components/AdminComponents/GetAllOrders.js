import React from 'react';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const GetAllOrders = () => {
  const [ orders, setOrders ] = useState( [] );
  const { currentUser, role, host } = useContext( AppContext );

  const getOrderLog = async () => {
    const url = `http://${ host }/api/order` + ( role === 'buyer' ? `/${ currentUser.id }/` : "" );
    const response = await axios.get( url ).then( res => res.data.payload );
    setOrders( response );
  };

  useEffect( () => {
    getOrderLog();
    window.scrollTo( 0, 0 );
  }, [] );

  return (
    <div className="all-orders">
      {
        orders?.map( ( order, idx ) => {
          return (
            <div className="order-entry" key={ idx }>
              <div className='order-info'>
                <h3>Order id: { `${ order.id }` }</h3>
                <h3>User id: { `${ order.user }` }</h3>
                <h3>Amount: { `${ order.total_amount }` }</h3>
              </div>
              <div className="order-books">
                <h3>Items:</h3>
                {
                  order.books?.map( ( book, idx ) => {
                    return <h4 key={ idx } >{ `bookId: ${ book.id } || qty: ${ book.book_qty } || amount: ${ book.amount }` }</h4>;
                  } )
                }
              </div>
            </div>
          );
        } )
      }
    </div>
  );
};

export default GetAllOrders;