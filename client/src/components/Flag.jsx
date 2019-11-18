import React from 'react';
import './Flag.css';
export default function Flag(props) {
    return <img src="../../../img/blank.gif" id="imgFlag" alt="Brazil" className={`flag flag-${props.code.toLowerCase()}`}></img>;
}