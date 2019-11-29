import React, {useState, useEffect} from 'react';

import './tabs.css';
// import log from '../modules/log';

function Tabs(props) {
    const [activeindex, setactiveindex] = useState(null);
    
    useEffect(() => {
        if(props.default !== undefined){
            callChildFunction(props.children[props.default]);
            setactiveindex(props.default)
        }
    // eslint-disable-next-line
    },[])
    const handleClick = e => {
        setactiveindex(parseInt(e.target.dataset.id));
        callChildFunction(props.children[parseInt(e.target.dataset.id)]);
    }

    const callChildFunction = (child) => {
        let call = child.props.call;
        if (call) call.call();
    }

    const renderChildren = () => {
        return props.children[activeindex];
    }

    return (
        <div className="tabs">
            <ul className="tabs-nav">
                {props.children.map((child, index) => {
                    return <li key={index}><button id={index} data-id={index} className={`tablinks${activeindex === index ? ' active' : ''}`} onClick={handleClick}>{child.props.id}</button></li>
                })}
            </ul>
            { renderChildren() }
        </div>
    );
}

function Tab(props) {
    return (
        <div id={props.id} className="tabcontent"> 
            {props.children}
        </div>
    );
}

export { Tab, Tabs };