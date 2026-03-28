import React, { useState, useMemo, useEffect } from 'react';
import { MovieBST } from '../utils/BST';
import { sortMoviesByExpiry, getNextMovie } from '../utils/Sorting';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDateTime(dt) {
  if (!dt) return '—';
  const d = new Date(dt);
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatDate(dt) {
  if (!dt) return '—';
  const d = new Date(dt);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dt) {
  if (!dt) return '—';
  const d = new Date(dt);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function daysUntil(dt) {
  const now = new Date();
  const target = new Date(dt);
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return diff;
}

function getUrgency(dt) {
  const d = daysUntil(dt);
  if (d <= 3) return { label: 'URGENT', cls: 'urgency-urgent' };
  if (d <= 14) return { label: 'SOON', cls: 'urgency-soon' };
  return { label: 'UPCOMING', cls: 'urgency-upcoming' };
}

function getRankClass(i) {
  if (i === 0) return 'rank-1';
  if (i === 1) return 'rank-2';
  if (i === 2) return 'rank-3';
  return 'rank-other';
}

// ─── Add Movie Modal ─────────────────────────────────────────────────────────

// Derives status label from a datetime string
function computeStatus(dateTimeStr) {
  if (!dateTimeStr) return '';
  const d = daysUntil(dateTimeStr);
  if (d <= 3)  return 'Urgent';
  if (d <= 14) return 'Soon';
  return 'Upcoming';
}

const STATUS_OPTIONS = ['Urgent', 'Soon', 'Upcoming'];

const EMPTY_FORM = { movieId: '', movieName: '', price: '', releaseDateTime: '', status: '' };

function AddMovieModal({ show, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens
  useEffect(() => {
    if (show) { setForm(EMPTY_FORM); setErrors({}); }
  }, [show]);

  // Auto-compute status whenever releaseDateTime changes
  useEffect(() => {
    if (form.releaseDateTime) {
      const autoStatus = computeStatus(form.releaseDateTime);
      setForm(f => {
        // Only update if the user hasn't manually overridden to a different value
        // (we always auto-sync on date change)
        if (f.status !== autoStatus) return { ...f, status: autoStatus };
        return f;
      });
    }
  }, [form.releaseDateTime]);

  if (!show) return null;

  const validate = () => {
    const e = {};
    if (!form.movieId.trim()) e.movieId = 'Required';
    if (!form.movieName.trim()) e.movieName = 'Required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Enter valid price';
    if (!form.releaseDateTime) e.releaseDateTime = 'Required';
    return e;
  };

  const handle = (field) => (e) => {
    const value = e.target.value;
    setForm(f => {
      const updated = { ...f, [field]: value };
      // Auto-sync status whenever date changes
      if (field === 'releaseDateTime') {
        updated.status = computeStatus(value);
      }
      return updated;
    });
  };

  // Min value for datetime-local: current local time in YYYY-MM-DDTHH:MM format
  const nowMin = (() => {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  })();

  const submit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({ ...form, price: parseFloat(form.price) });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">🎬 Add New Movie</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Movie ID</label>
                  <input
                    className="form-input"
                    placeholder="e.g. MOV-001"
                    value={form.movieId}
                    onChange={handle('movieId')}
                  />
                  {errors.movieId && <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>{errors.movieId}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 12.50"
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
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Release Date &amp; Time</label>
                  <input
                    className="form-input"
                    type="datetime-local"
                    value={form.releaseDateTime}
                    onChange={handle('releaseDateTime')}
                    min={nowMin}
                    style={{ colorScheme: 'dark' }}
                  />
                  {errors.releaseDateTime && <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>{errors.releaseDateTime}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className={`form-input status-select status-select--${(form.status || 'empty').toLowerCase()}`}
                    value={form.status}
                    onChange={handle('status')}
                  >
                    <option value="" disabled>Auto from date…</option>
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {form.status && (
                    <span className={`status-badge status-badge--${form.status.toLowerCase()}`}>
                      {form.status === 'Urgent'   ? '🔴' :
                       form.status === 'Soon'     ? '🟡' : '🟢'}
                      {' '}{form.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">✚ Add Movie</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

const Dashboard = ({ movies, onAddMovie }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // BST-powered search
  const bst = useMemo(() => MovieBST.fromArray(movies), [movies]);
  const searchResults = useMemo(() => bst.search(searchQuery), [bst, searchQuery]);

  // Priority list (min-heap sort by releaseDateTime)
  const priorityList = useMemo(() => sortMoviesByExpiry(movies), [movies]);

  // Next movie to watch
  const nextMovie = useMemo(() => getNextMovie(movies), [movies]);

  const handleAdd = (formData) => {
    onAddMovie(formData);
    setShowAddModal(false);
  };

  return (
    <>
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard <span>Overview</span></h1>
          <p className="page-subtitle">Manage your cinema schedule and tickets</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          ✚ Add Movie
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">🎬</div>
          <div className="stat-label">Total Movies</div>
          <div className="stat-value">{movies.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-label">Showing Soon (7 days)</div>
          <div className="stat-value">
            {movies.filter(m => daysUntil(m.releaseDateTime) <= 7 && daysUntil(m.releaseDateTime) >= 0).length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-label">Upcoming</div>
          <div className="stat-value">
            {movies.filter(m => daysUntil(m.releaseDateTime) > 0).length}
          </div>
        </div>
      </div>

      {/* ── Next Movie Card ── */}
      {nextMovie && (
        <div className="next-movie-card">
          <div className="next-movie-label">
            <span>▶</span> Next Showing
          </div>
          <div className="next-movie-title">{nextMovie.movieName}</div>
          <div className="next-movie-details">
            <div className="next-movie-detail-item">
              <div className="detail-icon">🆔</div>
              <span>ID: <span className="detail-value">{nextMovie.movieId}</span></span>
            </div>
            <div className="next-movie-detail-item">
              <div className="detail-icon">📅</div>
              <span>Date: <span className="detail-value">{formatDate(nextMovie.releaseDateTime)}</span></span>
            </div>
            <div className="next-movie-detail-item">
              <div className="detail-icon">⏰</div>
              <span>Time: <span className="detail-value">{formatTime(nextMovie.releaseDateTime)}</span></span>
            </div>
            <div className="next-movie-detail-item">
              <div className="detail-icon">💵</div>
              <span>Price: <span className="detail-value" style={{ color: 'var(--success)' }}>${parseFloat(nextMovie.price).toFixed(2)}</span></span>
            </div>
          </div>
          <div className="countdown-chip">
            🎟️ {daysUntil(nextMovie.releaseDateTime) === 0
              ? 'Showing TODAY!'
              : daysUntil(nextMovie.releaseDateTime) === 1
                ? 'Showing TOMORROW!'
                : `${daysUntil(nextMovie.releaseDateTime)} days to go`}
          </div>
        </div>
      )}

      {/* ── Main Grid ── */}
      <div className="dashboard-grid">
        {/* Priority / Search List */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🎯 Priority List — Expiring Soon</span>
            <span className="card-badge">{priorityList.length} movies</span>
          </div>
          <div className="search-wrapper">
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                placeholder="Search by name or ID…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Show search results if searching, else sorted priority list */}
          {(searchQuery ? searchResults : priorityList).length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎬</div>
              <p>No movies found</p>
            </div>
          ) : (
            <div className="priority-list">
              {(searchQuery ? searchResults : priorityList).map((movie, i) => {
                const urgency = getUrgency(movie.releaseDateTime);
                return (
                  <div key={movie.movieId} className="priority-item">
                    <div className={`priority-rank ${getRankClass(i)}`}>{i + 1}</div>
                    <div className="priority-info">
                      <div className="priority-name">{movie.movieName}</div>
                      <div className="priority-date">{formatDateTime(movie.releaseDateTime)}</div>
                    </div>
                    <span className={`priority-urgency ${urgency.cls}`}>{urgency.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Stats Side Panel */}
        <div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">📊 Quick Stats</span>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: '🔴 Urgent (≤3 days)', value: movies.filter(m => { const d = daysUntil(m.releaseDateTime); return d >= 0 && d <= 3; }).length, color: 'var(--danger)' },
                { label: '🟡 Soon (4–14 days)', value: movies.filter(m => { const d = daysUntil(m.releaseDateTime); return d >= 4 && d <= 14; }).length, color: 'var(--warning)' },
                { label: '🟢 Upcoming (15+ days)', value: movies.filter(m => daysUntil(m.releaseDateTime) > 14).length, color: 'var(--success)' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{ fontWeight: 800, fontSize: 18, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Movie Modal */}
      <AddMovieModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAdd}
      />
    </>
  );
};

export default Dashboard;
