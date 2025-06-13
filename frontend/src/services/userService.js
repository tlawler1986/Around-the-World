import sendRequest from './sendRequest';

const BASE_URL = '/api/users';

export function getRecentUsers() {
   return sendRequest(`${BASE_URL}/recent`, 'GET', null, { credentials: 'omit' });
}

export function getUserById(id) {
  return sendRequest(`${BASE_URL}/${id}`);
}

export function getCurrentUser() {
  return sendRequest(`${BASE_URL}/me`);
}