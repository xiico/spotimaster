import React from 'react';
import './Header.css';
import Login from "./Login";
import Menu from "./Menu";
import ProfilePicture from './ProfilePicutre';
export default function Header(props) {
    // console.log('header:',props.user);
    const Link = props.link;
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
                <li><Link to="/leaderboard">Leaderboard</Link></li>
                <li><span>|</span></li>
                {/* <li><Link to="/challenges">Challenges</Link></li> */}
                <li className="profile-picture">
                    {(
                        props.user
                            ?
                            <div>
                                <span className="profile-name">{props.user.display_name}</span>
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