import React, { useState, useEffect } from 'react';
import queryString from 'query-string';

import userService from './services/userService';
import spotifyService from './services/spotifyService';
// import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
// import Game from './components/Game';
import Header from "./components/Header";
import Player from "./components/Player";
function App(props) {
  const [user, setuser] = useState(null);
  const [player, setplayer] = useState(null);
  const [access_token, settoken] = useState(null);
  useEffect(()=>{
    if(!user){
      if(window.localStorage.access_token){        
        getSpotifyUser(window.localStorage.access_token).then(spotiUser => setuser(spotiUser));        
        settoken(window.localStorage.access_token);        
      }
      else
      {
        const result = queryString.parse(props.location.hash || props.location.search);
        let access_token = result.token || result['?token'];
        if (access_token) {
          window.localStorage.access_token = access_token;
          getSpotifyUser(window.localStorage.access_token).then(spotiUser => setuser(spotiUser));          
          settoken(access_token);        
        }
      }
    }
  });
  const getSpotifyUser = async (token) => {
    let user = await spotifyService.user(token);
    return user;
  }
  const renderPlayer = player => {
    return (
      <Player token={access_token}></Player>
    );
  };
  return (
    <div className="App">
      <Header user={user} ></Header>
      <div className="player">
        {user ? (
          renderPlayer()
        ) : (
          <p>Loading player</p>
        )}
      </div>
    </div>
  );
}

export default App;