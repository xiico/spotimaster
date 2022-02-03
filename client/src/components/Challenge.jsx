import React, { useState } from 'react';
import "./Challenge.css";
import challengeService from '../services/challengeService';
import format from '../modules/format';
import ProfilePicture from './ProfilePicutre';
// import Flag from './Flag';
import Player from "./Player";
import {Tab, Tabs} from './tabs';
import runtimeEnv from '../modules/runtimeEnv';

export default function Challenge(props) {
    // if (props.preview) props.preview.pause();
    const [latest, setlatest] = useState();
    const [challenge, setchallenge] = useState();
    const [genres, setbygenres] = useState();
    const [run, setrun] = useState();
    const [challengeinfo, setchallengeinfo] = useState();
    const params = props.history.match.params;
    const env = runtimeEnv();
    const getLatest = async () => {
        if (!latest) {
            let result = await challengeService.latest();
            setlatest(result);
        }
    }
    const getByGenre = async () => {
        if (!genres) {
            let result = await challengeService.get();
            setbygenres(result);
        }
    } 
    const getById = async () => {
        let result = await challengeService.get(params.id);
        setlatest(result);
    }   
    const hide = {
        display: 'none'
    }
    const shareChallenge = {
        left: '64%'
    }
    const roundPicture = {
        borderRadius: '50%'
    }
    const startChallenge = async (challenge) => {
        setrun(challenge.defending);
        setchallengeinfo(challengeService.getinfo(challenge._id));
        setchallenge(challenge._id);
    }
    const showWinner = (challenge) => {
        if (challenge.winner){
            if (challenge.defending.user._id === challenge.winner) return 'defending';
            if (challenge.challenger.find(c => c.user._id === challenge.winner)) return 'challenger'
        }
        return 'hide';
    }

    const cardOffset = (index) => {
        switch (index) {
            case 0:
                return {right:'15px'};
            case 1:
                return {right:'20px'};
            case 2:
                return {right:'25px'};
            case 3:
                return {right:'30px'};
        
            default:
                return {right:'25px'};
        }
    }

    const playerCard = (cr, style) => {
        return (
          <div className='player-card' style={style}>
                {cr.user.picture ? <img className='picture' alt="User" style={roundPicture} src={cr.user.picture} onError={(e) => {if (e.target.src !== '/img/user.png') e.target.src = '/img/user.png';}} />:<ProfilePicture css={'picture'} size={'medium'} />}
                <div className="name" >{cr.user.name}</div>
                <span className='points'>{format(cr.points, ' ')}</span>
          </div>
        );
      }
    const renderPlayer = () => {
        return (
            <React.StrictMode>
                <div className="player">
                    <Player user={props.user} preview={props.preview} setpreview={props.setpreview} run={run} challenge={challenge} ></Player>
                </div>
            </React.StrictMode>
        );
    };

    const canChallange = (c) => {
        return props.user && props.user.id !== c.defending.user.id && (!c.challenger.length || !c.challenger.find(e => e.user.id === props.user.id));
    }

    const share = (c) => {
        navigator.share({
            title: 'Share challenge',
            url: `${env.REACT_APP_HOST_CLIENT}/challenges/${c._id}`
          }).then(() => {
            console.log('Thanks for sharing!');
          }).catch(console.error);
    }

    const renderTabs = () => {
        document.querySelectorAll('[property="og:title"]')[0].setAttribute('content','Challenge Page');
        return (          
            <Tabs default={0}>
                <Tab id="Latest" call={!params.id ? getLatest : getById}>
                {latest ? latest.map((c, i) => {
                            return (
                                <div key={i} className="versus-entry">
                                    <span className={`winner ${showWinner(c)}`}>Winner!</span>
                                    <div className='defending'>{playerCard(c.defending)}</div>
                                    {c.challenger ? c.challenger.map((cr,k) => { return (<div key={k} className='challenger'>{playerCard(cr, cardOffset(k))}</div>)}) : ''}
                                    <div className="points challenge-points" >{format(c.score, ' ')}</div>
                                    <div className='versus'>Vs</div>
                                    <div className='challenge-style'>{c.defending.genre === 'Normal' ? 'Personal' : c.defending.genre}</div>
                                    { canChallange(c) ? <button className='challenge' onClick={() => startChallenge(c)}>Challenge</button> : ''}
                                    { props.user ? <button className='share' style={canChallange(c) ? shareChallenge : null}  onClick={() => share(c)} ><img alt='share' src='/img/share-icon.png'/></button> : ''}
                                </div>
                                )
                        }) : ""}
                </Tab>
                <Tab id="Genre" call={getByGenre}>
                    {
                        // genres && genres.map((g, i) => {
                        //     return (
                        //         <div key={i} className="genre-entry">
                        //         </div>
                        //     );
                        // })
                    }
                </Tab>
            </Tabs>
        );
      };

    return ( run ? renderPlayer() : renderTabs() );
}