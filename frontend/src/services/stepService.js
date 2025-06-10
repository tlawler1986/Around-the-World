import sendRequest from './sendRequest';

const BASE_URL = '/api/steps';

export function getSteps() {
  return sendRequest(BASE_URL);
}

export function create(stepData) {
  return sendRequest(BASE_URL, 'POST', stepData);
}

export function update(id, stepData) {
  return sendRequest(`${BASE_URL}/${id}`, 'PUT', stepData);
}

export function remove(id) {
  return sendRequest(`${BASE_URL}/${id}`, 'DELETE');
}
