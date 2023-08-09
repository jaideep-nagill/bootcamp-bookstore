import BookCard from "../StoreComponents/BookCard";
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from "../../context/AppContext";
import { createSlug } from "../../utils";


function Store () {
  const { register, handleSubmit } = useForm();
  const { books, setBooks, showSearch, setShowSearch, host } = useContext( AppContext );
  const [ authors, setAuthors ] = useState( [] );
  const [ genres, setGenres ] = useState( [] );
  const [ showGenre, setShowGenre ] = useState( false );

  const getAllBooks = async () => {
    const all_books = await axios.get( `http://${ host }/api/book/` ).then( res => res.data.payload );
    setBooks( all_books );
  };

  const getAllAuthors = async () => {
    const all_authors = await axios.get( `http://${ host }/api/user/get-all-author` ).then( res => res.data.payload );
    setAuthors( all_authors );
  };

  const getAllGenres = async () => {
    const all_genres = await axios.get( `http://${ host }/api/user/get-all-genres` ).then( res => res.data.payload );
    setGenres( all_genres );
  };

  const onSubmit = async ( data ) => {
    console.log( data );
    data.title = data.title.toLowerCase();
    if ( 'genres' in data )
      data.genres = data.genres.join( "," );

    if ( data.title === "" && data.genres === "" && data.author === "" ) return;

    let arr = [];
    if ( 'title' in data && data.title !== "" )
      arr.push( `title = ${ data.title }` );
    if ( 'author' in data && data.author !== "" && data.author !== "-- Search Author --" )
      arr.push( `author = ${ data.author }` );
    if ( 'genres' in data && data.genres !== "" )
      arr.push( `genres = ${ data.genres }` );
    const queryString = ( `http:;//${ host }/api/book/search?` + arr.join( "&" ) );
    const searchedBooks = await axios
      .get( queryString )
      .then( res => res.data.payload )
      .catch( err => console.log( err ) );

    setShowSearch( true );
    setBooks( searchedBooks );
  };

  const handleClick = () => {

    setShowSearch( false );
  };
  useEffect( () => {

    getAllAuthors();
    getAllGenres();
    window.scrollTo( 0, 0 );
    if ( !showSearch ) getAllBooks();
  }, [ showSearch ] );

  return (
    <div className="store">
      <div className="search-container">
        <form onSubmit={ handleSubmit( onSubmit ) }>
          <div className="search-up">
            <input className="title-input" type="text" placeholder="Search book title" minLength={ 3 } name="title" id="title" { ...register( "title" ) } />
            <select name="author" id="author" { ...register( "author" ) }>
              {
                [
                  <option selected="selected" key={ 0 } disabled="true">-- Search Author --</option>,
                  ...( authors.map( ( author, idx ) => {
                    return <option key={ idx + 1 } value={ author.name }>{ author.name }</option>;
                  } ) )
                ]
              }
            </select>
          </div>
          <div className="search-down">
            <button className="button" onClick={ ( e ) => { e.preventDefault(); setShowGenre( !showGenre ); } }>Genre</button>
            <div>
              {
                showGenre &&

                <select name="genres" id="genres" multiple={ true } { ...register( "genres" ) }>
                  {
                    genres.map( ( genre, idx ) => {
                      return <option key={ idx } value={ genre.genre_name }>{ genre.genre_name }</option>;
                    } )
                  }
                </select>
              }
            </div>
            <div>
              <button className="button">Search</button>
              <button className="button" onClick={ handleClick }>Clear</button>
            </div>
          </div>
        </form>
      </div>
      <div className="welcome-border"></div>
      <div className="catalogue">
        <div className="catalogue-container">
          {
            books.map( ( book, idx ) => {
              const slug = createSlug( book.title );
              book[ 'slug' ] = slug;
              return (

                <BookCard key={ idx } bookId={ book.id } bookName={ book.title } genre={ book.genre } slug={ slug } bookPrice={ book.price } bookStock={ book.stock } />
              );
            }
            )
          }
        </div>
      </div>
    </div >
  );
};

export default Store;
