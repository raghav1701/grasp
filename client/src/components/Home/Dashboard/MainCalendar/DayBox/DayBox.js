import React, {useState, useEffect} from 'react'

//component
import {GET_FULL_MONTH} from "../MainCalendar" 

//classes
import classes from "./DayBox.css"

const DayBox = (props) => {

    const [width, setWidth] = useState(window.innerWidth)

    useEffect(()=>{
        window.addEventListener("resize", ()=>{
            setWidth(window.innerWidth);
        })
        
        return () => {
            window.removeEventListener("resize", ()=>{});
        }
    }, [])

    let DayBoxClassList = [classes.DayBox]
    if(props.selected){
        if(props.current){
            DayBoxClassList.push(classes.DayBox_current_selected)
            DayBoxClassList.push(classes.DayBox_current)
        }else{
            DayBoxClassList.push(classes.DayBox_selected)
        }
    }else if(props.current){
        DayBoxClassList.push(classes.DayBox_current)
    }else{
        DayBoxClassList.push(classes.DayBox_default)
    }

    let EventClassList = [classes.EventSym]
    
    if(props.event){    
        if(props.current){
            EventClassList.push(classes.EventSym_current)   
        }else{
            EventClassList.push(classes.EventSym_default)   
        }
    }else{
        EventClassList = []
    }

    let boxStyle = {
        height: width>350 ? "40px" : "30px",
        width: width>350 ? "40px" : "30px"
    }
    if(props.Month){
        boxStyle = {
            height: width>350 ? "70px" : "55px" ,
            width: width>350 ? "70px" : "55px" ,
            fontSize: width>350 ? "0.8rem" : "0.7rem"
        }
    }
    else if(props.Year){
        boxStyle = {
            height: width>350 ? "70px" : "50px" ,
            width: width>350 ? "70px" : "50px" 
        }
    }
    // console.log(props.fade)
    return (
        <div onClick={()=>props.selectClick(props.dateValue)} className={DayBoxClassList.join(" ")} style={{color: props.fade && "#cacaca", ...boxStyle}}>
            {props.Month ? GET_FULL_MONTH(props.dateValue[1]) : props.dateValue[1] }
            <span className={EventClassList.join(" ")}></span>
        </div>
    )
}

export default DayBox
