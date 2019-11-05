import axios from 'axios';

export default {
  getAll: async () => {
    let res = await axios.get(`/api/user`);
    return res.data || [];
  },  
  get: async (id) => {
    console.log('user_service_id:',id);
    let res = await axios.get(`/api/user?id=${id}`);
    return res.data;
  }
}