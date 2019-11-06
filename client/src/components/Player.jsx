import React, { useState, useEffect } from 'react';
import './Player.css';
import './Button.css';
import spotifyService from '../services/spotifyService';
import Card from "./Card";
import { set } from 'mongoose';
export default function Player(props) {    
    const [player, setplayer] = useState(null);
    const [device, setdevice] = useState(null);
    const [started, setstarted] = useState(null);
    const [options, setoptions] = useState(null);
    const [curtrack, setcurtrack] = useState(null);
    const [tracklist, settracklist] = useState(null);
    const [canplay, setcanplay] = useState(true);
    
    useEffect(()=>{
        const existingScript = document.getElementById('player');        
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = 'https://sdk.scdn.co/spotify-player.js'; // URL for the third-party library being loaded.
            script.id = 'player'; // e.g., googleMaps or stripe
            document.body.appendChild(script);        
            script.onload = () => {
              let plr;
              console.log('loaded:', window.onSpotifyWebPlaybackSDKReady);
              const token = props.token;// 'BQCRSz50hqnYbsxYTjlIEAcVmGN5gXoEMWdqrjmClL_YSQDjgvsT44qyi6MuKnky7DU94nFxBCTLQBGh7rzaWyfocV5OqzZ04mnoWqU77EDfsTT7N36Z0cgpwGFrAE3dABKnTUrTTq4tK2W4_hgSu5m8Wv3z7GpynKI';
              plr = new window.Spotify.Player({
                name: 'Spotimaster Player',
                getOAuthToken: cb => { cb(token); }
              });
        
              // Error handling
              plr.addListener('initialization_error', ({ message }) => { console.error(message); });
              plr.addListener('authentication_error', ({ message }) => { console.error(message); });
              plr.addListener('account_error', ({ message }) => { console.error(message); });
              plr.addListener('playback_error', ({ message }) => { console.error(message); });
        
              // Playback status updates
              plr.addListener('player_state_changed', state => { 
                  console.log(state); 
                  setcurtrack(state.track_window.current_track);
                });
        
              // Ready
              plr.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setdevice(device_id)
              });
        
              // Not Ready
              plr.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
              });
        
              // Connect to the player!
              plr.connect();
              setplayer(plr);
            };
          }
          if(tracklist && canplay) playTrack(tracklist.shift());
    });
    const playTrack = (track) => {
      setcanplay(false);
      spotifyService.play(props.token, device, track.id);
    }
    const createTrackList = (trl) => {
      if(trl){
        let trks = trl.items.map(t => {
          return {
            id: t.id,
            artist: t.artists.map(e => ` ${e.name}`).toString().trimStart(),
            image: t.album.images.find(a => a.width == 300).url,
            track: t.name
          }
        });
        settracklist(trks);
      }
    }
    const getRecommendations = async () => {
      return await spotifyService.recommendations(props.token,props.seed,props.user.country);
    }
    const checkAnwser = (track) => {

    }
    const renderCards = () => {
      return (
        options 
        ?
          (<div className="cards_list">
            {options.tracks.map(option => (
              <Card
                id={option.id} 
                key={option.id}
                artist={option.artists.map(e => ` ${e.name}`).toString().trimStart()}
                image={option.album.images.find(a => a.width == 300).url} 
                track={option.name}
                onClick={() => spotifyService.play(props.token, device, option.id)}
              ></Card>
            ))}
          </div>)
        :
        <div>Loading</div>
      );
    }
    const start = async () => {
      let trks = await spotifyService.tracks(props.token);
      createTrackList(trks);
      let recommendations = await getRecommendations();
      setoptions(recommendations);
      setstarted(true);
    }
    return (
        <div className="player_container">
            {/* {track ? <div>{track}</div> : <button onClick={() => spotifyService.play(props.token,device,'29rTQRoLUMfWgVlXHQZ7bJ')} >Start</button>}*/}
            {started ? renderCards() : (
              <button className="start start_button" onClick={() => start() } >Start</button>
            )}
            {(curtrack ? (
              <div style={{width: '100%'}} >
                <Card
                  artist={curtrack.artists.map(e => ` ${e.name}`).toString().trimStart()}
                  image={curtrack.album.images.find(a => a.width == 300).url} track={curtrack.name}
                ></Card>
              </div>
            ) : <div></div>)}
        </div>        
    )
}