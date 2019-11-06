import React, { useState, useEffect } from 'react';
import './Player.css';
import spotifyService from '../services/spotifyService';
export default function Player(props) {
    const [user, setuser] = useState(null);
    const [player, setplayer] = useState(null);
    const [track, settrack] = useState(null);
    const [device, setdevice] = useState(null);

    
    
    useEffect(()=>{
        const existingScript = document.getElementById('player');        
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = 'https://sdk.scdn.co/spotify-player.js'; // URL for the third-party library being loaded.
            script.id = 'player'; // e.g., googleMaps or stripe
            document.body.appendChild(script);        
            script.onload = () => {
              let player;
              console.log('loaded:', window.onSpotifyWebPlaybackSDKReady);
              const token = props.token;// 'BQCRSz50hqnYbsxYTjlIEAcVmGN5gXoEMWdqrjmClL_YSQDjgvsT44qyi6MuKnky7DU94nFxBCTLQBGh7rzaWyfocV5OqzZ04mnoWqU77EDfsTT7N36Z0cgpwGFrAE3dABKnTUrTTq4tK2W4_hgSu5m8Wv3z7GpynKI';
              player = new window.Spotify.Player({
                name: 'Web Playback SDK Quick Start Player',
                getOAuthToken: cb => { cb(token); }
              });
        
              // Error handling
              player.addListener('initialization_error', ({ message }) => { console.error(message); });
              player.addListener('authentication_error', ({ message }) => { console.error(message); });
              player.addListener('account_error', ({ message }) => { console.error(message); });
              player.addListener('playback_error', ({ message }) => { console.error(message); });
        
              // Playback status updates
              player.addListener('player_state_changed', state => { 
                  console.log(state); 
                  var curtrack = state.track_window.current_track.artists[0].name + ' - ' + state.track_window.current_track.name;
                  settrack(curtrack);
                });
        
              // Ready
              player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setdevice(device_id)
              });
        
              // Not Ready
              player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
              });
        
              // Connect to the player!
              player.connect();
            };
          }
    });
    return (
        <div>
            {track ? <div>{track}</div> : <button onClick={() => spotifyService.play(props.token,device,'29rTQRoLUMfWgVlXHQZ7bJ')} >Play</button>}            
        </div>
    
    )
}