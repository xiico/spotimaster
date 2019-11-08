import React, { useState, useEffect, useRef } from 'react';
import './Player.css';
import './Button.css';
import spotifyService from '../services/spotifyService';
import userService from '../services/userService';
import Card from "./Card";
import Next from "./Next";
export default function Player(props) {    
    const [player, setplayer] = useState(null);
    const [device, setdevice] = useState(null);
    const [started, setstarted] = useState(null);
    const [options, setoptions] = useState(null);
    const [curtrack, setcurtrack] = useState(null);
    const [tracklist, settracklist] = useState(null);
    const [canplay, setcanplay] = useState(true);
    const [seed, setseed] = useState(true);
    const [checked, setchecked] = useState(null);
    const [correct, setcorrect] = useState(0);
    const [canstart, setcanstart] = useState(false);
    const next = useRef();
    
    useEffect(()=>{
        const existingScript = document.getElementById('player');        
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = 'https://sdk.scdn.co/spotify-player.js'; // URL for the third-party library being loaded.
            script.id = 'player'; // e.g., googleMaps or stripe
            document.body.appendChild(script);        
            window.onSpotifyWebPlaybackSDKReady = () => {
              let plr;
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
                setdevice(device_id);
                setcanstart(true);
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
    const playTrack = async (track) => {
      // next.current.done();
      setcanplay(false);
      setchecked(null);
      let recommendations = await getRecommendations(track.id);
      while((!recommendations || !recommendations.tracks.length) && tracklist.length) {
        recommendations = await getRecommendations(tracklist[Math.floor(Math.random() * tracklist.length)].id);
      }
      // next.current.reset();
      setcanplay(false);
      shuffleArray(recommendations.tracks);
      setoptions(recommendations);
      var rand = recommendations.tracks[Math.floor(Math.random() * recommendations.tracks.length)];
      if(rand) spotifyService.play(props.token, device, rand.id, rand.duration_ms / 3);
      // console.log("rand: ", rand);
      setseed(track);
      setcurtrack(rand);
      next.current.start();
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
        shuffleArray(trks);
        settracklist(trks);
      }
    }
    const getRecommendations = async (seed) => {
      return await spotifyService.recommendations(props.token, seed, props.user.country);
    }
    const checkAnwser = (track) => {
      if(curtrack.id == track.id) setcorrect(correct+1);
      setchecked(track.id);
      if (!tracklist.length) {
        userService.update(props.user);
        setTimeout(() => {
          setcanstart(true);
          setstarted(false);          
        }, 5000);
      }
    }
    const renderChecks = (track) => {
      return (
        <div>

          {(curtrack.id == checked ? <svg className={`check_mark ${curtrack.id == track.id ? "" : "hidden"}`} xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 17.292l-4.5-4.364 1.857-1.858 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.643z"/></svg>
           :<svg className={`error_mark ${checked == track.id ? "" : "hidden"}`} xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24"><path d="M16.971 0h-9.942l-7.029 7.029v9.941l7.029 7.03h9.941l7.03-7.029v-9.942l-7.029-7.029zm-1.402 16.945l-3.554-3.521-3.518 3.568-1.418-1.418 3.507-3.566-3.586-3.472 1.418-1.417 3.581 3.458 3.539-3.583 1.431 1.431-3.535 3.568 3.566 3.522-1.431 1.43z"/></svg>
          )}
          <div className={`card_screen`}></div>
        </div>
      );
    }
    const renderCards = () => {
      return (
        options && curtrack
        ?
          (<div className="cards_list">
            {options.tracks.map(option => {
              // console.log(option);
              return (
                <div className="card_container">
                  <Card
                    id={option.id} 
                    key={option.id}
                    artist={ option.artists ? option.artists.map(e => ` ${e.name}`).toString().trimStart() : option.artist }
                    image={ option.album ? option.album.images.find(a => a.width == 300).url : option.image} 
                    track={option.name || option.track}
                    onClick={()=>checkAnwser(option)}
                  ></Card>
                  {checked ? renderChecks(option):<div></div>}
                </div>
            )})}
          </div>)
        :
        <div>Loading</div>
      );
    }
    const start = async () => {
      let trks = await spotifyService.tracks(props.token);
      createTrackList(trks);
      // if(!canplay) playTrack(tracklist.shift());
      setcorrect(0);
      setstarted(true);
    }
    return (
        <div className="player_container">
            <div className={"counter" + (!started ? " hidden" : "")}>
              <span>{`There are ${((tracklist || {}).length || 0)} left`}</span>
              <span> - </span>
              <span>Your score is {correct}</span>
            </div>
            {/* {track ? <div>{track}</div> : <button onClick={() => spotifyService.play(props.token,device,'29rTQRoLUMfWgVlXHQZ7bJ')} >Start</button>}*/}
            {started ? renderCards() : (
              <button className={`start start_button${(canstart?"":" hidden")}`} onClick={() => start() }>Start</button>
            )}
            {(seed ? (
              <div style={{width: '100%'}} >
                {/* <Card
                  artist={seed.artists ? seed.artists.map(e => ` ${e.name}`).toString().trimStart() : seed.artist}
                  image={seed.album ? seed.album.images.find(a => a.width == 300).url : seed.image} 
                  track={seed.name || seed.track}
                  onClick={() => {if(tracklist.length) playTrack(tracklist.shift())} }
                ></Card> */}
                <Next started={started} ref={next} onClick={() => {if(tracklist.length) playTrack(tracklist.shift())} } ></Next>
              </div>
            ) : <div></div>)}
        </div>        
    )
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
  }
}