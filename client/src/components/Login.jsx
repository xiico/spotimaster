import React, { useEffect } from 'react';
import queryString from 'query-string';

import Cookies from 'js-cookie';

// Components
import Anchor from './Anchor';

// import runtimeEnv from '@mars/heroku-js-runtime-env';
import runtimeEnv from '../modules/runtimeEnv';
import log from '../modules/log';

export default function Login() {
    // const [users, setusers] = useState(null);
    const generateRandomString = function (length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };
    const state = generateRandomString(16);
    var stateKey = 'spotify_auth_state';
    const env = runtimeEnv();

    useEffect(() => {
        Cookies.set(stateKey, state);
        log('.env: ',env.REACT_APP_HOST_CLIENT);
    })
    const params = () => {
        return queryString.stringify({
            response_type: 'code',
            client_id: 'e303f193728348cc8ee76730b6f21e1e',
            scope: 'user-read-private user-top-read',
            // redirect_uri: `http://localhost:5000/callback`,
            // redirect_uri: `http://trackguesser.herokuapp.com/callback`,
            redirect_uri: `${env.REACT_APP_HOST_API}/callback`,
            state: state,
            show_dialog: true
        });
    }
    return <Anchor href={'https://accounts.spotify.com/authorize?' + params()} text="Login" ></Anchor>
}