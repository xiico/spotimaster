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
  getinfo: async (id) => {
    console.log('challenge_info:', id);
    let res = await axios.get(`/api/challengeinfo/${id}`);
    return res.data;
  },  
  getoptions: async (user, index) => {
    console.log('getoptions user, index:', user, index);
    let res = await axios.get(`/api/challengeoptions/${user}/${index}`);
    return res.data;
  },  
}