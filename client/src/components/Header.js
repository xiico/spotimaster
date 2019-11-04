import React from 'react';
import './Header.css';
export default function Header(props) {
    return (
        <div>
            <ul>
                <li><a href="#home">Spotimaster</a></li>                
                <li className="profile-picture">
                    <span className="profile-name">{props.id}</span>
                    <img alt="Profile" className="profile-picture" src="https://scontent.xx.fbcdn.net/v/t1.0-1/c49.49.615.615a/s200x200/486373_521426084545963_1017854588_n.jpg?_nc_cat=102&_nc_oc=AQnong2-BymD7Fu77G9Z0yg1DKXMbP-fPATrCIbS_fSo7jxYtszY0uKLuHlEVZe041Y&_nc_ht=scontent.xx&oh=6d4540958ded7e9f52e9045c895fd952&oe=5E192394"></img>
                </li>
            </ul>
        </div>
    );
}