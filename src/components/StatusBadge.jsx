import { STATUS_LABELS, STATUS_BADGE_CLASS } from '../utils/constants.js';

export function StatusBadge({ status }) {
  return (
    <span className={`badge ${STATUS_BADGE_CLASS[status] || ''}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
