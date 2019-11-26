import React, {useState, useImperativeHandle, useRef, forwardRef} from 'react';
import "./Select.css";
const Select = forwardRef((props, ref) => {
    const [state,setstate] = useState(props.default);
    const select = useRef();
    const handleChange = (e) => {
        setstate(e.target.options[e.target.selectedIndex].value);
    }
    useImperativeHandle(ref, () => ({
        getValue() {
            return state;
        }
    }));
    return (
        <div className="select">
            <select ref={select} defaultValue={props.default} onChange={handleChange}>
                <option key={-1} value={props.default}>{props.text ? props.text : "Choose an option"}</option>
                {(props.items || []).map((item,i) => {
                    return <option key={i} value={item.value}>{item.text}</option>
                })}
            </select>
        </div>
    );
});
export default Select;