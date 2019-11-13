import React from 'react';
import "./Menu.css";
export default function Menu(props){
    const Link = props.link;
    return (
        <nav className="nav">
            <ul>
                <li className="drop"><Link to="/"><span role="img" aria-label="Menu" >🎵</span></Link>
                    <ul className="dropdown">
                        <li><Link to="/leaderboard">Leaderboard</Link></li>
                    </ul>
                </li>
            </ul>
        </nav>
    );
}