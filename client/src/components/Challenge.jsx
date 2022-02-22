import React, { useState } from 'react';
import "./Challenge.css";
import challengeService from '../services/challengeService';
import format from '../modules/format';
import ProfilePicture from './ProfilePicutre';
// import Flag from './Flag';
import Player from "./Player";
import {Tab, Tabs} from './tabs';
import runtimeEnv from '../modules/runtimeEnv';
import "./Leaderboard.css";
import Flag from './Flag';
import Loading from './Loading';
import './Button.css';
import PlayerCard from "./PlayerCard";

export default function Challenge(props) {
    // if (props.preview) props.preview.pause();
    const [latest, setlatest] = useState();
    const [challenge, setchallenge] = useState();
    const [ranking, setranking] = useState();
    const [run, setrun] = useState();
    const [challengeinfo, setchallengeinfo] = useState();
    const params = props.history.match.params;
    const env = runtimeEnv();
    const Link = props.link;
    const getLatest = async () => {
        if (!latest) {
            let result = await challengeService.latest();
            setlatest(result);
        }
    }
    const getByRanking = async () => {
        if (!ranking) {
            let result = await challengeService.getRanking();
            setranking(result);
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
    const bare = {
        color: 'white',
        textDecoration: 'none'
    }
    const startChallenge = async (challenge) => {
        setrun(challenge.defending);
        setchallengeinfo(challengeService.getinfo(challenge._id));
        setchallenge(challenge);
    }
    // const showWinner = (challenge) => {
    //     if (challenge.winner){
    //         if (challenge.defending.user._id === challenge.winner) return 'winner';
    //         if (challenge.challenger.find(c => c.user._id === challenge.winner)) return 'winner'
    //     }
    //     return 'hide';
    // }

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

    const playerCard = (cr, style, winner) => {
        return (
         <PlayerCard winner={winner} cr={cr} user={cr.user} style={style} points={cr.points}></PlayerCard>
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
        return (          
            <Tabs default={0}>
                <Tab id="Latest" call={!params.id ? getLatest : getById}>
                {latest ? latest.map((c, i) => {
                            return (
                                <div key={i} className="versus-entry">
                                    {/* <span className={`winner ${showWinner(c)}`}>Winner!</span> */}
                                    <div className='defending'>{playerCard(c.defending, null, c.winner)}</div>
                                    {c.challenger ? c.challenger.map((cr,k) => { return (<div key={k} className='challenger'>{playerCard(cr, cardOffset(k), c.winner)}</div>)}) : ''}
                                    <div className="points challenge-points" >{format(c.score, ' ')}</div>
                                    <div className='versus'>Vs</div>
                                    <div className='challenge-style'>{c.defending.genre === 'Normal' ? 'Personal' : c.defending.genre}</div>
                                    { canChallange(c) ? <button className='challenge' onClick={() => startChallenge(c)}>Challenge</button> : ''}
                                    { props.user ? <button className='share' style={canChallange(c) ? shareChallenge : null}  onClick={() => share(c)} ></button> : ''}
                                </div>
                                )
                        }) : <div className="loading"><Loading /></div>}
                </Tab>
                <Tab id="Ranking" call={getByRanking}>
                    <div className="user_list">
                        {
                            ranking ? ranking.map((u, i) => {
                                return (
                                    <div className="leaderboard_profile" key={u.id}>
                                        <div className="leaderboard_profile_rank">{(i + 1)}</div>
                                        <div className="leaderboard_picture" >
                                            <a target="_blank" rel="noopener noreferrer" href={`https://open.spotify.com/user/${u.id}`}>
                                                {(u.picture ? <img className="leaderboard_profile_picture" alt="Profile" src={u.picture} onError={(e) => {if (e.target.src !== '/img/user.png') e.target.src = '/img/user.png';}} /> : <ProfilePicture size={'big'} />)}
                                            </a>
                                        </div>
                                        <div className="leaderboard_profile_info">
                                            <Link style={bare} to={`/challenges/${u._id}`}><span className="leaderboard_profile_name">{u.name}</span></Link>                                    
                                            <div className="leaderboard_profile_points"><span style={bare}>Wins: </span><span>{format(u.count)}</span></div>
                                            <div className="leaderboard_profile_stats">
                                                <Flag code={u.country} />
                                            </div>
                                        </div>
                                    </div>);
                            }) : <div className="loading"><Loading /></div>
                        }
                    </div>
                </Tab>
            </Tabs>
        );
      };

    return ( run ? renderPlayer() : renderTabs() );
}