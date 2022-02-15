import React, { useState, useEffect, useRef } from 'react';
import './Player.css';
import './Button.css';
import spotifyService from '../services/spotifyService';
import leaderboardService from '../services/leaderboardService';
import runtimeEnv from '../modules/runtimeEnv';
import Card from "./Card";
import Next from "./Next";
import Score from "./Score"
import Like from "./Like";
import isMobileDevice from "../modules/isMobileDevice";
import Loading from './Loading';
import format from '../modules/format';
import Select from './Select';
import log from '../modules/log';

export default function Player(props) {
  const env = runtimeEnv();
  const [device, setdevice] = useState(null);
  const [started, setstarted] = useState(null);
  const [options, setoptions] = useState(null);
  const [optionshistory, setoptionshistory] = useState([]);
  const [curtrack, setcurtrack] = useState(null);
  const [tracklist, settracklist] = useState(null);
  const [canplay, setcanplay] = useState(true);
  const [seed, setseed] = useState(true);
  const [checked, setchecked] = useState(null);
  const [correct, setcorrect] = useState(0);
  const [canstart, setcanstart] = useState(null);
  const [showscore, setshowscore] = useState(false);
  const [starttime, setstarttime] = useState(0);
  const [combo, setcombo] = useState(0);
  const [maxcombo, setmaxcombo] = useState(0);
  const [score, setscore] = useState(0);
  const [pscore, setpscore] = useState(0);
  const [plsize] = useState(env.REACT_APP_PLSIZE || 20);
  const [usepreview, setusepreview] = useState(true);
  const [genres, setgenres] = useState();
  const [genre, setgenre] = useState();
  const [answears, setanswears] = useState([]);
  const [leaderboard, setleaderboard] = useState();
  const [running, setrunning] = useState(false);
  const [liked, setliked] = useState(false);
  const [showlike, setshowlike] = useState(false);
  // const [challenge, setchallenge] = useState();
  // const [preview, setpreview] = useState(false);
  const next = useRef();
  const like = useRef();
  const select = useRef();
  const preview = props.preview;
  const setpreview = props.setpreview;
  useEffect(() => {
    const existingScript = document.getElementById('player');
    let plr;
    if (!existingScript && !usepreview) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js'; // URL for the third-party library being loaded.
      script.id = 'player'; // e.g., googleMaps or stripe
      document.body.appendChild(script);
      window.onSpotifyWebPlaybackSDKReady = () => {
        try {
          const token = localStorage.access_token;// 'BQCRSz50hqnYbsxYTjlIEAcVmGN5gXoEMWdqrjmClL_YSQDjgvsT44qyi6MuKnky7DU94nFxBCTLQBGh7rzaWyfocV5OqzZ04mnoWqU77EDfsTT7N36Z0cgpwGFrAE3dABKnTUrTTq4tK2W4_hgSu5m8Wv3z7GpynKI';
          plr = new window.Spotify.Player({
            name: 'Track Guesser Player',
            getOAuthToken: cb => { cb(token); }
          });

          // Error handling
          plr.addListener('initialization_error', ({ message }) => { setusepreview(true); console.error(message); });
          plr.addListener('authentication_error', ({ message }) => { setusepreview(true); console.error(message); });
          plr.addListener('account_error', ({ message }) => { setusepreview(true); console.error(message); });
          plr.addListener('playback_error', ({ message }) => { setusepreview(true); console.error(message); });

          // Playback status updates
          plr.addListener('player_state_changed', state => {
            log(state);
            if (state) setcurtrack(state.track_window.current_track);
          });

          // Ready
          plr.addListener('ready', ({ device_id }) => {
            log('Ready with Device ID', device_id);
            setdevice(device_id);
            localStorage.device_id = device_id;
            setcanstart(true);
          });

          // Not Ready
          plr.addListener('not_ready', ({ device_id }) => {
            log('Device ID has gone offline', device_id);
          });

          // if (plr) throw new Error('Never mind.');
          // Connect to the player!
          plr.connect();
          setusepreview(isMobileDevice());
        } catch (error) {
          log(error);
          setcanstart(true);
        }
      };
    }
    if (tracklist && canplay) playTrack(tracklist.shift());
    checkCanStart(existingScript);
    if(!genres) getGenres();
  });
  const checkCanStart = async (existingScript) => {    
    if(!device && localStorage.device_id) setdevice(localStorage.device_id);
    if (existingScript && (canstart === null && canstart === null)) setcanstart(true);
  }
  const playTrack = async (track) => {
    setpscore(null);
    setoptions(null);
    setseed(null);
    next.current.reset();
    if(preview) preview.pause();
    setcanplay(false);
    setchecked(null);
    let recommended;

    if (!props.run) {
      let recommendations = await getRecommendations(track.id);
      log('track: ', track);
      let count = 0;
      while ((!recommendations || recommendations.tracks.length < 5) && tracklist.length) {
        recommended = tracklist[Math.floor(Math.random() * tracklist.length)];
        recommendations = await getRecommendations(recommended.id, null, 40 - (count * 4));
        count++;
        if(count > 10){
          recommendations = await getRecommendations(recommended.id, 'pop');
        }
      }
      if (recommendations.tracks.length < 5) {
        log('no recommendations!', recommended);
        recommendations = await getRecommendations(null, 'pop');
      }
      log('recommended: ', recommended);
      log('recommendations: ', recommendations);
      // next.current.reset();
      setcanplay(false);
      setstarttime(new Date().getTime());
      shuffleArray(recommendations.tracks);
      setoptions(recommendations);
      await checkSaved(recommendations);
      var rand = recommendations.tracks[Math.floor(Math.random() * recommendations.tracks.length)];
      setanswears([...answears, getSimpleTrack(rand)])
      setoptionshistory([...optionshistory,recommendations.tracks.map(t => t.id)]);
      if (rand) {
        let p = await spotifyService.play(device, rand, rand.duration_ms / 3, usepreview, preview);
        setpreview(p);
      }
      // console.log("rand: ", rand);
      setseed(recommended || track);
      setcurtrack(rand.id);
      setliked(recommendations.tracks.find(t => rand.id).liked);   
    } else {      
      let recommendations = await getOptions(props.run, 19 - tracklist.length);
      setcanplay(false);
      setstarttime(new Date().getTime());
      setoptions(recommendations);
      await checkSaved(recommendations);
      let song = recommendations.tracks.find(t => t.id === recommendations.song);
      setanswears([...answears, getSimpleTrack(song)])
      let p = await spotifyService.play(device, song, 0, usepreview, preview);
      setpreview(p);
      setseed(song);
      setcurtrack(recommendations.song);   
      setliked(recommendations.tracks.find(t => recommendations.song).liked);   
    }
    setTimeout(() => next.current.start(), 300);
    setshowlike(false);
  }
  const checkSaved = async (recommendations) => {
    let saved = await spotifyService.checksaved(recommendations.tracks.map(t => t.id));
    recommendations.tracks.forEach(track => {
      track.liked = saved.includes(track.id);
    });
  }
  const createTrackList = (trl, g) => {
    if (trl) {
      log("items:", (trl.items || trl.tracks));
      let trks = (trl.items || trl.tracks).map(t => {
        return getSimpleTrack(t);
      });
      shuffleArray(trks);
      trks = trks.slice(0, plsize);
      if (g) trks.sort((a,b) => b.popularity - a.popularity);
      log("trks: ", trks);
      settracklist(trks);
    }
  }
  const getSimpleTrack = t => {
    return {
      id: t.id,
      artist: t.artists.map(e => ` ${e.name}`).toString().trimStart(),
      image: (t.album.images.find(a => a.width === 300) || { url: '' }).url,
      track: t.name,
      popularity: t.popularity,
      result: 'skipped'
    }
  }
  const checkRecommendation = function (track) {
    let repeated = answears.find(e => e.result === "hit" && e.id === track.id);
    if(repeated) log('repeated:', repeated);
    return track.preview_url && !repeated;
  }
  const getRecommendations = async (seed, g, popularity) => {
    try {
      let recommendations = await spotifyService.recommendations(seed, props.user.country, g || genre, popularity || (genre ? 11 : 31) + tracklist.length);    
      if (usepreview)  recommendations.tracks = recommendations.tracks.filter(e => checkRecommendation(e)) || [];
      log("filtered: ", recommendations.tracks.length);
      shuffleArray(recommendations.tracks);
      recommendations.tracks = recommendations.tracks.slice(0,5);
      return recommendations;      
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  const getOptions = async (run, index) => {
    try {
      let recommendations = {};
      let options = await spotifyService.options(run, index);
      recommendations = options;
      return recommendations;      
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  const checkAnwser = (track) => {
    next.current.reset();
    setliked(false);
    let ccombo = combo; // current combo;
    let ccorrect = correct;
    let trk = answears.find(e => e.id === curtrack);
    trk.result = 'miss';
    trk.time = new Date().getTime() - starttime;
    if (curtrack === track.id) {
      ccombo++;
      ccorrect = correct + 1;
      setcorrect(ccorrect);
      trk.result = 'hit';
    } else ccombo = 0;
    setanswears([...answears]);
    setcombo(ccombo);
    let cscore = calculateScore(ccombo);
    setchecked(track.id);
    let scr = createRun(genre, ccorrect, plsize, cscore, maxcombo, ccombo, answears, optionshistory)
    props.user.score = scr;
    if (!tracklist.length) {
      setanswears([]);
      setoptionshistory([]);
      setleaderboard(leaderboardService.insert(scr, props.user.id, props.challenge,leaderboard));
      settracklist(null);
      setTimeout(() => {
        setshowscore(true);
        setstarted(false);
        setcanplay(true);
      }, 3000);
    } else if (props.run) leaderboardService.insert(scr, props.user.id, props.challenge,leaderboard)    
    setshowlike(true);
  }
  const renderChecks = (track) => {
    return (
      <div>
        {(<div>
          <svg className={`check_mark ${checked && checked === track.id && curtrack === track.id ? "show" : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 17.292l-4.5-4.364 1.857-1.858 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.643z" /></svg>
          <svg className={`error_mark ${checked && checked === track.id && curtrack !== track.id ? "show" : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.971 0h-9.942l-7.029 7.029v9.941l7.029 7.03h9.941l7.03-7.029v-9.942l-7.029-7.029zm-1.402 16.945l-3.554-3.521-3.518 3.568-1.418-1.418 3.507-3.566-3.586-3.472 1.418-1.417 3.581 3.458 3.539-3.583 1.431 1.431-3.535 3.568 3.566 3.522-1.431 1.43z" /></svg>
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
        <div className="loading"><Loading /></div>
    );
  }
  const start = async () => {
    if (preview) preview.play();
    let g;
    if (select.current) {
      log("genre: ", select.current.getValue());
      g = select.current.getValue();
      setgenre(g);
    }
    let trks = await spotifyService.tracks(g);
    if (!trks.items) trks.items = trks.tracks;
    while (trks.items.length < 20) {
      shuffleArray(trks.items);
      let recommendations = await getRecommendations(trks.items[0].id, null, 25);
      if (!recommendations) continue;
      trks.items = trks.items.concat(recommendations.tracks);
    }
    createTrackList(trks, g);
    // if(!canplay) playTrack(tracklist.shift());
    setcorrect(0);
    if (started) playTrack(tracklist.shift());
    setstarted(true);
    setshowscore(false);
    setscore(0);
    setcombo(0);
    setmaxcombo(0);
    setanswears([]);
    setoptionshistory([]);
    if (props.run) {
      let lboard = await leaderboardService.insert(createRun(genre, 0, plsize, 0, 0, 0, [], []), props.user.id, props.challenge);
      setleaderboard(lboard);
    }
  }
  const getGenres = async () => {
    let res = await spotifyService.genres();
    log("genres: ", res);
    if (res) {
      let gnrs = res.genres.map(g => {
        return {
          text: g,
          value: g
        }
      });

      setgenres(gnrs);
    }
  }
  return (
    <div className="player_container">
      <div className={"counter" + (!started ? " hidden" : "")}>
        <span>{`Track ${plsize - ((tracklist || {}).length || 0)} of ${plsize}`}</span>
        <span> - </span>
        <span className="points">{ format(score, ' ')}</span><span className="multiplier">{(combo ? ` ${combo}x`: '')}</span>
        <span className="patial_score">{format(pscore || '', ' ')}</span>
      </div>
      {started ? renderCards() : (
        <div style={{margin:'auto'}}>          
          <div className='message'>{ !props.run ? <span>You can use your own songs or pick a genre</span> : <span>After start you can't go back, are you sure you want to start?</span> }</div> 
          <div className="div_start">
            <button className={`start start_button${((canstart || usepreview) && !showscore ? "" : " hidden")}`} onClick={() => start()}>Start</button>
            { !props.run ? <Select ref={select} text="Choose an genre" items={genres} value={genre} ></Select> : '' }
          </div>
        </div>
      )}
      {(seed ? (
        <div className="score_info" >
          {<Score showscore={showscore} score={score} hits={correct} total={plsize} onClick={() => start()} maxcombo={maxcombo} ></Score>}
          <div className='player-buttons'>
            <Next hide={!(tracklist || {}).length} setshowlike={setshowlike} running={running} setrunning={setrunning} started={started} ref={next} onClick={() => { if (tracklist.length) playTrack(tracklist.shift()) }} ></Next>
            <Like hidden={!showlike} liked={liked} ref={like} onClick={(p) => { toggleliked(curtrack) }} ></Like>
          </div>
          {(started && !props.run ? <Card  seed={seed}
                  artist={seed.artists ? seed.artists.map(e => ` ${e.name}`).toString().trimStart() : seed.artist}
                  image={seed.album ? seed.album.images.find(a => a.width === 300).url : seed.image} 
                  track={seed.name || seed.track} genre={genre}
                ></Card> : "")}
        </div>
      ) : <div className="score_info"></div>)}
    </div>
  )

  async function toggleliked(track) {
    if (!liked) {
      let saved = await spotifyService.save(track);
      if (saved === '') setliked(true);
    } else {
      let removed = await spotifyService.remove(track);
      if (removed === '') setliked(false);      
    }
  }

  function calculateScore(ccombo) {
    if(ccombo > maxcombo) setmaxcombo(ccombo);
    let ps = (30000 - Math.min(30000, new Date().getTime() - starttime)) * ccombo;
    setscore(score + ps);
    setpscore(ps);
    return score + ps;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function createRun(genre, ccorrect, plsize, cscore, maxcombo, ccombo, answears, optionshistory) {
    return {
      genre: genre || 'Normal',
      hits: ccorrect,
      total: plsize,
      points: cscore,
      maxcombo: Math.max(maxcombo, ccombo),
      date: new Date(),
      songs: answears,
      options: optionshistory
    };
  }
}
