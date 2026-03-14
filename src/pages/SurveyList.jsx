import { useState, useMemo } from 'react';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { ConfirmDialog } from '../components/ConfirmDialog.jsx';
import { formatDate } from '../utils/helpers.js';
import { SURVEY_STATUS, STATUS_LABELS } from '../utils/constants.js';
import { VIEW } from '../utils/views.js';

export function SurveyList({ surveys, onNavigate, onDelete, addToast }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return surveys.filter(s => {
      const matchSearch =
        !q ||
        s.siteName?.toLowerCase().includes(q) ||
        s.siteId?.toLowerCase().includes(q) ||
        s.location?.toLowerCase().includes(q) ||
        s.surveyorName?.toLowerCase().includes(q);
      const matchStatus = !statusFilter || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [surveys, search, statusFilter]);

  const stats = useMemo(() => ({
    total: surveys.length,
    planned: surveys.filter(s => s.status === SURVEY_STATUS.PLANNED).length,
    inProgress: surveys.filter(s => s.status === SURVEY_STATUS.IN_PROGRESS).length,
    completed: surveys.filter(s => s.status === SURVEY_STATUS.COMPLETED).length,
  }), [surveys]);

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    onDelete(deleteTarget.id);
    addToast(`Survey "${deleteTarget.siteName}" deleted.`, 'success');
    setDeleteTarget(null);
  }

  return (
    <>
      <div className="page-header">
        <h1>Site Surveys</h1>
        <button className="btn btn-primary" onClick={() => onNavigate(VIEW.CREATE)}>
          + New Survey
        </button>
      </div>

      {surveys.length > 0 && (
        <div className="stats-bar">
          <div className="stat-card">
            <span className="stat-card-value">{stats.total}</span>
            <span className="stat-card-label">Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-value">{stats.planned}</span>
            <span className="stat-card-label">Planned</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-value">{stats.inProgress}</span>
            <span className="stat-card-label">In Progress</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-value">{stats.completed}</span>
            <span className="stat-card-label">Completed</span>
          </div>
        </div>
      )}

      {surveys.length > 0 && (
        <div className="filter-bar">
          <div className="search-input-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search by site name, ID, location, surveyor…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 6h-2.18c.07-.44.18-.86.18-1.3C18 2.12 15.88 0 13.3 0c-1.3 0-2.49.52-3.35 1.36L9 3.12 8.05 2.36C7.2.52 6.01 0 4.7 0 2.12 0 0 2.12 0 4.7c0 .44.11.86.18 1.3H0l-.01.06C0 8.24 1.21 9.91 2.95 11.02l7.12 5.17c.56.41 1.31.41 1.87 0l7.12-5.17C20.79 9.91 22 8.24 22 6.06L20 6z"/>
          </svg>
          {surveys.length === 0 ? (
            <>
              <h3>No surveys yet</h3>
              <p>Create your first site survey to get started.</p>
              <br />
              <button className="btn btn-primary" onClick={() => onNavigate(VIEW.CREATE)}>
                + New Survey
              </button>
            </>
          ) : (
            <>
              <h3>No surveys match your filters</h3>
              <p>Try adjusting your search or status filter.</p>
            </>
          )}
        </div>
      ) : (
        <div className="surveys-grid">
          {filtered.map(survey => (
            <div key={survey.id} className="survey-card">
              <div className="survey-card-header">
                <span className="survey-card-title">{survey.siteName}</span>
                <StatusBadge status={survey.status} />
              </div>
              <div className="survey-card-meta">
                {survey.siteId && (
                  <span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"/>
                    </svg>
                    {survey.siteId}
                  </span>
                )}
                {survey.location && (
                  <span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    {survey.location}
                  </span>
                )}
                {survey.surveyDate && (
                  <span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                    {formatDate(survey.surveyDate)}
                  </span>
                )}
                {survey.surveyorName && (
                  <span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    {survey.surveyorName}
                  </span>
                )}
              </div>
              {survey.notes && (
                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {survey.notes}
                </p>
              )}
              <div className="survey-card-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onNavigate(VIEW.DETAIL, survey.id)}
                >
                  View
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => onNavigate(VIEW.EDIT, survey.id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => setDeleteTarget(survey)}
                  style={{ marginLeft: 'auto' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Survey"
          message={`Are you sure you want to delete "${deleteTarget.siteName}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
