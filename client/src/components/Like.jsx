import React, { useState, useImperativeHandle, useRef, forwardRef } from 'react';
import './Like.css';
const Like = forwardRef((props, ref) => {
    // const [liked, setliked] = useState(false);
    // const [timers, setimers] = useState([]);
    // const [hidden, sethidden] = useState(true);    
    const btn = useRef();
    // useImperativeHandle(ref, () => ({
    //     liked(l) {
    //         setliked(l);
    //     },
    // }));
    return (
        <div ref={btn} className={`track-status${(props.hidden ? " hidden" : "")}${props.liked ? ' liked' : ' not-liked'}`} onClick={props.onClick}>
        </div>
    );
});
export default Like;