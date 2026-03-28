import React, { useState, useMemo, useEffect } from 'react';
import { MovieBST } from '../utils/BST';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDateTime(dt) {
  if (!dt) return '—';
  const d = new Date(dt);
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditMovieModal({ movie, onClose, onSave }) {
  const [form, setForm] = useState({ ...movie });
  const [errors, setErrors] = useState({});

  if (!movie) return null;

  const validate = () => {
    const e = {};
    if (!form.movieName.trim()) e.movieName = 'Required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Enter valid price';
    if (!form.releaseDateTime) e.releaseDateTime = 'Required';
    return e;
  };

  const handle = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({ ...form, price: parseFloat(form.price) });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">✏️ Edit Movie</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Movie ID</label>
                  <input className="form-input" value={form.movieId} disabled style={{ opacity: 0.5 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handle('price')}
                  />
                  {errors.price && <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>{errors.price}</span>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Movie Name</label>
                <input
                  className="form-input"
                  placeholder="Enter movie title"
                  value={form.movieName}
                  onChange={handle('movieName')}
                />
                {errors.movieName && <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>{errors.movieName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Release Date &amp; Time</label>
                <input
                  className="form-input"
                  type="datetime-local"
                  value={form.releaseDateTime}
                  onChange={handle('releaseDateTime')}
                  style={{ colorScheme: 'dark' }}
                />
                {errors.releaseDateTime && <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>{errors.releaseDateTime}</span>}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">💾 Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────

function DeleteConfirmModal({ movie, onClose, onConfirm }) {
  if (!movie) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">🗑️ Delete Movie</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ textAlign: 'center', padding: '36px 28px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Are you sure you want to delete <br />
            <strong style={{ color: 'var(--text-primary)' }}>{movie.movieName}</strong>?<br />
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>This action cannot be undone.</span>
          </p>
        </div>
        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={() => onConfirm(movie.movieId)}>🗑️ Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Movies Page ──────────────────────────────────────────────────────────────

const Movies = ({ movies, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // BST search
  const bst = useMemo(() => MovieBST.fromArray(movies), [movies]);
  const displayed = useMemo(() => bst.search(search), [bst, search]);

  return (
    <>
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Movies <span>Library</span></h1>
          <p className="page-subtitle">Manage all movies in the system</p>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="movies-toolbar">
        <div className="movies-search-wrap">
          <span className="search-icon">🔍</span>
          <input
            placeholder="Search by name or ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {displayed.length} of {movies.length} movies
        </span>
      </div>

      {/* ── Table ── */}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Movie ID</th>
              <th>Movie Name</th>
              <th>Price</th>
              <th>Release Date &amp; Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">
                    <div className="empty-icon">🎬</div>
                    <p>{movies.length === 0 ? 'No movies yet. Add one from the Dashboard!' : 'No results found for your search.'}</p>
                  </div>
                </td>
              </tr>
            ) : displayed.map((movie, i) => (
              <tr key={movie.movieId}>
                <td style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{i + 1}</td>
                <td><span className="movie-id-chip">{movie.movieId}</span></td>
                <td className="td-name">{movie.movieName}</td>
                <td className="price-chip">${parseFloat(movie.price).toFixed(2)}</td>
                <td>{formatDateTime(movie.releaseDateTime)}</td>
                <td>
                  <div className="actions-cell">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setEditTarget(movie)}
                      title="Edit"
                    >✏️ Edit</button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteTarget(movie)}
                      title="Delete"
                    >🗑️ Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <EditMovieModal
        movie={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={(updated) => { onEdit(updated); setEditTarget(null); }}
      />
      <DeleteConfirmModal
        movie={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={(id) => { onDelete(id); setDeleteTarget(null); }}
      />
    </>
  );
};

export default Movies;
