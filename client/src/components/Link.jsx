import React from 'react';
import "./Link.css";
export default function Link(props) {
    return <a className="link" href={props.href} >{props.text}</a>;
}