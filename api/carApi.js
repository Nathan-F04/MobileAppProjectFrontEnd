// carApi
// - Purpose: Centralized car-related HTTP calls to the backend REST API.
// - Exports:
//    - getCars(): GET /cars -> returns array of cars
//    - createCar(body): POST /cars -> creates car
//    - updateCar(id, body): PUT /cars/:id -> updates car
//    - deleteCar(id): DELETE /cars/:id -> deletes car
// - Notes: All functions throw on non-OK responses. BASE_URL should point to backend server.

import { BASE_URL as CONFIG_BASE_URL } from '../config.example';
import { getAuthHeaders } from './authToken';

const BASE_URL = CONFIG_BASE_URL || 'https://your-backend.example';

// Fetch the list of cars from the backend.
// Throws an Error if the response is not ok.
async function getCars() {
  const res = await fetch(`${BASE_URL}/cars`, {
    headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true', ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}

// Create a car by POSTing the provided body (expects JSON serializable body).
// Returns parsed JSON response when available; throws on non-OK responses.
async function createCar(body) {
  const res = await fetch(`${BASE_URL}/cars`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true', ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server: ${res.status} ${text}`);
  }
  try {
    return await res.json();
  } catch (err) {
    return null;
  }
}

// Update an existing car by id using PUT. Body should contain the updated fields.
// Throws on non-OK responses and returns parsed JSON when available.
async function updateCar(id, body) {
  const res = await fetch(`${BASE_URL}/cars/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true', ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server: ${res.status} ${text}`);
  }
  try {
    return await res.json();
  } catch (err) {
    return null;
  }
}

// Delete a car by id. Returns true on success, throws on failure.
async function deleteCar(id) {
  const res = await fetch(`${BASE_URL}/cars/${id}`, {
    method: 'DELETE',
    headers: { 'ngrok-skip-browser-warning': 'true', ...getAuthHeaders() },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server: ${res.status} ${text}`);
  }
  return true;
}

export default {
  getCars,
  createCar,
  updateCar,
  deleteCar,
};