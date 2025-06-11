import sendRequest from './sendRequest';

const BASE_URL = '/api/badges';

export function getBadges() {
  return sendRequest('/api/badges');
}

export async function evaluateBadges(totalMilesTraveled) {
  return sendRequest(`${BASE_URL}/evaluate`, 'POST', { totalMilesTraveled });
}