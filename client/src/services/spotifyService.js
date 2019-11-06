import axios from 'axios';
export default {
    user: async token => {
        let config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        let res;
        try {
            res = await axios.get('https://api.spotify.com/v1/me', config);            
        } catch (error) {
            console.log(error)
            if(error.response.status === 401)
            delete window.localStorage.access_token;
            return null;
        }
        return res.data;
    },
    play: async (token, device, track) => {
        let config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        const data = {
            "uris": [`spotify:track:${track}`],
            "position_ms": 0
          }
        let res;
        try {
            res = await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, data, config);            
        } catch (error) {
            console.log(error)
            if(error.response.status === 401)
            delete window.localStorage.access_token;
            return null;
        }
        return res.data;
    },
    recommendations: async (token, seed, market) => {
        let config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        let res;
        try {
            res = await axios.get(`https://api.spotify.com/v1/recommendations?limit=4&market=${market}&seed_tracks=${seed}&min_popularity=50`, config);            
        } catch (error) {
            console.log(error)
            if(error.response.status === 401)
            delete window.localStorage.access_token;
            return null;
        }
        return res.data;
    },
    tracks: async token => {
        let config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        let res;
        try {
            res = await axios.get(`https://api.spotify.com/v1/me/top/tracks`, config);            
        } catch (error) {
            console.log(error)
            if(error.response.status === 401)
            delete window.localStorage.access_token;
            return null;
        }
        return res.data;
    }
}