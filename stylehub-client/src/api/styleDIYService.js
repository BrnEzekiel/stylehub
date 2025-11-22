// src/api/styleDIYService.js
import apiClient from './axiosConfig';

export const getStyleDIYPosts = async (params = {}) => {
  const { postId, ...restParams } = params;
  try {
    if (postId) {
      // Fetch a single post by ID and wrap it in posts array for consistency
      const post = await getStyleDIYPostById(postId);
      return { posts: [post], total: 1, page: 1, limit: 1, totalPages: 1 };
    } else {
      // Fetch all posts
      const response = await apiClient.get('/style-diy', { params: restParams });
      return response.data;
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch posts.');
  }
};

export const getStyleDIYPostById = async (postId) => {
  try {
    const response = await apiClient.get(`/style-diy/${postId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch post.');
  }
};

export const createStyleDIYPost = async (postData) => {
  try {
    const formData = new FormData();

    // Add text fields - title is required
    formData.append('title', postData.title || '');
    if (postData.content) formData.append('content', postData.content);
    if (postData.productId) formData.append('productId', postData.productId);
    if (postData.serviceId) formData.append('serviceId', postData.serviceId);
    if (postData.topic) formData.append('topic', postData.topic);

    // Add files if they are File objects - user can pick either image OR video
    if (postData.image instanceof File) {
      formData.append('image', postData.image);
    }
    if (postData.video instanceof File) {
      formData.append('video', postData.video);
    }

    // Let axios set the Content-Type header (including the boundary)
    const response = await apiClient.post('/style-diy', formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create post.');
  }
};

export const likeStyleDIYPost = async (postId) => {
  try {
    const response = await apiClient.post(`/style-diy/${postId}/like`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to like post.');
  }
};

export const addStyleDIYComment = async (postId, { content, parentCommentId }) => {
  try {
    const response = await apiClient.post(`/style-diy/${postId}/comments`, { content, parentCommentId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add comment.');
  }
};

export const addStyleDIYRecommendation = async (postId, recommendationData) => {
  try {
    const response = await apiClient.post(`/style-diy/${postId}/recommendations`, recommendationData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add recommendation.');
  }
};

export const deleteStyleDIYPost = async (postId) => {
  try {
    const response = await apiClient.delete(`/style-diy/${postId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete post.');
  }
};
