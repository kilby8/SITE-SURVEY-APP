'use strict';

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { pool, initSchema } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/** Convert snake_case DB row to camelCase response object. */
function rowToSurvey(row) {
  return {
    id: row.id,
    siteName: row.site_name,
    siteId: row.site_id,
    surveyType: row.survey_type,
    siteType: row.site_type,
    location: row.location,
    latitude: row.latitude !== null ? Number(row.latitude) : null,
    longitude: row.longitude !== null ? Number(row.longitude) : null,
    surveyDate: row.survey_date ? row.survey_date.toISOString().slice(0, 10) : null,
    surveyorName: row.surveyor_name,
    surveyorContact: row.surveyor_contact,
    status: row.status,
    structureHeight: row.structure_height !== null ? Number(row.structure_height) : null,
    antennaHeight: row.antenna_height !== null ? Number(row.antenna_height) : null,
    power: row.power,
    accessRequirements: row.access_requirements,
    equipmentList: row.equipment_list,
    notes: row.notes,
    recommendations: row.recommendations,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** GET /api/surveys – list all surveys, newest first */
app.get('/api/surveys', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM surveys ORDER BY created_at DESC'
    );
    res.json(rows.map(rowToSurvey));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** GET /api/surveys/:id – fetch a single survey */
app.get('/api/surveys/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM surveys WHERE id = $1', [
      req.params.id,
    ]);
    if (rows.length === 0) return res.status(404).json({ error: 'Survey not found' });
    res.json(rowToSurvey(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** POST /api/surveys – create a new survey */
app.post('/api/surveys', async (req, res) => {
  const {
    siteName, siteId, surveyType, siteType, location,
    latitude, longitude, surveyDate, surveyorName, surveyorContact,
    status = 'planned', structureHeight, antennaHeight, power,
    accessRequirements, equipmentList, notes, recommendations,
  } = req.body;

  if (!siteName || !location || !surveyDate || !surveyorName) {
    return res.status(400).json({
      error: 'siteName, location, surveyDate, and surveyorName are required',
    });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO surveys (
        site_name, site_id, survey_type, site_type, location,
        latitude, longitude, survey_date, surveyor_name, surveyor_contact,
        status, structure_height, antenna_height, power,
        access_requirements, equipment_list, notes, recommendations
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18
      ) RETURNING *`,
      [
        siteName, siteId || null, surveyType || null, siteType || null,
        location, latitude || null, longitude || null, surveyDate,
        surveyorName, surveyorContact || null, status,
        structureHeight || null, antennaHeight || null, power || null,
        accessRequirements || null, equipmentList || null,
        notes || null, recommendations || null,
      ]
    );
    res.status(201).json(rowToSurvey(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** PUT /api/surveys/:id – update an existing survey */
app.put('/api/surveys/:id', async (req, res) => {
  const {
    siteName, siteId, surveyType, siteType, location,
    latitude, longitude, surveyDate, surveyorName, surveyorContact,
    status, structureHeight, antennaHeight, power,
    accessRequirements, equipmentList, notes, recommendations,
  } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE surveys SET
        site_name            = COALESCE($1, site_name),
        site_id              = $2,
        survey_type          = $3,
        site_type            = $4,
        location             = COALESCE($5, location),
        latitude             = $6,
        longitude            = $7,
        survey_date          = COALESCE($8, survey_date),
        surveyor_name        = COALESCE($9, surveyor_name),
        surveyor_contact     = $10,
        status               = COALESCE($11, status),
        structure_height     = $12,
        antenna_height       = $13,
        power                = $14,
        access_requirements  = $15,
        equipment_list       = $16,
        notes                = $17,
        recommendations      = $18,
        updated_at           = NOW()
      WHERE id = $19
      RETURNING *`,
      [
        siteName || null, siteId !== undefined ? siteId : null,
        surveyType !== undefined ? surveyType : null,
        siteType !== undefined ? siteType : null,
        location || null, latitude !== undefined ? latitude : null,
        longitude !== undefined ? longitude : null,
        surveyDate || null, surveyorName || null,
        surveyorContact !== undefined ? surveyorContact : null,
        status || null,
        structureHeight !== undefined ? structureHeight : null,
        antennaHeight !== undefined ? antennaHeight : null,
        power !== undefined ? power : null,
        accessRequirements !== undefined ? accessRequirements : null,
        equipmentList !== undefined ? equipmentList : null,
        notes !== undefined ? notes : null,
        recommendations !== undefined ? recommendations : null,
        req.params.id,
      ]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Survey not found' });
    res.json(rowToSurvey(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** DELETE /api/surveys/:id – delete a survey */
app.delete('/api/surveys/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM surveys WHERE id = $1',
      [req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Survey not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { app, initSchema };
