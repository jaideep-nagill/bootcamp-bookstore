import axios from 'axios';
import { useState } from 'react';

const Testing = () => {
  const [ file, setFile ] = useState();
  // const [ setImageUrl ] = useState( "" );

  const slug = "Book-1";
  const id = 1;
  const submit = async event => {
    event.preventDefault();

    const formData = new FormData();
    formData.append( "image", file );
    formData.append( "imageName", id + "-" + slug );
    await axios.post( "http://localhost:8080/", formData, { headers: { 'Content-Type': 'multipart/form-data' } } );
  };

  // const getImage = async () => {
  //   const imageData = await axios.get( "http://localhost:8080/1-Book-1" );

  //   setImageUrl( imageData.data.payload.url );
  // };

  return (
    <div>

      <form onSubmit={ submit }>
        <input onChange={ e => setFile( e.target.files[ 0 ] ) } type="file" accept="image/*"></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Testing;