import React from "react";
import {NavigationBar} from "../../components/NavigationBar/NavigationBar";
import {HomeContent} from "../../components/HomeContent/HomeContent";

export const HomePage = (props) => {
    return (
        <>
            <NavigationBar socket={props.socket} userId={props.userId} setUserId={props.setUserId}/>
            <HomeContent socket={props.socket} userId={props.userId}/>
        </>
    )
}