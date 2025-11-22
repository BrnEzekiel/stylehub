// src/api/serviceService.js
import apiClient from './axiosConfig';

/**
 * Fetch all public services (with optional category filter)
 */
export const getServices = async (params = {}) => {
  try {
    const response = await apiClient.get('/services', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch services.');
  }
};

/**
 * Fetch a single service by ID
 */
export const getServiceById = async (id) => {
  try {
    const response = await apiClient.get(`/services/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Service not found.');
  }
};

/**
 * Create a new service (provider only)
 */
export const createService = async (formData) => {
  try {
    const response = await apiClient.post('/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create service.');
  }
};

/**
 * Fetch all services for the logged-in provider
 */
export const getMyServices = async () => {
  try {
    const response = await apiClient.get('/services/my-services');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch your services.');
  }
};

/**
 * Create a new booking (client only)
 */
export const createBooking = async (bookingData) => {
  try {
    // Make sure bookingData includes `paymentMethod`
    const response = await apiClient.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to book service.');
  }
};

/**
 * Get all bookings for the logged-in client
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
 * Get all bookings for the logged-in provider
 */
export const getMyProviderBookings = async () => {
  try {
    const response = await apiClient.get('/bookings/my-provider-bookings');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch your bookings.');
  }
};

/**
 * Update a booking status (provider or admin)
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await apiClient.patch(`/bookings/${bookingId}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update booking status.');
  }
};

/**
 * Cancel a booking (client only)
 */
export const cancelBooking = async (bookingId) => {
  try {
    const response = await apiClient.patch(`/bookings/${bookingId}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to cancel booking.');
  }
};

/**
 * Download booking confirmation PDF
 */
export const downloadBookingConfirmation = async (bookingId) => {
  try {
    const response = await apiClient.get(`/bookings/${bookingId}/confirmation`, {
      responseType: 'blob',
    });

    // Create a link and click it to trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const filename = `BookingConfirmation-${bookingId.substring(0, 8)}.pdf`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download confirmation error:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to download confirmation.');
  }
};