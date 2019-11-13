import React from 'react';
import './Header.css';
import Login from "./Login";
import Menu from "./Menu";
export default function Header(props) {
    // console.log('header:',props.user);
    const Link = props.link;
    return (
        <div>
            <Menu link={props.link} />
            <ul>
                <li><Link to="/">Spotimaster</Link></li>
                <li className="profile-picture">
                    {(
                        props.user
                            ?
                            <div>
                                <span className="profile-name">{props.user.display_name}</span>
                                <img alt="Profile" className="profile-picture" src={props.user.images[0].url}></img>
                            </div>
                            :
                            <Login></Login>
                    )}
                </li>
            </ul>
        </div>
    );
}