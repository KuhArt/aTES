import api from 'services/api.service';

export const getCurrentStats = () => {
  return api.get('/accounting/current-stats');
};

export const getTotals = () => {
  return api.get('/accounting/totals');
};

export const getTasksStats = () => {
  return api.get('/accounting/tasks-stats');
};
