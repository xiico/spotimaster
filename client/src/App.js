import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import runtimeEnv from './modules/runtimeEnv';
import userService from './services/userService';
import spotifyService from './services/spotifyService';
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from 'react-router-dom';
// import Game from './components/Game';
import Header from "./components/Header";
import Home from "./components/Home";
import Leaderboard from './components/Leaderboard';
import Challenge from './components/Challenge';

function App(props) {
  const [user, setuser] = useState(null);
  const [preview, setpreview] = useState(false);
  const env = runtimeEnv();
  useEffect(()=>{
    if(!user){
      if(window.localStorage.access_token){
        spotifyService.refreshToken();
        getSpotifyUser().then(spotiUser => setuser(spotiUser));
        setInterval(() => spotifyService.refreshToken(), 3300000);
      }
      else
      {
        const result = queryString.parse(props.location.hash || props.location.search);
        let access_token = result.token || result['?token'];
        if (access_token) {
          console.log("App.env:", env.REACT_APP_HOST_CLIENT);
          window.localStorage.access_token = access_token;
          window.localStorage.refresh_token = result.refresh_token;
          window.location = env.REACT_APP_HOST_CLIENT;
        }
      }
      setpreview(new Audio('click.mp3'));
    } else userService.update(user);
  }, [props.location.hash, props.location.search, user, env.REACT_APP_HOST_CLIENT]);
  const getSpotifyUser = async () => {
    let user = await spotifyService.user();
    return user;
  }
  return (
    <Router>
      <div className="App">
        <Header user={user} link={Link} navlink={NavLink} ></Header>
        <Switch>
          <Route exact path="/">
            <Home user={user} preview={preview} setpreview={setpreview} />
          </Route>
          <Route exact path="/leaderboard" render={(history) => <Leaderboard link={Link} history={history} user={user} preview={preview} ></Leaderboard>} />
          <Route exact path="/challenges/:id?" render={(history) => <React.StrictMode><Challenge link={Link} history={history} user={user} preview={preview} setpreview={setpreview}  ></Challenge></React.StrictMode>} />
        </Switch>        
      </div>
    </Router>
  );
}

export default App;