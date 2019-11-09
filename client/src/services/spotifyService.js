import axios from 'axios';
export default {
    user: async () => {
        let res;
        try {
            res = await axios.get('https://api.spotify.com/v1/me', getConfig());
        } catch (error) {
            console.log(error)
            if(error.response.status === 401)
            refreshToken();
            return await axios.get('https://api.spotify.com/v1/me', getConfig()).data;
        }
        return res.data;
    },
    play: async (device, track, position) => {
        const data = {
            "uris": [`spotify:track:${track}`],
            "position_ms": position || 0
          }
        let res;
        try {
            res = await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, data, getConfig());
        } catch (error) {
            console.log(error)
            if(error.response.status === 401)
            delete window.localStorage.access_token;
            return await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, data, getConfig()).data;
        }
        return res.data;
    },
    recommendations: async (seed, market) => {
        let res;
        try {
            res = await axios.get(`https://api.spotify.com/v1/recommendations?limit=5&market=${market}&seed_tracks=${seed}&min_popularity=50`, getConfig());
        } catch (error) {
            console.log(error)
            if(error.response.status === 401)
            delete window.localStorage.access_token;
            return await axios.get(`https://api.spotify.com/v1/recommendations?limit=5&market=${market}&seed_tracks=${seed}&min_popularity=50`, getConfig()).data;
        }
        return res.data;
    },
    tracks: async (size) => {
        let res;
        try {
            res = await axios.get(`https://api.spotify.com/v1/me/top/tracks?limit=${size}`, getConfig());
        } catch (error) {
            console.log(error)
            if(error.response.status === 401)
            delete window.localStorage.access_token;
            return await axios.get(`https://api.spotify.com/v1/me/top/tracks?limit=20`, getConfig()).data;
        }
        return res.data;
    }
}

function getConfig() {
    return {
        headers: {
            Authorization: `Bearer ${localStorage.access_token}`,
        }
    };
}

async function refreshToken() {
    let res;
    try {
        res = await axios.get(`/api/refresh_token?refresh_token=${localStorage.refresh_token}`);
        window.localStorage.access_token = res.data.access_token;
    }
    catch (error) {
        console.log(error);
        delete window.localStorage.access_token;
    }
    return res.access_token;
}
