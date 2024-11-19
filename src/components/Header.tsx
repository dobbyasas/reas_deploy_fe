import React from 'react';
import '../styles/Header.scss';
import logo from '../assets/logo.png';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <img
          src={logo}
          alt="Reas logo"
          className="header-logo"
        />
      </div>
    </header>
  );
};

export default Header;
