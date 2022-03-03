import React from 'react';
import ProfilePicture from './ProfilePicutre';
import format from '../modules/format';
export default function PlayerCard(props){
    // const Link = props.link;
    const winner = props.winner;
    const Link = props.link;
    const playerCount = props.playercount !== undefined ? props.playercount : 0
    const roundPicture = {
        borderRadius: '50%'
    }
    return (
        props.user ?
        <div className={`player-card ${props.score ? 'slide-in' : ''}`} style={props.style}>
            {playerCount > 1 ? <div class="player-count">{playerCount > 10 ? '+' : ''}{playerCount <= 10 ? playerCount : 9}</div> : ''}
            <span className={`${props.user._id === winner ? 'winner' : 'hide'}`}>Winner!</span>
            <Link to={`/challenges/${props.user._id}`}>{props.user.picture ? <img className='picture' alt="User" style={roundPicture} src={props.user.picture} onError={(e) => {if (e.target.src !== '/img/user.png') e.target.src = '/img/user.png';}} />:<ProfilePicture css={'picture'} size={'medium'} />}</Link>
            <div className="name" >{props.user.name}</div>
            {props.points !== undefined ? <span className='points'>{format(props.points, ' ')}</span> : ''}
        </div>
        :
        ''
      );
}