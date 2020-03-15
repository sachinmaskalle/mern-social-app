import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code'></i> SaaS
        </Link>
      </h1>
      <ul>
        <li>
          <a href='!#'>
            <i className='fas fa-users'></i> Developers
          </a>
        </li>
        <li>
          <Link to='/register'>Register</Link>
        </li>
        <li>
          <Link to='/login'>
            <i className='fas fa-sign-in-alt'></i> Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
