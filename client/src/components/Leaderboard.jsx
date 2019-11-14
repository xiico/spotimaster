import React from 'react';
import "./Leaderboard.css";
export default function Leaderboard(props){
    if(props.preview) props.preview.pause()
    return (
        <div>
            Leaderboards
        </div>
    )
}