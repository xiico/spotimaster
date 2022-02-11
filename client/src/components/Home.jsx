import React from 'react';
import Player from "./Player";
export default function Home(props){
    const renderPlayer = () => {
      return (
        <Player user={props.user} preview={props.preview} setpreview={props.setpreview} ></Player>
      );
    };
    const message = {
      color: 'white',
      padding: '20px',
      margin: 'auto',
      maxWidth: '500px'
    }
    return (
        <div className="player">
          {props.user ? (
            renderPlayer()
          ) : (
            <section style={message} >
              <h1>Track Guesser</h1>
              <p>This is a guess the song game based upon your tracks from Spotify.</p>
              <p>The app will pick 20 of your top songs and for each one of them, it will generate a list of five tracks.</p>
              <p>Then, it will play at random one of these five tracks.</p>
              <p>The objective of the game is to correctly guess which one of the tracks is playing.</p>
              <p>Good Luck!</p>
            </section>
          )}        
          <div style={{position:'fixed', width: '100%', height: '20px', padding: '5px', bottom: '20px', textAlign: 'center', color: 'white'}}>
            <a href='mailto:francisco.marao@hotmail.com'>Francisco Marao</a><br/>© 2022
          </div>
        </div>
    );
}