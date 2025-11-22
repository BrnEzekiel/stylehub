import apiClient from './axiosConfig';

export const fetchPosts = async () => {
  try {
    const res = await apiClient.get('/community/posts');
    return res.data;
  } catch (err) {
    console.warn('fetchPosts error, falling back to client-side mocks', err?.message || err);
    throw err;
  }
};

export const createPost = async (payload) => {
  try {
    const res = await apiClient.post('/community/posts', payload);
    return res.data;
  } catch (err) {
    console.error('createPost failed', err?.response?.data || err?.message || err);
    throw err;
  }
};

export const addComment = async (postId, payload) => {
  try {
    const res = await apiClient.post(`/community/posts/${postId}/comments`, payload);
    return res.data;
  } catch (err) {
    console.error('addComment failed', err?.response?.data || err?.message || err);
    throw err;
  }
};

// Reuse existing reviews endpoint for product/service reviews. For community posts we send type='post'
export const submitReview = async (payload) => {
  try {
    const res = await apiClient.post('/reviews', payload);
    return res.data;
  } catch (err) {
    console.error('submitReview failed', err?.response?.data || err?.message || err);
    throw err;
  }
};
