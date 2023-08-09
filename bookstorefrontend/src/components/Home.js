import { useState, useEffect, useContext } from "react";
import axios from "axios";
import BookCard from "./StoreComponents/BookCard";
import { createSlug } from "../utils";
import { AppContext } from "../context/AppContext";

function Home () {
  const [ topFive, setTopFive ] = useState( [] );
  const [ recentlyAdded, setRecentlyAdded ] = useState( [] );
  const { host } = useContext( AppContext );

  const getTopFive = async () => {
    const data = await axios.get( `http://${ host }/api/book/top-five-rated` )
      .then( res => res.data.payload )
      .catch( err => console.log( err ) );
    setTopFive( data );
  };
  const getRecentlyAdded = async () => {
    const data = await axios.get( `http://${ host }/api/book/recently-added` )
      .then( res => res.data.payload )
      .catch( err => console.log( err ) );
    setRecentlyAdded( data );
  };
  const bookQuotesArr = [

    {
      'Frank Zappa': 'So many books, so little time.',
      ' Marcus Tullius Cicero': 'A room without books is like a body without a soul.'
    },
    { 'Jane Austen, Northanger Abbey': 'The person, be it gentleman or lady, who has not pleasure in a good novel, must be intolerably stupid.' },
    { 'Mark Twain': 'Good friends, good books, and a sleepy conscience: this is the ideal life.' },
    { 'Neil Gaiman, Coraline': 'Fairy tales are more than true: not because they tell us that dragons exist, but because they tell us that dragons can be beaten' },
    { 'Groucho Marx, The Essential Groucho: Writings For By And About': 'Outside of a dog, a book is man\'s best friend.Inside of a dog it\'s too dark to read.' },
    { 'Haruki Murakami, Norwegian Wood': 'If you only read the books that everyone else is reading, you can only think what everyone else is thinking.' },
    { 'Jorge Luis Borges': 'I have always imagined that Paradise will be a kind of library.' },
    { 'Lemony Snicket, Horseradish: Bitter Truths You Can\'t Avoid': 'Never trust anyone who has not brought a book with them.' },
    { 'C.S. Lewis': 'You can never get a cup of tea large enough or a book long enough to suit me.' },
    { 'Oscar Wilde': 'If one cannot enjoy reading a book over and over again, there is no use in reading it at all.' },
    { 'Ernest Hemingway': 'There is no friend as loyal as a book.' }
  ];


  const showQuote = ( obj ) => {
    let key, value;
    [ [ key, value ] ] = Object.entries( obj );
    return (
      <div>
        <h3 className="quote">{ value }</h3>
        <h3 className="quote-author"> — { key }</h3>
      </div>
    );
  };

  useEffect( () => {
    getTopFive();
    getRecentlyAdded();
    window.scrollTo( 0, 0 );
  }, [] );
  return (
    <div className="Home">
      <div className="home-intro">
        <h1>Get all of your favourite books on one platform... </h1>
        <div className="welcome-border"></div>
        { showQuote( bookQuotesArr[ parseInt( bookQuotesArr.length * Math.random() ) ] ) }
      </div>
      {/* <hr /> */ }
      <div className="top-five-rated">
        <div className="title">
          <h1>Top</h1>
          <h1>Rated</h1>
        </div>
        {
          topFive.map( ( book, idx ) => {
            const slug = createSlug( book.title );
            book[ 'slug' ] = slug;
            return (

              <BookCard key={ idx } bookId={ book.id } bookName={ book.title } genre={ book.genre } slug={ slug } bookPrice={ book.price } bookStock={ book.stock } />
            );
          } )
        }
      </div>
      {/* <hr /> */ }
      <div className="recently-added">
        <div className="title">
          <h1>Recently</h1>
          <h1>Added</h1>
        </div>
        {
          recentlyAdded.map( ( book, idx ) => {
            const slug = createSlug( book.title );
            book[ 'slug' ] = slug;
            return (

              <BookCard key={ idx } bookId={ book.id } bookName={ book.title } genre={ book.genre } slug={ slug } bookPrice={ book.price } bookStock={ book.stock } />
            );
          } )
        }
      </div>
    </div>
  );
};

export default Home;
