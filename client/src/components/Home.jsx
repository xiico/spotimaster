import React from 'react';
import Player from "./Player";
export default function Home(props){
    const renderPlayer = () => {
      return (
        <Player user={props.user} preview={props.preview} setpreview={props.setpreview} ></Player>
      );
    };
    return (
        <div className="player">
          {props.user ? (
            renderPlayer()
          ) : (
            ""
          )}
        </div>
    );
}