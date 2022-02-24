import React, { useRef, useEffect, useState } from 'react';
import './Header.css';
import Login from "./Login";
import Menu from "./Menu";
import ProfilePicture from './ProfilePicutre';
// import userService from '../services/userService';
export default function Header(props) {
    // console.log('header:',props.user);
    // const Link = props.link;
    const NavLink = props.navlink;
    const chk = useRef();
    const [savetracks, setsavetracks] = useState(null);
    const logOut = () => {
        localStorage.clear();
        window.location.reload();
    }
    const allowSaveTrack = () => {
        localStorage.allowSaveTrack = chk.current.checked;
        setsavetracks(chk.current.checked);
        if (props.user) logOut();
    }
    useEffect(() => {
        chk.current.checked = localStorage.allowSaveTrack === "true";
        setsavetracks(chk.current.checked);
    });
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
                <li className="profile-picture tooltip">
                    {(
                        props.user
                            ?
                            <div>
                                <span title={props.user.display_name} className="profile-name">{props.user.display_name}</span>
                                {( props.user.images[0] ? <img style={pointer} title="Log Out" alt="Profile" onClick={() => logOut()} className="profile-picture" src={props.user.images[0].url}></img> : <ProfilePicture pointer={pointer} onClick={() => logOut()} size={'small'} />)}
                            </div>
                            :
                            <Login savetracks={savetracks}></Login>
                    )}
                    <div className='tooltiptext' title='Allow Track Guesser to save or remove the song you are listening to your library.'>
                        <input ref={chk} type='checkbox' onChange={() => allowSaveTrack()} />Allow save track?
                    </div>
                </li>
            </ul>
        </div>
    );
}