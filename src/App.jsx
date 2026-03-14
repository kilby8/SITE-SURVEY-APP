import { useState, useCallback } from 'react';
import './App.css';
import { Navbar } from './components/Navbar.jsx';
import { ToastContainer } from './components/Toast.jsx';
import { SurveyList } from './pages/SurveyList.jsx';
import { SurveyForm } from './pages/SurveyForm.jsx';
import { SurveyDetail } from './pages/SurveyDetail.jsx';
import { useToast } from './hooks/useToast.js';
import { VIEW } from './utils/views.js';
import {
  getSurveys,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  getSurveyById,
} from './utils/storage.js';

function App() {
  const [view, setView] = useState(VIEW.LIST);
  const [selectedId, setSelectedId] = useState(null);
  const [surveys, setSurveys] = useState(() => getSurveys());
  const { toasts, addToast } = useToast();

  const refreshSurveys = useCallback(() => setSurveys(getSurveys()), []);

  function navigate(newView, id = null) {
    setView(newView);
    setSelectedId(id);
  }

  function handleCreate(formData) {
    createSurvey(formData);
    refreshSurveys();
    navigate(VIEW.LIST);
  }

  function handleUpdate(formData) {
    updateSurvey(selectedId, formData);
    refreshSurveys();
    navigate(VIEW.DETAIL, selectedId);
  }

  function handleDelete(id) {
    deleteSurvey(id);
    refreshSurveys();
  }

  const selectedSurvey = selectedId ? getSurveyById(selectedId) : null;

  return (
    <div className="app">
      <Navbar currentView={view} onNavigate={navigate} />
      <main className="main-content">
        {view === VIEW.LIST && (
          <SurveyList
            surveys={surveys}
            onNavigate={navigate}
            onDelete={handleDelete}
            addToast={addToast}
          />
        )}
        {view === VIEW.CREATE && (
          <SurveyForm
            onSave={handleCreate}
            onCancel={() => navigate(VIEW.LIST)}
            addToast={addToast}
          />
        )}
        {view === VIEW.EDIT && (
          <SurveyForm
            existing={selectedSurvey}
            onSave={handleUpdate}
            onCancel={() => navigate(selectedSurvey ? VIEW.DETAIL : VIEW.LIST, selectedId)}
            addToast={addToast}
          />
        )}
        {view === VIEW.DETAIL && (
          <SurveyDetail
            survey={selectedSurvey}
            onNavigate={navigate}
          />
        )}
      </main>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default App;
