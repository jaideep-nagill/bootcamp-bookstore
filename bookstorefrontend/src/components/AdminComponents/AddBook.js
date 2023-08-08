import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { createSlug } from '../../utils';

const AddBook = ( { role } ) => {
  const { register, handleSubmit } = useForm();
  const [ genres, setGenres ] = useState( [] );
  const [ authors, setAuthors ] = useState( [] );
  const [ file, setFile ] = useState();
  const [ slug, setSlug ] = useState( "" );

  const submit = async event => {
    event.preventDefault();

    const formData = new FormData();
    formData.append( "image", file );
    formData.append( "imageName", slug );
    formData.append( "user_role", role );
    await axios.post( "http://localhost:8000/", formData, { headers: { 'Content-Type': 'multipart/form-data' } } );
  };

  const onSubmit = async ( data ) => {
    console.log( data );

    let key, value;
    for ( [ key, value ] of Object.entries( data ) ) {
      console.log( key, value );
      if ( value === "" )
        delete data[ key ];
    }
    console.log( data );
    if ( 'price' in data ) data[ 'price' ] = parseFloat( data[ 'price' ] );
    if ( 'rating' in data ) data.rating = parseFloat( data.rating );

    await axios.post( "http://localhost:8000/api/book/", data );

    setSlug( createSlug( data[ 'title' ] ) );

  };

  const getAllAuthors = async () => {
    const all_authors = await axios.get( "http://localhost:8000/api/user/get-all-author" ).then( res => res.data.payload );
    setAuthors( all_authors );
  };

  const getAllGenres = async () => {
    const all_genres = await axios.get( "http://localhost:8000/api/user/get-all-genres" ).then( res => res.data.payload );
    setGenres( all_genres );
  };

  useEffect( () => {
    window.scrollTo( 0, 0 );
    getAllAuthors();
    getAllGenres();
  }, [] );
  return (
    <div className="add-book">
      <div className='add-book-container'>
        <h2>Book Details </h2>
        <form onSubmit={ handleSubmit( onSubmit ) }>
          <div>
            <label htmlFor="title">Title: </label>
            <input type="text" name="title" id="title" required { ...register( "title", { required: true } ) } />
          </div>
          <div>
            <label htmlFor="price">Price: </label>
            <input type="number" step="0.1" name="price" required { ...register( "price", { required: true } ) } />
          </div>
          <div>
            <label htmlFor="description">Description: </label>
            <input type="text" name="description" id="description" { ...register( "description" ) } />
          </div>
          <div>
            <label htmlFor="publisher">Publisher: </label>
            <input type="text" name="publisher" id="publisher"  { ...register( "publisher" ) } />
          </div>
          <div>
            <label htmlFor="rating">Rating: </label>
            <input type="number" min="1" max="5" name="rating"{ ...register( "rating" ) } />
          </div>
          <div>
            <label htmlFor="sale">Sale: </label>
            <input type="number" min="0" name="sale"  { ...register( "sale" ) } />
          </div>
          <div>
            <label htmlFor="stock">Stock: </label>
            <input type="number" name="stock" min="0" { ...register( "stock" ) } />
          </div>
          <div>
            <label htmlFor="author">Author: </label>
            <select name="author" id="author" { ...register( "author", { required: true } ) }  >
              {
                authors.map( ( item, idx ) => {
                  return <option key={ idx } value={ item.name }
                  >{ item.name }</option>;
                } )
              }
            </select>
            <p>Or</p>
            <input type="text" placeholder='Add new Author' name="newAuthor" id="new-author" { ...register( "newAuthor" ) } />
          </div>
          <div>
            <label htmlFor="genre">Genre: </label>
            <select name="genre" id="genre" multiple={ true } required { ...register( "genre", { required: true } ) }>
              {
                genres.map( ( item, idx ) => {
                  return <option key={ idx } value={ item.genre_name }
                  >{ item.genre_name }</option>;
                } )
              }
            </select>
          </div>
          <input type="submit" className='button' />
        </form>
        <div>
          <h2>Book Image</h2>
          <form onSubmit={ submit }>
            <input onChange={ e => setFile( e.target.files[ 0 ] ) } type="file" accept="image/*"></input>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBook;