import sendRequest from './sendRequest';

const BASE_URL = '/api/journeys';

export function index() {
  return sendRequest(BASE_URL);
}

export function getJourneyById(id) {
  return sendRequest(`${BASE_URL}/${id}`);
}

export function create(journeyData) {
  return sendRequest(BASE_URL, 'POST', journeyData);
}

export function update(id, journeyData) {
  return sendRequest(`${BASE_URL}/${id}`, 'PUT', journeyData);
}

export function remove(id) {
  return sendRequest(`${BASE_URL}/${id}`, 'DELETE');
}

export function getJourneysByUserId(userId) {
  return sendRequest(`/api/journeys/user/${userId}`);
}

export function addComment(journeyId, commentData) {
  return sendRequest(`${BASE_URL}/${journeyId}/comments`, 'POST', commentData);
}

export function deleteComment(journeyId, commentId) {
  return sendRequest(`${BASE_URL}/${journeyId}/comments/${commentId}`, 'DELETE');
}
