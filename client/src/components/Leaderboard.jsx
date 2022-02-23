import React, { useState } from 'react';
import "./Leaderboard.css";
import leaderboardService from '../services/leaderboardService';
import format from '../modules/format';
import ProfilePicture from './ProfilePicutre';
import Flag from './Flag';
import {Tab, Tabs} from './tabs';
import runtimeEnv from '../modules/runtimeEnv';
import Loading from './Loading';
import PlayerListSimple from './PlayerListSimple';

export default function Leaderboard(props) {
    // if (props.preview) props.preview.pause();
    const [users, setusers] = useState();
    const [genres, setgenres] = useState();
    const Link = props.link;
    const env = runtimeEnv();
    const getUsers = async () => {
        if (!users) {
            let result = await leaderboardService.get('Normal');
            setusers(result);
        }
    }
    const getGenres = async () => {
        if (!genres) {
            let result = await leaderboardService.get();
            setgenres(result);
        }
    }    
    const hide = {
        display: 'none'
    }
    const roundPicture = {
        borderRadius: '50%'
    }
    const bare = {
        color: 'white',
        textDecoration: 'none'
    }
    const challenge = {
        position: 'absolute',
        right: '4px',
        bottom: '4px',
        fontWeight: 'bold',
    }

    return (
        <Tabs default={0}>
            <Tab id="User" call={getUsers}>
                <div className="user_list">
                    {users ? users.map((u, i) => {
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
                                    <div className="leaderboard_profile_points"><span>{format((u.score || {}).points || 0, ' ')}</span><span style={{ color: 'grey' }} >{`${(u.score || {}).genre && (u.score || {}).genre !== 'Normal' ? `(${(u.score || {}).genre})` : ''}`}</span></div>
                                    <div className="leaderboard_profile_stats" style={!u.score ? hide : null} >
                                        <span>{(u.score || {}).hits} of {(u.score || {}).total}</span>
                                        <span>Max Combo: {(u.score || {}).maxcombo}</span>
                                        <Flag code={u.country} />
                                    </div>
                                </div>
                            </div>)
                    }) : <div className="loading"><Loading /></div>}
                </div>
            </Tab>
            <Tab id="Genre" call={getGenres}>
                {
                    genres ? genres.map((g, i) => {
                        return (<PlayerListSimple g={g} i={i} challenge={challenge}></PlayerListSimple>);
                    }) : <div className="loading"><Loading /></div>
                }
            </Tab>
        </Tabs>
    )
}