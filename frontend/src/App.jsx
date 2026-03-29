import React, { useState, useCallback, useEffect } from 'react';
import Navbar from './Components/Navbar';
import Dashboard from './Components/Dashboard';
import Movies from './Components/Movies';

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = 'http://127.0.0.1:8000';

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
  const [movies, setMovies] = useState([]);
  const { toasts, addToast } = useToast();

  // Fetch movies from database
  const fetchMovies = useCallback(async () => {
    try {
      const resp = await fetch(`${API_BASE}/Get_Movies.php`);
      const result = await resp.json();
      if (result.status === 200) {
        // Map database fields to frontend fields
        const mapped = result.data.map(m => ({
          movieId: m.id, // Using DB numeric ID as movieId
          movieName: m.MovieName,
          price: m.ticketprice,
          releaseDateTime: m.ReleasDate,
          status: m.Status
        }));
        setMovies(mapped);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      addToast('Failed to load movies from server.', 'error');
    }
  }, [addToast]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleAddMovie = useCallback(async (movie) => {
    try {
      const resp = await fetch(`${API_BASE}/Save_Movie.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          MovieName: movie.movieName,
          ReleasDate: movie.releaseDateTime,
          ticketprice: movie.price,
          Status: movie.status
        })
      });
      const result = await resp.json();
      if (result.status === 201) {
        addToast(`"${movie.movieName}" saved to database!`);
        fetchMovies(); // Refresh list to get new DB ID
      } else {
        addToast(result.message || 'Failed to save movie.', 'error');
      }
    } catch (err) {
      console.error('Save error:', err);
      addToast('Error connecting to backend.', 'error');
    }
  }, [addToast, fetchMovies]);

  const handleEditMovie = useCallback(async (updated) => {
    try {
      const resp = await fetch(`${API_BASE}/Update_Movie.php`, {
        method: 'POST', // or PUT if defined that way in backend
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updated.movieId, // Use DB id
          MovieName: updated.movieName,
          ReleasDate: updated.releaseDateTime,
          ticketprice: updated.price,
          Status: updated.status
        })
      });
      const result = await resp.json();
      if (result.status === 200) {
        addToast(`"${updated.movieName}" updated in database!`);
        fetchMovies();
      } else {
        addToast(result.message || 'Update failed.', 'error');
      }
    } catch (err) {
      console.error('Update error:', err);
      addToast('Error updating movie.', 'error');
    }
  }, [addToast, fetchMovies]);

  const handleDeleteMovie = useCallback(async (id) => {
    try {
      const resp = await fetch(`${API_BASE}/Delete_Movie.php`, {
        method: 'POST', // Usually PHP handles delete via POST or specific method
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const result = await resp.json();
      if (result.status === 200) {
        addToast(`Movie deleted from database.`, 'error');
        fetchMovies();
      } else {
        addToast(result.message || 'Delete failed.', 'error');
      }
    } catch (err) {
      console.error('Delete error:', err);
      addToast('Error deleting movie.', 'error');
    }
  }, [addToast, fetchMovies]);

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