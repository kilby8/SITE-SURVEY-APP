import { VIEW } from '../utils/views.js';

export function Navbar({ currentView, onNavigate }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        Site Survey App
      </div>
      <div className="navbar-links">
        <a
          href="#"
          className={`navbar-link${currentView === VIEW.LIST ? ' active' : ''}`}
          onClick={e => { e.preventDefault(); onNavigate(VIEW.LIST); }}
        >
          Surveys
        </a>
        <a
          href="#"
          className={`navbar-link${currentView === VIEW.CREATE ? ' active' : ''}`}
          onClick={e => { e.preventDefault(); onNavigate(VIEW.CREATE); }}
        >
          + New Survey
        </a>
      </div>
    </nav>
  );
}
