import React, { useState/*, useEffect*/ } from 'react';
import queryString from 'query-string';

import userService from './services/userService';
// import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
// import Game from './components/Game';
import Header from "./components/Header";
import Login from "./components/Login";

function App(props) {
  const [user, setuser] = useState(null);
  // useEffect(() => {
  //   const result = queryString.parse(window.location.hash);
  //   if (result.id) {
  //     getUser(result.id);
  //   }
  // })
  const result = queryString.parse(props.location.hash || props.location.search);
  const getUser = async (id) => {
    console.log("getUser: ", id);
    let res = await userService.get(id);
    setuser(res);
  }
  getUser(result.user || result['?user'])
  console.log("user: ", user);

  if (user) {
    return (
      <div className="App">
        <Header user={user} ></Header>
      </div>
    );
  } else {
    return (
      <div className="App">
        <Login></Login>
      </div>)
  }
}

export default App;