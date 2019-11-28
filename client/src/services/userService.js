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
  },  
  update: async (user) => {
    // console.log('user_service_id:',id);
    const data = {
      name: user.display_name,
      id: user.id,
      // score: user.score,
      picture: (user.images[0] || {}).url,
      href: user.external_urls.spotify
    }
    let res = await axios.put(`/api/user/${user.id}`, data);
    return res.data;
  }
}