import axios from 'axios';

const API_URL = 'http://localhost:5001/lead'; // Your backend API URL

export const submitLead = async (leadData: any) => {
  try {
    const response = await axios.post(API_URL, leadData);
    return response.data;
  } catch (error) {
    throw new Error('Error submitting lead');
  }
};
