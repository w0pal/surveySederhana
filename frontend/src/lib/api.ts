import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
 baseURL: API_URL,
 headers: {
  'Content-Type': 'application/json',
 },
});

// Survey API
export const surveyApi = {
 // Start new survey
 startSurvey: async () => {
  const response = await api.post('/survey/start');
  return response.data;
 },

 // Save answers
 saveAnswers: async (
  responseId: string,
  answers: Array<{
   question_id: string;
   answer_value?: string;
   answer_text?: string;
  }>,
 ) => {
  const response = await api.post(`/survey/${responseId}/answers`, { answers });
  return response.data;
 },

 // Complete survey
 completeSurvey: async (responseId: string, whatsappNumber?: string) => {
  const response = await api.post(`/survey/${responseId}/complete`, {
   whatsapp_number: whatsappNumber,
  });
  return response.data;
 },

 // Get response (for resuming)
 getResponse: async (responseId: string) => {
  const response = await api.get(`/survey/${responseId}`);
  return response.data;
 },
};

// Provinces API
export const provincesApi = {
 getAll: async () => {
  const response = await api.get('/provinces');
  return response.data;
 },

 getRegencies: async (provinceId: number) => {
  const response = await api.get(`/provinces/${provinceId}/regencies`);
  return response.data;
 },
};

// Admin API
export const adminApi = {
 getResponses: async (
  page = 1,
  limit = 20,
  adminKey: string,
  filters?: any,
 ) => {
  const params = new URLSearchParams({
   page: String(page),
   limit: String(limit),
   ...filters,
  });
  const response = await api.get(`/admin/responses?${params}`, {
   headers: { 'x-admin-key': adminKey },
  });
  return response.data;
 },

 getResponse: async (responseId: string, adminKey: string) => {
  const response = await api.get(`/admin/responses/${responseId}`, {
   headers: { 'x-admin-key': adminKey },
  });
  return response.data;
 },

 deleteResponse: async (responseId: string, adminKey: string) => {
  const response = await api.delete(`/admin/responses/${responseId}`, {
   headers: { 'x-admin-key': adminKey },
  });
  return response.data;
 },

 getStatistics: async (adminKey: string) => {
  const response = await api.get('/admin/statistics', {
   headers: { 'x-admin-key': adminKey },
  });
  return response.data;
 },

 exportData: async (adminKey: string) => {
  const response = await api.get('/admin/export', {
   headers: { 'x-admin-key': adminKey },
  });
  return response.data;
 },

 exportCsv: async (adminKey: string) => {
  const response = await api.get('/admin/export/csv', {
   headers: { 'x-admin-key': adminKey },
   responseType: 'blob',
  });
  return response.data;
 },
};

export default api;
