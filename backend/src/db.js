'use strict';

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'site_survey',
  user: process.env.DB_USER || 'survey_user',
  password: process.env.DB_PASSWORD || 'survey_pass',
});

/**
 * Run the DDL that creates the surveys table if it does not already exist.
 */
async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS surveys (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      site_name       TEXT NOT NULL,
      site_id         TEXT,
      survey_type     TEXT,
      site_type       TEXT,
      location        TEXT NOT NULL,
      latitude        NUMERIC,
      longitude       NUMERIC,
      survey_date     DATE NOT NULL,
      surveyor_name   TEXT NOT NULL,
      surveyor_contact TEXT,
      status          TEXT NOT NULL DEFAULT 'planned',
      structure_height NUMERIC,
      antenna_height  NUMERIC,
      power           TEXT,
      access_requirements TEXT,
      equipment_list  TEXT,
      notes           TEXT,
      recommendations TEXT,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

module.exports = { pool, initSchema };
