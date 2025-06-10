import sendRequest from './sendRequest';

const BASE_URL = '/api/journeys';

export function index() {
  return sendRequest(BASE_URL);
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
