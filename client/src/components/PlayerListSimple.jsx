import React from 'react';
import ProfilePicture from './ProfilePicutre';
import format from '../modules/format';
export default function PlayerListSimple(props){
    // const Link = props.link;
    const Link = props.link;
    const g = props.g;
    const i = props.i;
    const challenge = props.challenge;
    const roundPicture = {
        borderRadius: '50%'
    }
    return (
        <div key={i} className={`genre-entry ${g._id ? '' : 'lb'}`}>
            {<span className="genre-name">{g._id ? g._id : 'Leaderboard'}</span>}
            {g.scores.sort((a,b) => b.points - a.points).map((s, k) => {
                return (
                    <div key={k} className="tabs-user">
                        {s.user.picture ? <img alt="User" style={roundPicture} src={s.user.picture} onError={(e) => {if (e.target.src !== '/img/user.png') e.target.src = '/img/user.png';}} />:<ProfilePicture />}
                        <div className="tabs-user-name" >{s.user.name}</div>
                        <div className="tabs-user-points" >{format(s.points, ' ')}</div>
                        { props.user && props.user.id !== s.user.id ? <Link style={challenge} to={`/challenges/${s._id}`}>Challenge</Link> : ''}
                        <span className='user-ranking'>{k+1}</span>
                    </div>
                )
            })}
        </div>
    );
}