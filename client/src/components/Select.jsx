import React, {useState, useImperativeHandle, useRef, forwardRef} from 'react';
import "./Select.css";
// import log from "../modules/log";
const Select = forwardRef((props, ref) => {
    const [value,setvalue] = useState(props.default || props.value);
    const select = useRef();
    const handleChange = (e) => {
        setvalue(e.target.options[e.target.selectedIndex].value);
    }
    useImperativeHandle(ref, (e) => ({
        getValue() {
            return value;
        },
        setValue(v) {
            setvalue(v);
        }
    }));
    return (
        <div className="select">
            <select ref={select} defaultValue={props.default} value={value} onChange={handleChange}>
                <option key={-1} value={props.default}>{props.text ? props.text : "Choose an option"}</option>
                {(props.items || []).map((item,i) => {
                    return <option key={i} value={item.value}>{item.text}</option>
                })}
            </select>
        </div>
    );
});
export default Select;