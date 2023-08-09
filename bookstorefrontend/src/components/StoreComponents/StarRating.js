import axios from 'axios';
import { useState, useEffect } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';


const StarRating = ( { bookId, bookRating, bookSale } ) => {
  const [ rating, setRating ] = useState( 0 );
  const [ hover, setHover ] = useState( 0 );
  const { isAuthenticated, host } = useContext( AppContext );

  const setNewRating = async () => {
    if ( !isAuthenticated ) return;
    if ( rating !== 0 ) {
      let totalRating = parseInt( ( ( bookRating * bookSale ) + rating ) / ( bookSale + 1 ) * 10 ) / 10;
      await axios.patch( `http://${ host }/api/book/${ bookId }/`,
        { rating: totalRating } );
    };
  };

  useEffect( () => {
    setNewRating();
  }
    , [ rating ] );

  return (
    <div className="star-rating">
      { [ ...Array( 5 ) ].map( ( star, index ) => {
        index += 1;
        return (
          <button
            type="button"
            key={ index }
            className={ index <= ( hover || rating ) ? "on" : "off" }
            onClick={ () => setRating( index ) }
            onMouseEnter={ () => setHover( index ) }
            onMouseLeave={ () => {
              setHover( rating );
            } }
          >
            <span className="star">{
              index <= ( hover || rating ) ?
                <AiFillStar /> :
                <AiOutlineStar />
            }
            </span>
          </button>
        );
      } ) }
    </div>
  );
};


export default StarRating;