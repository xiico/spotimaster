import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
// import Game from './components/Game';

// SERVICES
import userService from './services/userService';

import queryString from 'query-string'
import Cookies from 'js-cookie'

function App() {
  const [users, setusers] = useState(null);
  

  const generateRandomString = function(length) {
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
    if(!users) {
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

  const renderUser = user => {
    return (
      <li key={user._id} className="list__item user">
        <h3 className="user__name">{user.name}</h3>
        <p className="user__points">{user.points}</p>
      </li>
    );
  };

  return (
    <div className="App">
      <a href={'https://accounts.spotify.com/authorize?' + params()}>Click me</a>
      <ul className="list">
        {(users && users.length > 0) ? (
          users.map(user => renderUser(user))
        ) : (
          <p>No users found</p>
        )}
      </ul>
    </div>
  );
}

export default App;