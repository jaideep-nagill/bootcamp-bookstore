import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const DeleteBook = () => {
  const [ bookId, setBookId ] = useState( 0 );
  const [ showForm, setShowForm ] = useState( false );
  const [ title, setTitle ] = useState( "" );
  const [ price, setPrice ] = useState( 0.0 );
  const [ description, setDescription ] = useState( "" );
  const [ publisher, setPublisher ] = useState( "" );
  const [ rating, setRating ] = useState( 0.0 );
  const [ sale, setSale ] = useState( 0 );
  const [ stock, setStock ] = useState( 0 );
  const [ author, setAuthor ] = useState( "" );
  const [ genre, setGenre ] = useState( [] );
  const [ authors, setAuthors ] = useState( [] );
  const [ genres, setGenres ] = useState( [] );
  const { host } = useContext( AppContext );
  const getAllAuthors = async () => {
    const all_authors = await axios.get( `http://${ host }/api/user/get-all-author` ).then( res => res.data.payload );
    setAuthors( all_authors );
  };

  const getAllGenres = async () => {
    const all_genres = await axios.get( `http://${ host }/api/user/get-all-genres` ).then( res => res.data.payload );
    setGenres( all_genres );
  };

  const getBook = async () => {
    const book = await axios
      .get( `http://${ host }/api/book/${ bookId }/` )
      .then( res => res.data.payload )
      .catch( err => console.log( err ) );

    if ( !book ) return;
    console.log( book );
    setTitle( book.title );
    setPrice( book.price );
    setDescription( book.description );
    setPublisher( book.publisher );
    setRating( book.rating );
    setSale( book.sale );
    setStock( book.stock );
    setAuthor( book.author );
    setGenre( book.genre );
    setShowForm( true );

  };

  const deleteBook = async () => {
    await axios.delete( `http://${ host }/api/book/${ bookId }/` );
    setShowForm( false );
  };

  const updateBook = async () => {
    await axios.patch( `http://${ host }/api/book/${ bookId }/`,
      {
        title,
        price,
        description,
        publisher,
        rating,
        sale,
        stock,
        author,
        genre,
      } );
    setShowForm( false );
  };
  useEffect( () => {
    window.scrollTo( 0, 0 );
    getAllAuthors();
    getAllGenres();
  }, [ showForm ] );

  return (
    <div className="admin-delete">
      <div className="admin-delete-container">
        <label htmlFor="id">
          Book Id:
        </label>
        <input type="number" name="id" id="id" value={ bookId } onChange={ ( e ) => setBookId( e.target.value ) } min={ 0 } />
        <button className='button' onClick={ getBook }>Get Book</button>
        <div>
          {
            showForm
            &&
            <form >
              <div>
                <label htmlFor="title">Title: </label>
                <input type="text" name="title" id="title" value={ title } onChange={ ( e ) => setTitle( e.target.value ) } />
              </div>
              <div>
                <label htmlFor="price">Price: </label>
                <input type="number" step="0.1" name="price" value={ price } onChange={ ( e ) => setPrice( e.target.value ) } />
              </div>
              <div>
                <label htmlFor="description">Description: </label>
                <input type="text" name="description" id="description" value={ description } onChange={ ( e ) => setDescription( e.target.value ) } />
              </div>
              <div>
                <label htmlFor="publisher">Publisher: </label>
                <input type="text" name="publisher" id="publisher" value={ publisher } onChange={ ( e ) => setPublisher( e.target.value ) } />
              </div>
              <div>
                <label htmlFor="rating">Rating: </label>
                <input type="number" step="0.1" name="rating" value={ rating } onChange={ ( e ) => setRating( e.target.value ) } />
              </div>
              <div>
                <label htmlFor="sale">Sale: </label>
                <input type="number" name="sale" value={ sale } onChange={ ( e ) => setSale( e.target.value ) } />
              </div>
              <div>
                <label htmlFor="stock">Stock: </label>
                <input type="number" name="stock" value={ stock } onChange={ ( e ) => setStock( e.target.value ) } />
              </div>
              <div>
                <label htmlFor="author">Author: </label>
                <select name="authors" id="authors" onChange={ ( e ) => setAuthor( e.target.value ) } value={ author } >
                  {
                    authors.map( ( item, idx ) => {
                      return <option key={ idx } value={ item.name }
                      >{ item.name }</option>;
                    } )
                  }
                </select>
              </div>
              <div>
                <label htmlFor="genres">Genres: </label>
                <select name="genres" id="genres" multiple={ true } onChange={ ( e ) => setGenre( e.target.value ) } value={ genre }>
                  {
                    genres.map( ( item, idx ) => {
                      return <option key={ idx } value={ item.genre_name }
                      >{ item.genre_name }</option>;
                    } )
                  }
                </select>
              </div>
            </form>
          }
        </div>
        <div><button className='button' onClick={ updateBook }>Update</button> <button className='button' onClick={ deleteBook }>Delete</button></div>
      </div>
    </div >
  );
};

export default DeleteBook;