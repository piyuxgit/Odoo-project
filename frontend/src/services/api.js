import axios from 'axios';

const API = axios.create({ baseURL: 'https://odoo-project-vrrs.onrender.com/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const loginAPI = (data) => API.post('/auth/login', data);
export const registerAPI = (data) => API.post('/auth/register', data);
export const getProfileAPI = () => API.get('/auth/profile');

// Trips
export const getTripsAPI = () => API.get('/trips');
export const getTripAPI = (id) => API.get(`/trips/${id}`);
export const createTripAPI = (data) => API.post('/trips', data);
export const updateTripAPI = (id, data) => API.put(`/trips/${id}`, data);
export const deleteTripAPI = (id) => API.delete(`/trips/${id}`);
export const getDashboardStatsAPI = () => API.get('/trips/stats');

// Itinerary
export const addStopAPI = (data) => API.post('/itinerary/stops', data);
export const updateStopAPI = (id, data) => API.put(`/itinerary/stops/${id}`, data);
export const deleteStopAPI = (id) => API.delete(`/itinerary/stops/${id}`);
export const reorderStopsAPI = (data) => API.put('/itinerary/stops/reorder', data);
export const addActivityToStopAPI = (data) => API.post('/itinerary/activities', data);
export const removeActivityAPI = (id) => API.delete(`/itinerary/activities/${id}`);

// Budget
export const getBudgetAPI = (tripId) => API.get(`/budget/${tripId}`);
export const upsertBudgetAPI = (data) => API.post('/budget', data);

// Expenses
export const getExpensesAPI = (tripId) => API.get(`/expenses/${tripId}`);
export const addExpenseAPI = (data) => API.post('/expenses', data);
export const deleteExpenseAPI = (id) => API.delete(`/expenses/${id}`);

// Packing
export const getPackingItemsAPI = (tripId) => API.get(`/packing/${tripId}`);
export const addPackingItemAPI = (data) => API.post('/packing', data);
export const togglePackingItemAPI = (id) => API.put(`/packing/${id}/toggle`);
export const deletePackingItemAPI = (id) => API.delete(`/packing/${id}`);
export const resetPackingAPI = (tripId) => API.put(`/packing/${tripId}/reset`);

// Notes
export const getNotesAPI = (tripId) => API.get(`/notes/${tripId}`);
export const createNoteAPI = (data) => API.post('/notes', data);
export const updateNoteAPI = (id, data) => API.put(`/notes/${id}`, data);
export const deleteNoteAPI = (id) => API.delete(`/notes/${id}`);

// Sharing
export const shareTripAPI = (data) => API.post('/share', data);
export const getSharedTripAPI = (slug) => API.get(`/share/${slug}`);
export const copyTripAPI = (slug) => API.post(`/share/${slug}/copy`);
export const unshareTripAPI = (tripId) => API.delete(`/share/${tripId}`);

// User / Admin
export const updateProfileAPI = (data) => API.put('/users/profile', data);
export const deleteAccountAPI = () => API.delete('/users/account');
export const getAdminUsersAPI = () => API.get('/users/admin/users');
export const getAdminAnalyticsAPI = () => API.get('/users/admin/analytics');

export default API;
