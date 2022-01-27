import axios from 'axios';

export default {
  latest: async (id) => {
    console.log('challenge_service_id:', id);
    let res = await axios.get(`/api/challenges`);
    return res.data;
  },  
  get: async (id) => {
    console.log('challenge_service_id:',id);
    let res = await axios.get(`/api/challenges/${id || ''}`);
    return res.data;
  },  
}