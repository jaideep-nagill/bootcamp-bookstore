import './App.css';
import Store from './components/StoreComponents/Store.js';
import Home from './components/Home.js';
import Cart from './components/CartComponents/Cart.js';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/AuthenticatioinComponents/SignIn';
import Header from './components/Header';
import Footer from './components/Footer';
import SignUp from './components/AuthenticatioinComponents/SignUp';
import Testing from './components/Testing';
import BookDetails from './components/StoreComponents/BookDetail';
import Admin from './components/AdminComponents/Admin';
import Protected from './components/AuthenticatioinComponents/Protected';

function App () {

  return (
    <div className="App">

      <div className="app">
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={ <Home /> } />
            <Route path="/store" element={ <Store /> } />
            <Route path="/store/:slug" element={ <BookDetails /> } />
            <Route path="/cart" element={
              <Cart />
            } />
            <Route path="/admin" element={
              <Protected>
                <Admin />
              </Protected>
            } />
            <Route path="/profile" element={
              <Protected>
                <Admin />
              </Protected>
            } />
            <Route path="/seller" element={
              <Protected>
                <Admin />
              </Protected> } />
            <Route path="/signin" element={ <SignIn /> } />
            <Route path="/signup" element={ <SignUp /> } />
            <Route path="/testing" element={ <Testing /> } />
            <Route path="*" element={ <h1>404 not found</h1> } />
          </Routes>
        </Router>
      </div>
      <Footer />
    </div>
  );
};

export default App;
