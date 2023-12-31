import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
export const UserCard = ( { key, userId, name, username, deleteUserEntry } ) => {
  const { host } = useContext( AppContext );

  const deleteUser = async () => {
    await axios.delete( `http://${ host }/api/user/delete-user/${ userId }/` );
    deleteUserEntry( key );
  };
  return (
    <div className="user-card">
      <div className="user-info">
        <h2>Name: { name }</h2>
        <p>username: { username }</p>
      </div>
      <div className="button" onClick={ deleteUser }>
        X
      </div>
    </div>
  );
};

const AllUsers = () => {
  const [ users, setUsers ] = useState( [] );
  const { host } = useContext( AppContext );
  const getAllUsers = async () => {
    const all_users = await axios.get( `http://${ host }/api/user/all-users` ).then( res => res.data.payload );
    setUsers( all_users );
    console.log( all_users );
  };

  const deleteUserEntry = ( idx ) => {
    const new_users = [ ...users ];
    new_users.splice( idx, idx + 1 );
    setUsers( new_users );
  };

  useEffect( () => {
    getAllUsers();
    window.scrollTo( 0, 0 );
  }, [] );

  return (
    <div className='all-users'>
      {
        users.map( ( user, idx ) => {
          return <UserCard key={ idx } userId={ user.id } username={ user.username } name={ user.first_name + " " + user.last_name } deleteUserEntry={ deleteUserEntry } />;
        } )
      }
    </div>
  );
};


export default AllUsers;