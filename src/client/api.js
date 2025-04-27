import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://wardrobe-app-xb6n.onrender.com/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    ContenType: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    //
    const token = localStorage.getItem("AuthToken");
    //
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth //
export const registerUser = (userData) =>
  apiClient.post("/auth/register", userData);
export const loginUser = (credentials) =>
  apiClient.post("/auth/login", credentials);
export const getMe = () => apiClient.get("/auth/me");

// Outfits //
export const getPublicOutfits = () => apiClient.get("/outfits");
export const getOutfitById = (outfitId) =>
  apiClient.get(`/outfits/${outfitId}`);
export const getOutfitClothing = (outfitId) =>
  apiClient.get(`/outfits/${outfitId}/clothing`);
export const getUserOutfits = (userId) =>
  apiClient.get(`/users/${userId}/outfits`);
export const createOutfit = (outfitData) =>
  apiClient.post("/outfits", outfitData);
export const updateOutfit = (outfitId, outfitData) =>
  apiClient.put(`/outfits/${outfitId}`, outfitData);
export const deleteOutfit = (outfitId, data) =>
  apiClient.delete(`/outfits/${outfitId}`, { data });
export const addClothingToOutfit = (outfitId, clothingId, userId) =>
  apiClient.post(`/outfits/${outfitId}/clothing/${clothingId}`, {
    user_id: userId,
  });

// Clothing (Items) //
export const getClothingById = (clothingId) =>
  apiClient.get(`/clothing/${clothingId}`);
export const getUserClothing = (userId) =>
  apiClient.get(`/users/${userId}/clothing`);
export const createClothing = (clothingData) =>
  apiClient.post("/clothing", clothingData);
export const updateClothing = (clothingId, clothingData) =>
  apiClient.put(`/clothing/${clothingId}`, clothingData);
export const deleteClothing = (clothingId, data) =>
  apiClient.delete(`/clothing/${clothingId}`, {data});

// Tags //
export const getClothingTags = (clothingId) =>
  apiClient.get(`/clothing/${clothingId}/clothingTags`);
export const addClothingTag = (clothingId, tagData) =>
  apiClient.post(`/clothing/${clothingId}/clothingTags`, tagData);
export const deleteClothingTag = (clothingTagId) =>
  apiClient.delete(`/clothingTags/${clothingTagId}`);
export const getOutfitTags = (outfitId) =>
  apiClient.get(`/outfits/${outfitId}/outfitTags`);
export const addOutfitTag = (outfitId, tagData) =>
  apiClient.post(`/outfits/${outfitId}/outfitTags`, tagData);
export const deleteOutfitTag = (outfitTagId) =>
  apiClient.delete(`/outfitTags/${outfitTagId}`);

// Comments //
export const getOutfitComments = (outfitId) =>
  apiClient.get(`/outfits/${outfitId}/comments`);
export const getCommentById = (outfitId, commentId) =>
  apiClient.get(`/outfits/${outfitId}/comments/${commentId}`);
export const createComment = (outfitId, written_rating) =>
  apiClient.post(`/outfits/${outfitId}/comments`, written_rating);
export const updateComment = (userId, commentId, written_rating) =>
  apiClient.put(`/users/${userId}/comments/${commentId}`, written_rating);
export const deleteComment = (userId, commentId) =>
  apiClient.delete(`/users/${userId}/comments/${commentId}`);
export const getMyComments = () => apiClient.get("/comments/me");
export const getUserById = (userId) => apiClient.get(`/users/${userId}`);

// Admin //
export const getAllUsers = () => apiClient.get("/users");
export const getAllClothing = () => apiClient.get("/clothing");

export default apiClient;
