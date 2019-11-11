import React from 'react';
import "./Score.css";

export default function Score(props) {
    return (
        <div className={`container_score${(props.showscore ? " fade-in show" : "")}`}>
            <div className="overlay">
                <div className="score head">
                    <p>Final Score {props.score}</p>
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