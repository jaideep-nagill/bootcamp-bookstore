import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
const Navbar = () => {
  const { role, isAuthenticated } = useContext( AppContext );

  return (
    <nav className='primary-nav'>
      <Link className="link" to="/">Home</Link>
      <Link className="link" to="/store">Store</Link>
      <Link className="link" to="/cart">Cart</Link>
      { !isAuthenticated &&
        <Link className="link" to="/signin">Sign in</Link>
      }
      {
        role === 'admin' &&
        <Link className="link" to="/admin">Admin</Link>
      }
      {
        role === 'seller' &&
        <Link className="link" to="/seller">Seller</Link>
      }
      {
        role === 'buyer' &&
        <Link className="link" to="/profile">Buyer</Link>
      }
    </nav>
  );
};

export default Navbar;