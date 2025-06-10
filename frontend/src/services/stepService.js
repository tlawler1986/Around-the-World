import sendRequest from "./sendRequest";

const BASE_URL = '/api/steps'; 

export async function getSteps(userId) {
  const res = await fetch(`${BASE_URL}?user_id=${userId}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch steps');
  return await res.json();
}

export async function create(stepData) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stepData),
  });
  if (!res.ok) throw new Error('Failed to create step');
  return await res.json();
}

export async function update(id, stepData) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stepData),
  });
  if (!res.ok) throw new Error('Failed to update step');
  return await res.json();
}

export async function remove(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete step');
  return await res.json();
}
