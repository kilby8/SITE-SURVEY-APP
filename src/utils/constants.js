export const SURVEY_STATUS = {
  PLANNED: 'planned',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const STATUS_LABELS = {
  [SURVEY_STATUS.PLANNED]: 'Planned',
  [SURVEY_STATUS.IN_PROGRESS]: 'In Progress',
  [SURVEY_STATUS.COMPLETED]: 'Completed',
  [SURVEY_STATUS.CANCELLED]: 'Cancelled',
};

export const STATUS_BADGE_CLASS = {
  [SURVEY_STATUS.PLANNED]: 'badge-planned',
  [SURVEY_STATUS.IN_PROGRESS]: 'badge-in-progress',
  [SURVEY_STATUS.COMPLETED]: 'badge-completed',
  [SURVEY_STATUS.CANCELLED]: 'badge-cancelled',
};

export const SITE_TYPES = [
  'Rooftop',
  'Ground Mount',
  'Tower',
  'Monopole',
  'Lattice Tower',
  'Building Facade',
  'Water Tower',
  'Utility Pole',
  'Other',
];

export const SURVEY_TYPES = [
  'Initial Site Survey',
  'Feasibility Study',
  'Structural Assessment',
  'RF Planning Survey',
  'Antenna Survey',
  'Civil Works Survey',
  'Power Survey',
  'Final Inspection',
];
