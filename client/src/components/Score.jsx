import React from 'react';
import "./Score.css";

export default function Score(props) {
    return (
        <div class={`container_score${(props.showscore ? " fade-in show" : "")}`}>
            <div class="overlay">
                <div class="score head">
                    <p>Final Score {props.score}</p>
                    <hr />
                </div>
                <div class="score hits">
                    <p class="old">{props.hits} of {props.total} Artists</p>
                </div>
                <div class="score again">
                    <i>▶</i>
                    <span onClick={props.onClick}>Play Again</span>
                </div>
            </div>
        </div>
    );
}