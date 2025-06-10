import sendRequest from "./sendRequest";

const BASE_URL = '/api/journeys';

function getToken() {
  return localStorage.getItem('token');
}

export async function index() {
  const token = getToken();
  if (!token) throw new Error('No auth token found');

  const res = await fetch(BASE_URL, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Failed to fetch journeys');
  return await res.json();
}

export async function create(journeyData) {
  const token = getToken();
  if (!token) throw new Error('No auth token found');

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(journeyData),
  });
  if (!res.ok) throw new Error('Failed to create journey');
  return await res.json();
}

export async function update(id, journeyData) {
  const token = getToken();
  if (!token) throw new Error('No auth token found');

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(journeyData),
  });
  if (!res.ok) throw new Error('Failed to update journey');
  return await res.json();
}

export async function remove(id) {
  const token = getToken();
  if (!token) throw new Error('No auth token found');

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Failed to delete journey');
  return await res.json();
}