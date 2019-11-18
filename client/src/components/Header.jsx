import React from 'react';
import './Header.css';
import Login from "./Login";
import Menu from "./Menu";
import ProfilePicture from './ProfilePicutre';
export default function Header(props) {
    // console.log('header:',props.user);
    const Link = props.link;
    return (
        <div>
            <Menu link={props.link} />
            <ul>
                <li><Link to="/leaderboard">Leaderboard</Link></li>
                <li className="profile-picture">
                    {(
                        props.user
                            ?
                            <div>
                                <span className="profile-name">{props.user.display_name}</span>
                                {( props.user.images[0] ? <img alt="Profile" className="profile-picture" src={props.user.images[0].url}></img> : <ProfilePicture size={'small'} />)}
                            </div>
                            :
                            <Login></Login>
                    )}
                </li>
            </ul>
        </div>
    );
}