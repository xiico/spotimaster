import React from 'react';
import "./Score.css";
import format from '../modules/format';

export default function Score(props) {
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
                <div className="score again">
                    <i>▶</i>
                    <span onClick={props.onClick}>Play Again</span>
                </div>
            </div>
        </div>
    );
}