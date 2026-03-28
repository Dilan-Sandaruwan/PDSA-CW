import React from 'react';

const Navbar = ({ activePage, setActivePage }) => {
  const links = [
    { id: 'dashboard', label: 'Dashboard', icon: '🎬' },
    { id: 'movies', label: 'Movies', icon: '🎞️' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🎟️</div>
        <div className="logo-text">
          CinePos
          <span>Admin System</span>
        </div>
      </div>

      <nav className="nav-links">
        {links.map(link => (
          <button
            key={link.id}
            className={`nav-link${activePage === link.id ? ' active' : ''}`}
            onClick={() => setActivePage(link.id)}
          >
            <span className="nav-icon">{link.icon}</span>
            {link.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        Movie Ticket POS &copy; 2026
      </div>
    </aside>
  );
};

export default Navbar;
