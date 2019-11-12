import React, { useState, useEffect, useRef } from 'react';
import './Player.css';
import './Button.css';
import spotifyService from '../services/spotifyService';
import userService from '../services/userService';
import runtimeEnv from '../modules/runtimeEnv';
import Card from "./Card";
import Next from "./Next";
import Score from "./Score"
import isMobileDevice from "../modules/isMobileDevice";

export default function Player(props) {
  const env = runtimeEnv();
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
  const [showscore, setshowscore] = useState(false);
  const [starttime, setstarttime] = useState(0);
  const [combo, setcombo] = useState(0);
  const [maxcombo, setmaxcombo] = useState(0);
  const [score, setscore] = useState(0);
  const [plsize] = useState(env.REACT_APP_PLSIZE || 20);
  const [usepreview, setusepreview] = useState(isMobileDevice());
  const [preview, setpreview] = useState(false);
  const next = useRef();

  useEffect(() => {
    const existingScript = document.getElementById('player');
    if (!existingScript && !usepreview) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js'; // URL for the third-party library being loaded.
      script.id = 'player'; // e.g., googleMaps or stripe
      document.body.appendChild(script);
      window.onSpotifyWebPlaybackSDKReady = () => {
        try {
          let plr;
          const token = localStorage.access_token;// 'BQCRSz50hqnYbsxYTjlIEAcVmGN5gXoEMWdqrjmClL_YSQDjgvsT44qyi6MuKnky7DU94nFxBCTLQBGh7rzaWyfocV5OqzZ04mnoWqU77EDfsTT7N36Z0cgpwGFrAE3dABKnTUrTTq4tK2W4_hgSu5m8Wv3z7GpynKI';
          plr = new window.Spotify.Player({
            name: 'Spotimaster Player',
            getOAuthToken: cb => { cb(token); }
          });

          // Error handling
          plr.addListener('initialization_error', ({ message }) => { setusepreview(true); console.error(message); });
          plr.addListener('authentication_error', ({ message }) => { setusepreview(true); console.error(message); });
          plr.addListener('account_error', ({ message }) => { setusepreview(true); console.error(message); });
          plr.addListener('playback_error', ({ message }) => { setusepreview(true); console.error(message); });

          // Playback status updates
          plr.addListener('player_state_changed', state => {
            console.log(state);
            if (state) setcurtrack(state.track_window.current_track);
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

          // if (plr) throw new Error('Never mind.');
          // Connect to the player!
          plr.connect();
          setusepreview(isMobileDevice());
        } catch (error) {
          console.log(error);
          setcanstart(true);
        }
      };
    }
    if (tracklist && canplay) playTrack(tracklist.shift());
  });
  const playTrack = async (track) => {
    next.current.reset();
    if(preview) preview.pause();
    setcanplay(false);
    setchecked(null);
    let recommended;
    let recommendations = await getRecommendations(track.id);
    console.log('track: ', track);
    let count = 0;
    while ((!recommendations || recommendations.tracks.length < 5) && tracklist.length) {
      recommended = tracklist[Math.floor(Math.random() * tracklist.length)];
      recommendations = await getRecommendations(recommended.id);
      count++;
      if(count > 10){
        recommendations = await getRecommendations(recommended.id, 'pop');
      }
    }
    if (recommendations.tracks.length < 5) {
      console.log('no recommendations!', recommended);
      recommendations = await getRecommendations(recommended.id, 'pop');
    }
    console.log('recommendations: ', recommendations);
    // next.current.reset();
    setcanplay(false);
    setstarttime(new Date().getTime());
    shuffleArray(recommendations.tracks);
    setoptions(recommendations);
    var rand = recommendations.tracks[Math.floor(Math.random() * recommendations.tracks.length)];
    if (rand) {
      let p = await spotifyService.play(device, rand, rand.duration_ms / 3, usepreview);
      setpreview(p);
    }
    // console.log("rand: ", rand);
    setseed(track);
    setcurtrack(rand);
    setTimeout(() => next.current.start(), 300);
  }
  const createTrackList = (trl) => {
    if (trl) {
      console.log("items:",trl.items);
      let trks = trl.items.map(t => {
        return {
          id: t.id,
          artist: t.artists.map(e => ` ${e.name}`).toString().trimStart(),
          image: (t.album.images.find(a => a.width === 300) || { url: '' }).url,
          track: t.name
        }
      });
      shuffleArray(trks);
      trks = trks.slice(0, plsize);
      console.log("trks: ", trks);
      settracklist(trks);
    }
  }
  const getRecommendations = async (seed, genre) => {
    let recommendations = await spotifyService.recommendations(seed, props.user.country, genre, 35 + tracklist.length);    
    if (usepreview)  recommendations.tracks = recommendations.tracks.filter(e => e.preview_url) || [];
    console.log("filtered: ", recommendations.tracks.length);
    shuffleArray(recommendations.tracks);
    recommendations.tracks = recommendations.tracks.slice(0,5);
    return recommendations;
  }
  const checkAnwser = (track) => {
    next.current.reset();
    let ccombo = combo; // current combo;
    let ccorrect = correct;
    if (curtrack.id === track.id) {
      ccombo++;
      ccorrect = correct + 1;
      setcorrect(ccorrect);
    } else ccombo = 0;
    setcombo(ccombo);
    let cscore = calculateScore(ccombo);
    setchecked(track.id);
    let scr = {
      mode: 'Normal',
      hits: ccorrect,
      total: plsize,
      points: cscore,
      maxcombo: Math.max(maxcombo, ccombo),
      date: new Date()
    }
    props.user.score = scr;
    userService.update(props.user);
    if (!tracklist.length) {
      settracklist(null);
      setTimeout(() => {
        setshowscore(true);
        setstarted(false);
        setcanplay(true);
      }, 3000);
    }
  }
  const renderChecks = (track) => {
    return (
      <div>
        {(<div>
          <svg className={`check_mark ${checked && checked === track.id && curtrack.id === track.id ? "show" : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 17.292l-4.5-4.364 1.857-1.858 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.643z" /></svg>
          <svg className={`error_mark ${checked && checked === track.id && curtrack.id !== track.id ? "show" : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.971 0h-9.942l-7.029 7.029v9.941l7.029 7.03h9.941l7.03-7.029v-9.942l-7.029-7.029zm-1.402 16.945l-3.554-3.521-3.518 3.568-1.418-1.418 3.507-3.566-3.586-3.472 1.418-1.417 3.581 3.458 3.539-3.583 1.431 1.431-3.535 3.568 3.566 3.522-1.431 1.43z" /></svg>
        </div>)}
        <div className={`card_screen ${checked ? "" : "hidden"}`}></div>
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
              <div key={option.id} className="card_container">
                <Card
                  id={option.id}

                  artist={option.artists ? option.artists.map(e => ` ${e.name}`).toString().trimStart() : option.artist}
                  image={option.album ? (option.album.images.find(a => a.width === 300) || { url: '' }).url : option.image}
                  track={option.name || option.track}
                  onClick={() => checkAnwser(option)}
                ></Card>
                {renderChecks(option)}
              </div>
            )
          })}
        </div>)
        :
        <div>Loading</div>
    );
  }
  const start = async () => {
    let trks = await spotifyService.tracks(plsize);
    createTrackList(trks);
    // if(!canplay) playTrack(tracklist.shift());
    setcorrect(0);
    if (started) playTrack(tracklist.shift());
    setstarted(true);
    setshowscore(false);
    setscore(0);
    setcombo(0);
    setmaxcombo(0);
  }
  return (
    <div className="player_container">
      <div className={"counter" + (!started ? " hidden" : "")}>
        <span>{`There are ${((tracklist || {}).length || 0)} left`}</span>
        <span> - </span>
        <span>Your score is {score}</span>{(combo ? ` ${combo}x`: '')}
      </div>
      {started ? renderCards() : (
        <button className={`start start_button${((canstart || usepreview) && !showscore ? "" : " hidden")}`} onClick={() => start()}>Start</button>
      )}
      {(seed ? (
        <div className="score_info" >
          {/* <Card
                  artist={seed.artists ? seed.artists.map(e => ` ${e.name}`).toString().trimStart() : seed.artist}
                  image={seed.album ? seed.album.images.find(a => a.width == 300).url : seed.image} 
                  track={seed.name || seed.track}
                  onClick={() => {if(tracklist.length) playTrack(tracklist.shift())} }
                ></Card> */
            <Score showscore={showscore} score={score} hits={correct} total={plsize} onClick={() => start()} maxcombo={maxcombo} ></Score>
          }
          <Next hide={!(tracklist || {}).length} started={started} ref={next} onClick={() => { if (tracklist.length) playTrack(tracklist.shift()) }} ></Next>
        </div>
      ) : <div></div>)}
    </div>
  )
  function calculateScore(ccombo) {
    if(ccombo > maxcombo) setmaxcombo(ccombo);
    let pscore = (30000 - Math.min(30000, new Date().getTime() - starttime)) * ccombo;
    setscore(score + pscore);
    return score + pscore;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}