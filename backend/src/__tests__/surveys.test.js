'use strict';

require('dotenv').config();
const request = require('supertest');
const { app, initSchema } = require('../app');
const { pool } = require('../db');

// Minimal valid survey payload
const BASE_SURVEY = {
  siteName: 'Test Tower Alpha',
  location: '123 Test Street, Testville',
  surveyDate: '2024-06-01',
  surveyorName: 'Jane Smith',
};

beforeAll(async () => {
  await initSchema();
  // Start each test run with a clean surveys table
  await pool.query('DELETE FROM surveys');
});

afterAll(async () => {
  await pool.query('DELETE FROM surveys');
  await pool.end();
});

describe('GET /api/surveys', () => {
  it('returns an empty array when no surveys exist', async () => {
    const res = await request(app).get('/api/surveys');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('POST /api/surveys', () => {
  it('creates a survey and returns 201 with the new record', async () => {
    const res = await request(app).post('/api/surveys').send(BASE_SURVEY);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      siteName: 'Test Tower Alpha',
      location: '123 Test Street, Testville',
      surveyDate: '2024-06-01',
      surveyorName: 'Jane Smith',
      status: 'planned',
    });
    expect(res.body.id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app).post('/api/surveys').send({ siteName: 'Incomplete' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('creates a survey with all optional fields', async () => {
    const full = {
      ...BASE_SURVEY,
      siteName: 'Full Survey Site',
      siteId: 'FSS-001',
      surveyType: 'RF Planning Survey',
      siteType: 'Rooftop',
      latitude: 40.7128,
      longitude: -74.006,
      surveyorContact: 'jane@example.com',
      status: 'in-progress',
      structureHeight: 30,
      antennaHeight: 25,
      power: '240V AC',
      accessRequirements: 'Key from building manager',
      equipmentList: '4G antenna, power meter',
      notes: 'Good visibility from rooftop',
      recommendations: 'Proceed with installation',
    };
    const res = await request(app).post('/api/surveys').send(full);
    expect(res.status).toBe(201);
    expect(res.body.siteId).toBe('FSS-001');
    expect(res.body.status).toBe('in-progress');
    expect(res.body.latitude).toBe(40.7128);
  });
});

describe('GET /api/surveys/:id', () => {
  let createdId;

  beforeAll(async () => {
    const res = await request(app).post('/api/surveys').send(BASE_SURVEY);
    createdId = res.body.id;
  });

  it('returns the survey by id', async () => {
    const res = await request(app).get(`/api/surveys/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdId);
    expect(res.body.siteName).toBe('Test Tower Alpha');
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app).get(
      '/api/surveys/00000000-0000-0000-0000-000000000000'
    );
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/surveys/:id', () => {
  let createdId;

  beforeAll(async () => {
    const res = await request(app).post('/api/surveys').send(BASE_SURVEY);
    createdId = res.body.id;
  });

  it('updates allowed fields and returns the updated record', async () => {
    const res = await request(app)
      .put(`/api/surveys/${createdId}`)
      .send({ status: 'completed', notes: 'Survey done.' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('completed');
    expect(res.body.notes).toBe('Survey done.');
    // unchanged fields should be preserved
    expect(res.body.siteName).toBe('Test Tower Alpha');
  });

  it('returns 404 when updating a non-existent survey', async () => {
    const res = await request(app)
      .put('/api/surveys/00000000-0000-0000-0000-000000000000')
      .send({ status: 'cancelled' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/surveys/:id', () => {
  let createdId;

  beforeAll(async () => {
    const res = await request(app).post('/api/surveys').send(BASE_SURVEY);
    createdId = res.body.id;
  });

  it('deletes the survey and returns 204', async () => {
    const del = await request(app).delete(`/api/surveys/${createdId}`);
    expect(del.status).toBe(204);

    // confirm it's gone
    const get = await request(app).get(`/api/surveys/${createdId}`);
    expect(get.status).toBe(404);
  });

  it('returns 404 when deleting a non-existent survey', async () => {
    const res = await request(app).delete(
      '/api/surveys/00000000-0000-0000-0000-000000000000'
    );
    expect(res.status).toBe(404);
  });
});
