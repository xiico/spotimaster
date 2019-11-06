import React from 'react';
import "./Card.css";
export default function Card(props) {
    return (
            <div onClick={props.onClick} id={props.id} className="card">
                <div className="card_image">
                    <img src={props.image} />
                </div>
                <div className="card_title">
                    <p>{props.track}</p>
                    <p className="card_subtitle">{props.artist}</p>
                </div>
            </div>
    );
}