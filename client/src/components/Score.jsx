import React from 'react';
import "./Score.css";
import format from '../modules/format';
import PlayerCard from "./PlayerCard";

export default function Score(props) {
    const run = props.run;
    const challenge = props.challenge;
    const leaderboard = props.leaderboard;
    const winner = () => {
        if (!challenge || !leaderboard) return {};
        return challenge.score > leaderboard.points ? challenge.defending.user : leaderboard.user;
    }
    return (
        <div className={`container_score${(props.showscore ? " fade-in show" : "")}`}>
            <div className="overlay">
                <div className="score head">
                    <p>Final Score: <span className="points">{ format(props.score, ' ')}</span></p>
                    <hr />
                </div>
                <div className="score hits">
                    <p className="old">{props.hits} of {props.total} Tracks - {`Max combo: ${props.maxcombo}`}</p>
                </div>
                {!props.challenge ?                
                <div className="score again">
                    {/* <span>▶</span> */}
                    <span onClick={props.onClick}>▶ Play Again</span>
                </div> : <PlayerCard run={run} winner={winner()._id} score={true} cr={challenge} user={leaderboard ? winner() : null} points={challenge.points}></PlayerCard>}
            </div>
        </div>
    );
}