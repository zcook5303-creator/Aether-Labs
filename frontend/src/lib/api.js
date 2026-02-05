import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Get or create a unique user ID for this browser
const getUserId = () => {
  let userId = localStorage.getItem('aether_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    localStorage.setItem('aether_user_id', userId);
  }
  return userId;
};

export const chatApi = {
  getUserId,

  // Generate an AI image
  generateImage: async (prompt) => {
    const response = await axios.post(`${API}/generate-image`, { prompt });
    return response.data;
  },

  getChats: async () => {
    const userId = getUserId();
    const response = await axios.get(`${API}/chats?user_id=${userId}`);
    return response.data;
  },

  createChat: async (title = 'New Chat') => {
    const userId = getUserId();
    const response = await axios.post(`${API}/chats`, { title, user_id: userId });
    return response.data;
  },

  getChat: async (chatId) => {
    const response = await axios.get(`${API}/chats/${chatId}`);
    return response.data;
  },

  deleteChat: async (chatId) => {
    const response = await axios.delete(`${API}/chats/${chatId}`);
    return response.data;
  },

  sendMessage: async (chatId, content) => {
    const response = await axios.post(`${API}/chats/${chatId}/messages`, { content });
    return response.data;
  },

  updateChatTitle: async (chatId, title) => {
    const response = await axios.put(`${API}/chats/${chatId}/title?title=${encodeURIComponent(title)}`);
    return response.data;
  }
};
