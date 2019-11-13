import React from 'react';
import "./Anchor.css";
export default function Anchor(props) {
    return <a className="anchor" href={props.href} >{props.text}</a>;
}