// useCars hook
// - Purpose: Encapsulates car list state and CRUD operations against the backend API.
// - Key outputs (returned object):
//    - cars: array of car objects
//    - loading: boolean indicating fetch/delete operations in progress
//    - posting: boolean indicating create/update in progress
//    - fetchCars(): loads cars from API and updates `cars`
//    - createCar(body): creates a car then refreshes list
//    - updateCar(id, body): updates a car then refreshes list
//    - deleteCar(id): deletes a car then refreshes list
// - Notes: Delegates actual HTTP calls to `api/carApi.js` and keeps simple loading/posting flags.

import { useState } from 'react';
import carApi from '../api/carApi';

export default function useCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  // fetchCars: fetches car list and updates state
  // - sets loading flag while the request is in-flight
  // - on success sets `cars` to the returned array (or empty array)
  async function fetchCars() {
    setLoading(true);
    try {
      const data = await carApi.getCars();
      setCars(Array.isArray(data) ? data : []);
      return data;
    } finally {
      setLoading(false);
    }
  }

  // createCar: POST body to API, then refresh the list
  // - sets posting flag while request is in-flight
  async function createCar(body) {
    setPosting(true);
    try {
      const res = await carApi.createCar(body);
      await fetchCars();
      return res;
    } finally {
      setPosting(false);
    }
  }

  // updateCar: PUT to API for given id, then refresh list
  // - sets posting flag while request is in-flight
  async function updateCar(id, body) {
    setPosting(true);
    try {
      const res = await carApi.updateCar(id, body);
      await fetchCars();
      return res;
    } finally {
      setPosting(false);
    }
  }

  // deleteCar: DELETE request for id, then refresh list
  // - uses loading flag while removing and refetching
  async function deleteCar(id) {
    setLoading(true);
    try {
      await carApi.deleteCar(id);
      await fetchCars();
    } finally {
      setLoading(false);
    }
  }

  return {
    cars,
    loading,
    posting,
    fetchCars,
    createCar,
    updateCar,
    deleteCar,
  };
}
