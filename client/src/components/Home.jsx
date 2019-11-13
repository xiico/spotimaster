import React from 'react';
import Player from "./Player";
export default function Home(props){
    const renderPlayer = () => {
      return (
        <Player user={props.user} ></Player>
      );
    };
    return (
        <div className="player">
          {props.user ? (
            renderPlayer()
          ) : (
            <p>Loading player</p>
          )}
        </div>
    );
}