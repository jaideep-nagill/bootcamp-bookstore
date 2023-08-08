import Navbar from './Navbar';
import { ReactComponent as Logo } from "../assets/logo.svg";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="header">
      <div className="logo-card" onClick={ () => navigate( "/" ) }>
        <Logo className='logo-image' />
        <h1>BookStore</h1>
      </div>
      <Navbar />
    </div>
  );
};

export default Header;