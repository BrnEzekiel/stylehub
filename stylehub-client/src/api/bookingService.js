// src/api/bookingService.js

import apiClient from './axiosConfig';

/**
 * (Client) Creates a new booking.
 * @param {object} bookingData - { serviceId, startTime, isHomeService, paymentMethod }
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await apiClient.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create booking.');
  }
};

/**
 * (Client) Fetches all bookings for the logged-in client.
 */
export const getClientBookings = async () => {
  try {
    const response = await apiClient.get('/bookings/my-bookings');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch your bookings.');
  }
};

/**
 * (Provider) Fetches all bookings for the logged-in provider.
 */
export const getProviderBookings = async () => {
  try {
    const response = await apiClient.get('/bookings/my-provider-bookings');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch your bookings.');
  }
};

/**
 * (Provider/Client) Updates the status of a booking.
 * @param {string} bookingId - The ID of the booking
 * @param {string} status - The new status (e.g., 'confirmed', 'completed', 'cancelled')
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    // Note: The API will handle role-based permissions
    const response = await apiClient.patch(`/bookings/${bookingId}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update booking status.');
  }
};