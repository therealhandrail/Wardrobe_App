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
      config.headers.Authorization = `Bearer ${token}`;
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
export const deleteOutfit = (outfitId) =>
  apiClient.delete(`/outfits/${outfitId}`);
export const addClothingToOutfit = (outfitId, clothingId, userId) =>
  apiClient.post(`/outfits/${outfitId}/clothing/${clothingId}`, { user_id: userId });

// Clothing (Items) //
export const getClothingById = (clothingId) =>
  apiClient.get(`/clothing/${clothingId}`);
export const getUserClothing = (userId) =>
  apiClient.get(`/users/${userId}/clothing`);
export const createClothing = (clothingData) =>
  apiClient.post("/clothing", clothingData);
export const updateClothing = (clothingId, clothingData) =>
  apiClient.put(`/clothing/${clothingId}`, clothingData);
export const deleteClothing = (clothingId) =>
  apiClient.delete(`/clothing/${clothingId}`);

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

// Reviews //
export const getOutfitReviews = (outfitId) =>
  apiClient.get(`/outfits/${outfitId}/reviews`);
export const getReviewById = (outfitId, reviewId) =>
  apiClient.get(`/outfits/${outfitId}/reviews/${reviewId}`);
export const createReview = (outfitId, reviewData) =>
  apiClient.post(`/outfits/${outfitId}/reviews`, reviewData);
export const updateReview = (userId, reviewId, reviewData) =>
  apiClient.put(`/users/${userId}/reviews/${reviewId}`, reviewData);
export const deleteReview = (userId, reviewId) =>
  apiClient.delete(`/users/${userId}/reviews/${reviewId}`);
export const getMyReviews = () => apiClient.get("/reviews/me");

// Comments //
export const getReviewComments = (outfitId, reviewId) =>
  apiClient.get(`/outfits/${outfitId}/reviews/${reviewId}/comments`);
export const getCommentById = (outfitId, reviewId, commentId) =>
  apiClient.get(
    `/outfits/${outfitId}/reviews/${reviewId}/comments/${commentId}`  );
export const createComment = (outfitId, reviewId, commentData) =>
  apiClient.post(
    `/outfits/${outfitId}/reviews/${reviewId}/comments`,
    commentData
  );
export const updateComment = (userId, reviewId, commentId, commentData) =>
  apiClient.put(
    `/users/${userId}/reviews/${reviewId}/comments/${commentId}`,
    commentData
  );
export const deleteComment = (userId, commentId) =>
  apiClient.delete(`/users/${userId}/comments/${commentId}`);
export const getMyComments = () => apiClient.get("/comments/me");

// Admin //
export const getAllUsers = () => apiClient.get("/users");
export const getUserById = (userId) => apiClient.get(`/users/${userId}`);

export default apiClient;

