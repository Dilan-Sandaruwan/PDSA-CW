import React, { useState, useCallback } from 'react';
import Navbar from './Components/Navbar';
import Dashboard from './Components/Dashboard';
import Movies from './Components/Movies';

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_MOVIES = [
  { movieId: 'MOV-001', movieName: 'Interstellar Odyssey', price: 14.50, releaseDateTime: '2026-04-05T19:30' },
  { movieId: 'MOV-002', movieName: 'Shadow Protocol',      price: 12.00, releaseDateTime: '2026-04-01T20:00' },
  { movieId: 'MOV-003', movieName: 'The Last Horizon',     price: 16.00, releaseDateTime: '2026-03-30T18:00' },
  { movieId: 'MOV-004', movieName: 'Crimson Tide Rising',  price: 11.50, releaseDateTime: '2026-04-20T21:00' },
  { movieId: 'MOV-005', movieName: 'Neon Genesis',         price: 13.00, releaseDateTime: '2026-04-10T18:30' },
];

// ─── Toast ────────────────────────────────────────────────────────────────────

function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);
  return { toasts, addToast };
}

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [movies, setMovies] = useState(SEED_MOVIES);
  const { toasts, addToast } = useToast();

  const handleAddMovie = useCallback((movie) => {
    setMovies(prev => {
      if (prev.find(m => m.movieId === movie.movieId)) {
        addToast('Movie ID already exists!', 'error');
        return prev;
      }
      addToast(`"${movie.movieName}" added successfully!`);
      return [...prev, movie];
    });
  }, [addToast]);

  const handleEditMovie = useCallback((updated) => {
    setMovies(prev => prev.map(m => m.movieId === updated.movieId ? updated : m));
    addToast(`"${updated.movieName}" updated!`);
  }, [addToast]);

  const handleDeleteMovie = useCallback((id) => {
    setMovies(prev => {
      const movie = prev.find(m => m.movieId === id);
      if (movie) addToast(`"${movie.movieName}" deleted.`, 'error');
      return prev.filter(m => m.movieId !== id);
    });
  }, [addToast]);

  return (
    <div className="app-layout">
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main className="main-content">
        {activePage === 'dashboard' && (
          <Dashboard
            movies={movies}
            onAddMovie={handleAddMovie}
          />
        )}
        {activePage === 'movies' && (
          <Movies
            movies={movies}
            onEdit={handleEditMovie}
            onDelete={handleDeleteMovie}
          />
        )}
      </main>

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-icon">{t.type === 'success' ? '✅' : '❌'}</span>
            <span className="toast-msg">{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;