import { useState } from 'react';
import { SURVEY_STATUS, STATUS_LABELS, SITE_TYPES, SURVEY_TYPES } from '../utils/constants.js';
import { VIEW } from '../utils/views.js';

const EMPTY_FORM = {
  siteName: '',
  siteId: '',
  surveyType: '',
  siteType: '',
  location: '',
  latitude: '',
  longitude: '',
  surveyDate: '',
  surveyorName: '',
  surveyorContact: '',
  status: SURVEY_STATUS.PLANNED,
  structureHeight: '',
  antennaHeight: '',
  power: '',
  accessRequirements: '',
  equipmentList: '',
  notes: '',
  recommendations: '',
};

function validate(data) {
  const errors = {};
  if (!data.siteName.trim()) errors.siteName = 'Site name is required.';
  if (!data.location.trim()) errors.location = 'Location is required.';
  if (!data.surveyDate) errors.surveyDate = 'Survey date is required.';
  if (!data.surveyorName.trim()) errors.surveyorName = 'Surveyor name is required.';
  if (data.latitude && isNaN(Number(data.latitude))) errors.latitude = 'Must be a number.';
  if (data.longitude && isNaN(Number(data.longitude))) errors.longitude = 'Must be a number.';
  if (data.structureHeight && isNaN(Number(data.structureHeight))) errors.structureHeight = 'Must be a number.';
  if (data.antennaHeight && isNaN(Number(data.antennaHeight))) errors.antennaHeight = 'Must be a number.';
  return errors;
}

export function SurveyForm({ existing, onSave, onCancel, addToast }) {
  const isEdit = Boolean(existing);
  const [form, setForm] = useState(isEdit ? {
    siteName: existing.siteName || '',
    siteId: existing.siteId || '',
    surveyType: existing.surveyType || '',
    siteType: existing.siteType || '',
    location: existing.location || '',
    latitude: existing.latitude || '',
    longitude: existing.longitude || '',
    surveyDate: existing.surveyDate || '',
    surveyorName: existing.surveyorName || '',
    surveyorContact: existing.surveyorContact || '',
    status: existing.status || SURVEY_STATUS.PLANNED,
    structureHeight: existing.structureHeight || '',
    antennaHeight: existing.antennaHeight || '',
    power: existing.power || '',
    accessRequirements: existing.accessRequirements || '',
    equipmentList: existing.equipmentList || '',
    notes: existing.notes || '',
    recommendations: existing.recommendations || '',
  } : EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const errs = validate({ ...form, [name]: value });
      setErrors(prev => ({ ...prev, [name]: errs[name] }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errs = validate(form);
    setErrors(prev => ({ ...prev, [name]: errs[name] }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTouched(Object.fromEntries(Object.keys(errs).map(k => [k, true])));
      addToast('Please fix the form errors.', 'error');
      return;
    }
    onSave(form);
    addToast(isEdit ? 'Survey updated successfully.' : 'Survey created successfully.', 'success');
  }

  function field(name, label, type = 'text', options = {}) {
    return (
      <div className={`form-field${options.fullWidth ? ' full-width' : ''}`}>
        <label className={options.required ? 'required' : ''}>{label}</label>
        {options.textarea ? (
          <textarea
            name={name}
            value={form[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={options.placeholder}
            rows={options.rows || 3}
            className={errors[name] ? 'error' : ''}
          />
        ) : options.select ? (
          <select
            name={name}
            value={form[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors[name] ? 'error' : ''}
          >
            <option value="">Select…</option>
            {options.choices.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        ) : options.statusSelect ? (
          <select
            name={name}
            value={form[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors[name] ? 'error' : ''}
          >
            {Object.entries(STATUS_LABELS).map(([val, lbl]) => (
              <option key={val} value={val}>{lbl}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={options.placeholder}
            className={errors[name] ? 'error' : ''}
          />
        )}
        {errors[name] && <span className="error-msg">{errors[name]}</span>}
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>{isEdit ? 'Edit Survey' : 'New Site Survey'}</h1>
      </div>

      <form className="form-container" onSubmit={handleSubmit} noValidate>

        <div className="form-section">
          <div className="form-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Site Information
          </div>
          <div className="form-grid">
            {field('siteName', 'Site Name', 'text', { required: true, placeholder: 'e.g. Tower Site Alpha' })}
            {field('siteId', 'Site ID', 'text', { placeholder: 'e.g. TSA-001' })}
            {field('siteType', 'Site Type', 'text', { select: true, choices: SITE_TYPES })}
            {field('surveyType', 'Survey Type', 'text', { select: true, choices: SURVEY_TYPES })}
            {field('location', 'Location / Address', 'text', { required: true, fullWidth: true, placeholder: 'e.g. 123 Main St, City, State' })}
            {field('latitude', 'Latitude', 'text', { placeholder: 'e.g. 40.7128' })}
            {field('longitude', 'Longitude', 'text', { placeholder: 'e.g. -74.0060' })}
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            Survey Details
          </div>
          <div className="form-grid">
            {field('surveyDate', 'Survey Date', 'date', { required: true })}
            {field('surveyorName', 'Surveyor Name', 'text', { required: true, placeholder: 'Full name' })}
            {field('surveyorContact', 'Surveyor Contact', 'text', { placeholder: 'Phone or email' })}
            {field('status', 'Status', 'text', { statusSelect: true })}
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
            Technical Details
          </div>
          <div className="form-grid cols-3">
            {field('structureHeight', 'Structure Height (m)', 'text', { placeholder: 'e.g. 30' })}
            {field('antennaHeight', 'Antenna Height (m)', 'text', { placeholder: 'e.g. 25' })}
            {field('power', 'Power Availability', 'text', { placeholder: 'e.g. 240V AC mains' })}
          </div>
          <div className="form-grid cols-1" style={{ marginTop: '1rem' }}>
            {field('accessRequirements', 'Access Requirements', 'text', { textarea: true, placeholder: 'Describe access conditions, key holders, security requirements…', rows: 2 })}
            {field('equipmentList', 'Equipment / Antenna List', 'text', { textarea: true, placeholder: 'List existing or planned equipment…', rows: 3 })}
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            Notes & Recommendations
          </div>
          <div className="form-grid cols-1">
            {field('notes', 'Survey Notes', 'text', { textarea: true, placeholder: 'General observations, findings…', rows: 4, fullWidth: true })}
            {field('recommendations', 'Recommendations', 'text', { textarea: true, placeholder: 'Recommended actions, follow-up items…', rows: 3, fullWidth: true })}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Update Survey' : 'Create Survey'}
          </button>
        </div>
      </form>
    </div>
  );
}
