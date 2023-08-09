import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import StarRating from './StarRating';

const BookDetails = ( props ) => {
  const [ bookDetails, setBookDetails ] = useState( {} );
  const [ imageUrl, setImageUrl ] = useState( "#" );
  const { slug } = useParams();
  const { isAuthenticated, host, imageHost } = useContext( AppContext );

  const getImage = async () => {
    const imageData = await axios.get( `http://${ imageHost }/${ slug }` );
    setImageUrl( imageData.data.payload.url );
  };

  const getBookDetails = async function ( slug ) {
    const details = await axios.get( `http://${ host }/api/book/${ slug }/` ).catch( err => console.log( err ) );
    setBookDetails( details.data.payload );
  };

  useEffect( () => {
    getBookDetails( slug );
    getImage();
  }, [] );

  return (
    <div className='book-detail-container'>
      <div className="book-detail">
        <div className="book-detail-img">
          <img src={ imageUrl } alt="book-img" />
          <StarRating bookId={ bookDetails.id } bookRating={ bookDetails.rating } bookSale={ bookDetails.sale } />
        </div>
        <div className="book-info">
          <h2>Title: { bookDetails.title }</h2>
          <h2>Author: { bookDetails.author }</h2>
          <h2>Genre: { bookDetails.genre && bookDetails.genre.join( ", " ) }</h2>
          <h2>Publishers: { bookDetails.publisher }</h2>
          <h2>Rating: { bookDetails.rating } / 5</h2>
          <h2>Price: { bookDetails.price }</h2>
          <h2>Summary: { bookDetails.description }</h2>
        </div>
      </div>
      {
        isAuthenticated &&
        <div className="free-page-container">
          <div className="free-page">
            <h1>Free Pages</h1>

            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis expedita unde nostrum, et perspiciatis illum sint nisi, cumque incidunt dolorem esse veritatis praesentium doloremque, rem id quo quibusdam harum quas?</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis expedita unde nostrum, et perspiciatis illum sint nisi, cumque incidunt dolorem esse veritatis praesentium doloremque, rem id quo quibusdam harum quas?</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis expedita unde nostrum, et perspiciatis illum sint nisi, cumque incidunt dolorem esse veritatis praesentium doloremque, rem id quo quibusdam harum quas?</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis expedita unde nostrum, et perspiciatis illum sint nisi, cumque incidunt dolorem esse veritatis praesentium doloremque, rem id quo quibusdam harum quas?</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis expedita unde nostrum, et perspiciatis illum sint nisi, cumque incidunt dolorem esse veritatis praesentium doloremque, rem id quo quibusdam harum quas?</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis expedita unde nostrum, et perspiciatis illum sint nisi, cumque incidunt dolorem esse veritatis praesentium doloremque, rem id quo quibusdam harum quas?</p>
          </div>
        </div>

      }
    </div>
  );
};

export default BookDetails;