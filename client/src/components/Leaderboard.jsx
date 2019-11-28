import React, { useEffect, useState } from 'react';
import "./Leaderboard.css";
import leaderboardService from '../services/leaderboardService';
import format from '../modules/format';
import ProfilePicture from './ProfilePicutre';
import Flag from './Flag';

export default function Leaderboard(props) {
    if (props.preview) props.preview.pause();
    const [users, setusers] = useState();
    useEffect(() => {
        const getUsers = async () => {
            let result = await leaderboardService.get('Normal');
            setusers(result);
        }
        getUsers();
    }, []);

    const hide = {
        display: 'none'
    }

    return (
        <div className="user_list">
            {users ? users.map((u, i) => {
                return (
                    <div className="leaderboard_profile" key={u.id}>
                        <div className="leaderboard_profile_rank">{(i + 1)}</div>
                        <div className="leaderboard_picture" >
                            <a target="_blank" rel="noopener noreferrer" href={`https://open.spotify.com/user/${u.id}`}>
                                {(u.picture ? <img className="leaderboard_profile_picture" alt="Profile" src={u.picture} /> : <ProfilePicture size={'big'} />)}
                            </a>
                        </div>
                        <div className="leaderboard_profile_info">
                            <span className="leaderboard_profile_name">{u.name}</span>
                            <div className="leaderboard_profile_points"><span>{format((u.score || {}).points || 0, ' ')}</span><span style={{color: 'grey'}} >{`${(u.score || {}).genre && (u.score || {}).genre !== 'Normal' ? `(${(u.score || {}).genre})` : '' }`}</span></div>
                            <div className="leaderboard_profile_stats" style={!u.score ? hide : null} >
                                <span>{(u.score || {}).hits} of {(u.score || {}).total}</span>
                                <span>Max Combo: {(u.score || {}).maxcombo}</span>
                                <Flag code={u.country} />
                            </div>
                        </div>
                    </div>)
            }) : ""}
        </div>
    )
}