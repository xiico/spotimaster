import React from 'react';
import './Header.css';
import Login from "./Login";
import Menu from "./Menu";
import ProfilePicture from './ProfilePicutre';
// import userService from '../services/userService';
export default function Header(props) {
    // console.log('header:',props.user);
    // const Link = props.link;
    const NavLink = props.navlink;
    const logOut = () => {
        localStorage.clear();
        let location = window.location;
        window.location = location;
    }
    const pointer = {
        cursor: 'pointer'
    }
    return (
        <div>
            <Menu link={props.link} />
            <ul>
                <li><NavLink to="/leaderboard/#">Leaderboard</NavLink></li>
                <li><span>|</span></li>
                <li><NavLink to="/challenges/#">Challenges</NavLink></li>
                <li className="profile-picture">
                    {(
                        props.user
                            ?
                            <div>
                                <span title={props.user.display_name} className="profile-name">{props.user.display_name}</span>
                                {( props.user.images[0] ? <img style={pointer} title="Log Out" alt="Profile" onClick={() => logOut()} className="profile-picture" src={props.user.images[0].url}></img> : <ProfilePicture pointer={pointer} onClick={() => logOut()} size={'small'} />)}
                            </div>
                            :
                            <Login></Login>
                    )}
                </li>
            </ul>
        </div>
    );
}