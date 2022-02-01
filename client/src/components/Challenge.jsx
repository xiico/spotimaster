import React, { useState } from 'react';
import "./Challenge.css";
import challengeService from '../services/challengeService';
import format from '../modules/format';
import ProfilePicture from './ProfilePicutre';
import Flag from './Flag';
import Player from "./Player";
import {Tab, Tabs} from './tabs';

export default function Challenge(props) {
    // if (props.preview) props.preview.pause();
    const [latest, setlatest] = useState();
    const [challenge, setchallenge] = useState();
    const [genres, setbygenres] = useState();
    const [run, setrun] = useState();
    const [challengeinfo, setchallengeinfo] = useState();
    const params = props.history.match.params;
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
    const roundPicture = {
        borderRadius: '50%'
    }
    const startChallenge = async (challenge) => {
        setrun(challenge.defending);
        setchallengeinfo(challengeService.getinfo(challenge._id));
        setchallenge(challenge._id);
    }

    const playerCard = (user) => {
        return (
          <div className='player-card'>
                {user.picture ? <img className='picture' alt="User" style={roundPicture} src={user.picture} onError={(e) => {if (e.target.src !== '/img/user.png') e.target.src = '/img/user.png';}} />:<ProfilePicture css={'picture'} size={'medium'} />}
                <div className="name" >{user.name}</div>
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

    const renderTabs = () => {
        return (          
            <Tabs default={0}>
                <Tab id="Latest" call={!params.id ? getLatest : getById}>
                {latest ? latest.map((c, i) => {
                            return (
                                <div key={i} className="versus-entry">
                                    {playerCard(c.defending.user)}
                                    <div className="points challenge-points" >{format(c.defending.points, ' ')}</div>
                                    <div className='versus'>Vs</div>
                                    <div className='challenge-style'>{c.defending.genre === 'Normal' ? 'Personal' : c.defending.genre}</div>
                                    { props.user && props.user.id !== c.defending.user.id ? <button className='challenge' onClick={() => startChallenge(c)}>Challenge</button> : ''}
                                </div>
                                )
                        }) : ""}
                </Tab>
                <Tab id="Genre" call={getByGenre}>
                    {
                        genres && genres.map((g, i) => {
                            return (
                                <div key={i} className="genre-entry">
                                </div>
                            );
                        })
                    }
                </Tab>
            </Tabs>
        );
      };

    return ( run ? renderPlayer() : renderTabs() );
}