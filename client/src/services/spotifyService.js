import axios from 'axios';
export default {
    user: async () => {
        let config = {
            headers: {
                Authorization: `Bearer ${localStorage.access_token}`,
            }
        }
        let res;
        try {
            res = await axios.get('https://api.spotify.com/v1/me', config);
        } catch (error) {
            console.log(error)
            if(error.response.status === 401)
            refreshToken();
            return null;
        }
        return res.data;
    },
    play: async (device, track, position) => {
        let config = {
            headers: {
                Authorization: `Bearer ${localStorage.access_token}`,
            }
        }
        const data = {
            "uris": [`spotify:track:${track}`],
            "position_ms": position || 0
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
    recommendations: async (seed, market) => {
        let config = {
            headers: {
                Authorization: `Bearer ${localStorage.access_token}`,
            }
        }
        let res;
        try {
            res = await axios.get(`https://api.spotify.com/v1/recommendations?limit=5&market=${market}&seed_tracks=${seed}&min_popularity=50`, config);
        } catch (error) {
            console.log(error)
            if(error.response.status === 401)
            delete window.localStorage.access_token;
            return null;
        }
        return res.data;
    },
    tracks: async () => {
        let config = {
            headers: {
                Authorization: `Bearer ${localStorage.access_token}`,
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

async function refreshToken() {
    let new_token;
    try {
        new_token = await axios.get(`/refresh_token?refresh_token=${localStorage.refresh_token}`);
        window.localStorage.access_token = new_token;
    }
    catch (error) {
        console.log(error);
        delete window.localStorage.access_token;
    }
    return new_token;
}
