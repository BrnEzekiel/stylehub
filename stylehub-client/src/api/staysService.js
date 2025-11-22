import axios from './axiosConfig';

const API_BASE_URL = '/stays';
const BOOKINGS_API_BASE_URL = '/stay-bookings';

export const staysService = {
  // Stay CRUD operations
  getAllStays: async (params = {}) => {
    try {
      const response = await axios.get(API_BASE_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching stays:', error);
      throw error;
    }
  },

  searchStays: async (query, page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search`, {
        params: { query, page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching stays:', error);
      throw error;
    }
  },

  getStayById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stay:', error);
      throw error;
    }
  },

  createStay: async (stayData, images) => {
    try {
      const formData = new FormData();

      // Add stay data
      Object.keys(stayData).forEach(key => {
        if (key === 'amenities') {
          formData.append(key, JSON.stringify(stayData[key]));
        } else {
          formData.append(key, stayData[key]);
        }
      });

      // Add images
      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append('images', image);
        });
      }

      const response = await axios.post(API_BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating stay:', error);
      throw error;
    }
  },

  updateStay: async (id, stayData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, stayData);
      return response.data;
    } catch (error) {
      console.error('Error updating stay:', error);
      throw error;
    }
  },

  deleteStay: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting stay:', error);
      throw error;
    }
  },

  getMyStays: async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/my-stays`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching my stays:', error);
      throw error;
    }
  },

  addStayImages: async (stayId, images) => {
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append('images', image);
      });

      const response = await axios.post(`${API_BASE_URL}/${stayId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding stay images:', error);
      throw error;
    }
  },

  setPrimaryImage: async (stayId, imageId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${stayId}/images/${imageId}/primary`);
      return response.data;
    } catch (error) {
      console.error('Error setting primary image:', error);
      throw error;
    }
  },

  deleteStayImage: async (stayId, imageId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${stayId}/images/${imageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting stay image:', error);
      throw error;
    }
  },

  // Booking operations
  createBooking: async (bookingData) => {
    try {
      const response = await axios.post(BOOKINGS_API_BASE_URL, bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  getMyBookings: async (page = 1, limit = 10, status) => {
    try {
      const params = { page, limit };
      if (status) params.status = status;

      const response = await axios.get(BOOKINGS_API_BASE_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching my bookings:', error);
      throw error;
    }
  },

  getHostBookings: async (page = 1, limit = 10, status) => {
    try {
      const params = { page, limit };
      if (status) params.status = status;

      const response = await axios.get(`${BOOKINGS_API_BASE_URL}/host`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching host bookings:', error);
      throw error;
    }
  },

  getBookingById: async (id) => {
    try {
      const response = await axios.get(`${BOOKINGS_API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  updateBooking: async (id, bookingData) => {
    try {
      const response = await axios.put(`${BOOKINGS_API_BASE_URL}/${id}`, bookingData);
      return response.data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  updateBookingStatus: async (id, status, notes) => {
    try {
      const response = await axios.put(`${BOOKINGS_API_BASE_URL}/${id}/status`, {
        status,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  cancelBooking: async (id, reason) => {
    try {
      const response = await axios.delete(`${BOOKINGS_API_BASE_URL}/${id}`, {
        data: { reason }
      });
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },
};

export default staysService;
