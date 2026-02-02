import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const chatApi = {
  // Get all chats
  getChats: async () => {
    const response = await axios.get(`${API}/chats`);
    return response.data;
  },

  // Create a new chat
  createChat: async (title = 'New Chat') => {
    const response = await axios.post(`${API}/chats`, { title });
    return response.data;
  },

  // Get a specific chat with messages
  getChat: async (chatId) => {
    const response = await axios.get(`${API}/chats/${chatId}`);
    return response.data;
  },

  // Delete a chat
  deleteChat: async (chatId) => {
    const response = await axios.delete(`${API}/chats/${chatId}`);
    return response.data;
  },

  // Send a message and get AI response
  sendMessage: async (chatId, content) => {
    const response = await axios.post(`${API}/chats/${chatId}/messages`, { content });
    return response.data;
  },

  // Update chat title
  updateChatTitle: async (chatId, title) => {
    const response = await axios.put(`${API}/chats/${chatId}/title?title=${encodeURIComponent(title)}`);
    return response.data;
  }
};
