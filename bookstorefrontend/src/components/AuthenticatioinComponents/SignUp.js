import { useForm } from "react-hook-form";
import axios from "axios";
import { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";



const SignUp = () => {
  const { register, handleSubmit } = useForm();
  const { setRole, setIsAuthenticated } = useContext( AppContext );
  const onSubmit = async ( data ) => {
    // event.preventDefault();
    const string_data = JSON.stringify( data );
    console.log( string_data );
    const response = await axios.post( "http://localhost:8000/api/user/sign-up/", data );
    console.log( response );
  };
  useEffect( () => {
    setRole( "" );
    setIsAuthenticated( false );
  }, [] );
  return (
    <div className="signup">
      <div className="signup-container">
        <div className="signup-form">
          <h1>Sign Up</h1>
          <form onSubmit={ handleSubmit( onSubmit ) }>
            <div>
              <label htmlFor="first_name">First Name:</label>
              <input type="text" id="first_name" name="first_name" { ...register( "first_name", { required: true } ) } />

              {/* VALIDATION CAN BE APPLIED INTO REACT-FORM-HOOK, GO LOOK THE DOCUMENTATIOIN */ }

            </div>
            <div>

              <label htmlFor="last_name">Last Name:</label>
              <input type="text" id="last_name" name="last_name" { ...register( "last_name", { required: true } ) } />
            </div>
            <div>

              <label htmlFor="emal">Email:</label>
              <input type="email" name="email" id="email" { ...register( "email", { required: true } ) } />
            </div>
            <div>

              <label htmlFor="username">Username:</label>
              <input type="text" id="username" name="username" { ...register( "username", { required: true } ) } />
            </div>
            <div>

              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" { ...register( "password", { required: true } ) } />
            </div>
            <div>
              <label htmlFor="role">Role</label>
              <select name="role" id="role" { ...register( "role", { required: true } ) }>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>
            <div>
              <input type="submit" className="signup-submit" />
            </div>
          </form>
        </div>
      </div >
    </div>
  );
};

export default SignUp;