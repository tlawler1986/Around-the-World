import sendRequest from "./sendRequest";

const BASE_URL = '/api/auth';

export async function signUp(userData) {
  const token = await sendRequest(BASE_URL + '/signup', 'POST', userData);
  localStorage.setItem('token', token);
  return getUser();
}

export async function logIn(credentials) {
  const token = await sendRequest(`${BASE_URL}/login`, 'POST', credentials);
  localStorage.setItem('token', token);
  return getUser();
}

export function getUser() {
  const token = getToken();
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1])).user;
  } catch (err) {
    console.error("Error parsing token payload:", err);
    return null;
  }
}

export function getToken() {
  const token = localStorage.getItem('token');
  console.log('getToken() returns:', token);
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return null;
    }
  } catch (err) {
    console.error('Error decoding token:', err);
    localStorage.removeItem('token');
    return null;
  }
  return token;
}

export function logOut() {
  localStorage.removeItem('token');
}