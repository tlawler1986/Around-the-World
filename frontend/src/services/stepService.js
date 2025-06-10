import sendRequest from "./sendRequest";

const BASE_URL = '/api/steps';

function getToken() {
  return localStorage.getItem('token');
}

export async function getSteps() {
  const token = getToken();
  if (!token) throw new Error('No auth token found');

  const res = await fetch(BASE_URL, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Failed to fetch steps');
  return await res.json();
}

export async function create(stepData) {
  const token = getToken();
  if (!token) throw new Error('No auth token found');

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(stepData),
  });
  if (!res.ok) throw new Error('Failed to create step');
  return await res.json();
}

export async function update(id, stepData) {
  const token = getToken();
  if (!token) throw new Error('No auth token found');

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(stepData),
  });
  if (!res.ok) throw new Error('Failed to update step');
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
  if (!res.ok) throw new Error('Failed to delete step');
  return await res.json();
}