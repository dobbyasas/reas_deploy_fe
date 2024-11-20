// komunikace s api pomocí knihovny axios
import axios from 'axios';

// url pro api endpoint v dockeru
const API_URL = process.env.REACT_APP_API_URL || "http://backend:5001";

// odešle data z formuláře na server
export const submitLead = async (leadData: { 
  estateType: string; 
  fullName: string; 
  phone: string; 
  email: string; 
  region: string; 
  district: string; 
}) => {
  try {
    // odeslání post na api endpoint
    const response = await axios.post(`${API_URL}/lead`, leadData);
    return response.data; // vrací data z api (např. potvrzení o úspěchu)
  } catch (error) {
    throw new Error('Chyba při odesílání leadu');
  }
};
