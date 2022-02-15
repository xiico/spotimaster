import React, { useState, useImperativeHandle, useRef, forwardRef } from 'react';
import './Next.css';
const Next = forwardRef((props, ref) => {
    // const [running, setrunning] = useState(false);
    const [timers, setimers] = useState([]);
    const btn = useRef();
    let running = props.running;
    let setrunning = props.setrunning;
    useImperativeHandle(ref, () => ({
        reset() {
            clearTimeout(timers[0]);
            clearTimeout(timers[1]);
            setTimeout(function () {
                if (btn.current) btn.current.classList.add("done");
            }, 100);
            setTimeout(function () {
                if (btn.current) {
                    btn.current.classList.remove("load");
                    btn.current.classList.remove("done");
                    setrunning(false);
                }
            }, 200);
            setrunning(false);
        },
        done() {
            btn.current.classList.add("done");
        },
        start() {
            if (!running) {
                setrunning(true);
                let tmrs = [];
                btn.current.classList.add("load");
                tmrs[0] = setTimeout(function () {
                    if (btn.current) btn.current.classList.add("done");
                }, 30000);
                tmrs[1] = setTimeout(function () {
                    if (btn.current) {
                        btn.current.classList.remove("load");
                        btn.current.classList.remove("done");
                    }
                    setrunning(false);
                }, 30100);
                setimers(tmrs);
            }
        },
        isrunning() {
            return running;
        }
    }));
    return (
        <div ref={btn} className={`btn-circle-download${(props.started ? "" : " hidden")}`} onClick={props.onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                width="48" height="48"
                viewBox="0 0 172 172"
                style={{ fill: '#000000' }}>
                <path className={(props.hide ? "hidden" : "")} d="M127.21953,81.7l-58.75547,-36.11328c-1.6125,-0.97422 -3.72891,-1.04141 -5.375,-0.10078c-1.67969,0.94063 -2.72109,2.72109 -2.72109,4.63594v71.89063c0,1.91484 1.04141,3.69531 2.6875,4.63594c0.80625,0.43672 1.67969,0.67188 2.58672,0.67188c0.97422,0 1.91484,-0.26875 2.75469,-0.77266l58.75547,-35.81094c1.57891,-0.94063 2.55312,-2.6875 2.55312,-4.50156c0.06719,-1.84766 -0.90703,-3.59453 -2.48594,-4.53516z" fill="#00cc00"></path>
            </svg>
            <svg id="border" width="48px" height="48px" viewBox="0 0 48 48">
                <path d="M24,1 L24,1 L24,1 C36.7025492,1 47,11.2974508 47,24 L47,24 L47,24 C47,36.7025492 36.7025492,47 24,47 L24,47 L24,47 C11.2974508,47 1,36.7025492 1,24 L1,24 L1,24 C1,11.2974508 11.2974508,1 24,1 L24,1 Z"></path>
            </svg>
        </div>
    );
});
export default Next;