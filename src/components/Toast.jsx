export function ToastContainer({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'success' && <span>✓</span>}
          {t.type === 'error' && <span>✕</span>}
          {t.type === 'info' && <span>ℹ</span>}
          {t.message}
        </div>
      ))}
    </div>
  );
}
