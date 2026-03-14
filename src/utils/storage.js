const STORAGE_KEY = 'site_surveys';

export function getSurveys() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSurveys(surveys) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(surveys));
}

export function getSurveyById(id) {
  return getSurveys().find(s => s.id === id) || null;
}

export function createSurvey(survey) {
  const surveys = getSurveys();
  const newSurvey = {
    ...survey,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  surveys.unshift(newSurvey);
  saveSurveys(surveys);
  return newSurvey;
}

export function updateSurvey(id, updates) {
  const surveys = getSurveys();
  const idx = surveys.findIndex(s => s.id === id);
  if (idx === -1) return null;
  surveys[idx] = { ...surveys[idx], ...updates, updatedAt: new Date().toISOString() };
  saveSurveys(surveys);
  return surveys[idx];
}

export function deleteSurvey(id) {
  const surveys = getSurveys().filter(s => s.id !== id);
  saveSurveys(surveys);
}
