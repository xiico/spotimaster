import axios from 'axios';

export default {
  get: async (id) => {
    console.log('user_service_id:',id);
    let res = await axios.get(`/api/leaderboard/${id || ''}`);
    return res.data;
  },  
  insert: async (score, id, challenge) => {
    // console.log('user_service_id:',id);
    let res = await axios.post(`/api/leaderboard/${id}${challenge ? `?challenge=${challenge}` : ''}`, score);
    return res.data;
  }
}