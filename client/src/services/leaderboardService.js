import axios from 'axios';

export default {
  get: async (id) => {
    console.log('user_service_id:',id);
    let res = await axios.get(`/api/leaderboard/${id || ''}`);
    return res.data;
  },  
  insert: async (score, id, challenge, leaderboard) => {
    // console.log('user_service_id:',id);
    let res = await axios.post(`/api/leaderboard/${id}${challenge ? `?challenge=${challenge}&leaderboard=${leaderboard ? leaderboard._id : ''}` : ''}`, score);
    return res.data;
  },
  delete: async (id) => {
    // console.log('user_service_id:',id);
    let res = await axios.delete(`/api/leaderboard/${id}`);
    return res.data;
  }
}