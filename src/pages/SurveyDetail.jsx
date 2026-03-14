import { StatusBadge } from '../components/StatusBadge.jsx';
import { formatDate, formatDateTime } from '../utils/helpers.js';
import { VIEW } from '../utils/views.js';

function Field({ label, value }) {
  return (
    <div className="detail-field">
      <span className="detail-field-label">{label}</span>
      <span className={`detail-field-value${!value ? ' empty' : ''}`}>
        {value || 'Not specified'}
      </span>
    </div>
  );
}

export function SurveyDetail({ survey, onNavigate }) {
  if (!survey) {
    return (
      <div className="empty-state">
        <h3>Survey not found</h3>
        <button className="btn btn-primary" onClick={() => onNavigate(VIEW.LIST)}>
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <div className="page-header">
        <div>
          <h1>{survey.siteName}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem' }}>
            <StatusBadge status={survey.status} />
            {survey.siteId && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                ID: {survey.siteId}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-ghost" onClick={() => onNavigate(VIEW.LIST)}>
            ← Back
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate(VIEW.EDIT, survey.id)}>
            Edit Survey
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-section">
          <div className="detail-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Site Information
          </div>
          <div className="detail-fields">
            <Field label="Location" value={survey.location} />
            <Field label="Site Type" value={survey.siteType} />
            <Field label="Survey Type" value={survey.surveyType} />
            <Field label="Latitude" value={survey.latitude} />
            <Field label="Longitude" value={survey.longitude} />
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            Survey Details
          </div>
          <div className="detail-fields">
            <Field label="Survey Date" value={formatDate(survey.surveyDate)} />
            <Field label="Surveyor" value={survey.surveyorName} />
            <Field label="Surveyor Contact" value={survey.surveyorContact} />
            <Field label="Status" value={null} />
            <StatusBadge status={survey.status} />
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
            Technical Details
          </div>
          <div className="detail-fields">
            <Field label="Structure Height" value={survey.structureHeight ? `${survey.structureHeight} m` : null} />
            <Field label="Antenna Height" value={survey.antennaHeight ? `${survey.antennaHeight} m` : null} />
            <Field label="Power" value={survey.power} />
            <Field label="Access Requirements" value={survey.accessRequirements} />
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            Notes & Recommendations
          </div>
          <div className="detail-fields">
            <Field label="Notes" value={survey.notes} />
            <Field label="Recommendations" value={survey.recommendations} />
          </div>
        </div>

        {survey.equipmentList && (
          <div className="detail-section" style={{ gridColumn: '1 / -1' }}>
            <div className="detail-section-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14z"/>
              </svg>
              Equipment / Antenna List
            </div>
            <div className="detail-fields">
              <span style={{ fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{survey.equipmentList}</span>
            </div>
          </div>
        )}

        <div className="detail-section" style={{ gridColumn: '1 / -1' }}>
          <div className="detail-section-title">Record Information</div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <Field label="Created" value={formatDateTime(survey.createdAt)} />
            <Field label="Last Updated" value={formatDateTime(survey.updatedAt)} />
          </div>
        </div>
      </div>
    </div>
  );
}
