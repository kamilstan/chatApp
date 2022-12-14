import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {ChatWindow} from "../ChatWindow/ChatWindow";
import Box from "@mui/material/Box";

export const SingleRoom = (props) => {

    const {roomId} = useParams();
    const socket = props.socket;

    useEffect(() => {
        if(!socket) return;
        socket.emit("join-room", {roomId: roomId})
    }, [socket])
    return (
        <>
            <Box sx={{ height: '90vh', position: 'relative',  backgroundColor: '#d8315b', display: 'flex',alignItems: 'center' }} >
            <ChatWindow socket={props.socket} userId={props.userId}/>
            </Box>
        </>

    )
}