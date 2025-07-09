import { FaMoon, FaSun } from 'react-icons/fa';
import './Header.css';

interface HeaderProps {
  darkMode: boolean;
  onThemeToggle: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, onThemeToggle }) => {
  return (
    <header className="header">
      <div className="header__logo">
        <img 
          src={darkMode ? '/darksidelogo.png' : '/lightsidelogo.png'} 
          alt="KONVO Logo" 
          className="header__logo-image" 
        />
        <div className="header__logo-text">KONVO</div>
      </div>
      
      <button
        aria-label="Toggle theme"
        onClick={onThemeToggle}
        className={`header__theme-button ${darkMode ? 'header__theme-button--dark' : 'header__theme-button--light'}`}
      >
        {darkMode ? <FaMoon /> : <FaSun />}
      </button>
    </header>
  );
}; 