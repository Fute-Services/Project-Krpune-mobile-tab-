import localClient from '../api/localClient';

// Offline: returns bundled /floors JSON in the same { data } envelope the
// original axios call produced, so callers using `res.data.data` work unchanged.
export const getFloors = () => {
  return localClient.get('/floors');
};
