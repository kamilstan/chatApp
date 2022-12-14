import React from "react";
import {NavigationBar} from "../../components/NavigationBar/NavigationBar";
import {SingleRoom} from "../../components/SingleRoom/SingleRoom";

export const RoomPage = (props) => {

    return (
        <>
            <NavigationBar socket={props.socket} userId={props.userId} setUserId={props.setUserId}/>
            <SingleRoom socket={props.socket} userId={props.userId}/>
        </>
    )
}