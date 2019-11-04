import React, { useState, useEffect } from 'react';
import queryString from 'query-string';

// SERVICES
import userService from '../services/userService';

import Cookies from 'js-cookie'
export default function Login() {
    const [users, setusers] = useState(null);
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

    useEffect(() => {
        if (!users) {
            getUsers();
        }
        console.log('g:', state)
        Cookies.set(stateKey, state);
    })

    const getUsers = async () => {
        let res = await userService.getAll();
        console.log(res);
        setusers(res);
    }
    const params = () => {
        return queryString.stringify({
            response_type: 'code',
            client_id: 'e303f193728348cc8ee76730b6f21e1e',
            scope: 'user-read-private user-read-email',
            redirect_uri: 'http://localhost:5000/callback',
            state: state
        });
    }
    return <a href={'https://accounts.spotify.com/authorize?' + params()}>Click me</a>
}