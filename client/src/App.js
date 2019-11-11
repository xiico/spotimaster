import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import runtimeEnv from './modules/runtimeEnv';

import spotifyService from './services/spotifyService';
// import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
// import Game from './components/Game';
import Header from "./components/Header";
import Player from "./components/Player";
function App(props) {
  const [user, setuser] = useState(null);
  const [access_token, settoken] = useState(null);
  const env = runtimeEnv();
  useEffect(()=>{
    if(!user){
      if(window.localStorage.access_token){        
        getSpotifyUser().then(spotiUser => setuser(spotiUser));        
        settoken(window.localStorage.access_token);        
      }
      else
      {
        const result = queryString.parse(props.location.hash || props.location.search);
        let access_token = result.token || result['?token'];
        if (access_token) {
          console.log("App.env:", env.REACT_APP_HOST_CLIENT);
          window.localStorage.access_token = access_token;
          window.localStorage.refresh_token = result.refresh_token;
          window.location = env.REACT_APP_HOST_CLIENT
        }
      }
    }
  }, [props.location.hash, props.location.search, user]);
  const getSpotifyUser = async () => {
    let user = await spotifyService.user();
    return user;
  }
  const renderPlayer = player => {
    return (
      <Player user={user} ></Player>
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