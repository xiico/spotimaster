import axios from 'axios';

export default {
  get: async (id) => {
    console.log('user_service_id:',id);
    let res = await axios.get(`/api/leaderboard/${id || ''}`);
    return res.data;
  },  
  insert: async (score, id) => {
    // console.log('user_service_id:',id);
    let res = await axios.post(`/api/leaderboard/${id}`, score);
    return res.data;
  }
}