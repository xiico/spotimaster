import React from 'react';
import "./Menu.css";
export default function Menu(props){
    const Link = props.link;
    return (
        <nav className="nav">
            <ul>
                <li className="drop"><span role="img" aria-label="Menu" >🎵</span>
                    <ul className="dropdown">
                        <li><Link to="/leaderboard">Leaderboard</Link></li>
                    </ul>
                </li>
            </ul>
        </nav>
    );
}