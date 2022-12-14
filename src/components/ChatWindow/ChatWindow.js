import React, {useEffect, useRef, useState} from "react";

import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import OutlinedInput from '@mui/material/OutlinedInput';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Divider from '@mui/material/Divider';
import {useParams, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

export const ChatWindow = (props) => {

    const socket = props.socket;
    // const { socket } = useSelector((store) => store.room);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [typing, setTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const {roomId} = useParams();
    const navigate = useNavigate();
    const fileRef = useRef();

    useEffect(() => {
        setChat([]);
        if (!socket) return;
        console.log(roomId);
        socket.on("message-from-server", (data) => {
            setChat(prev => [...prev, {message:data.message, received: true}])
        })
        socket.on("uploaded", (data) => {
            console.log(data);
            setChat(prev => [...prev, {message:data.buffer, received: true, type:"image"}])
        })
        socket.on("start-typing-from-server", () => {
            setTyping(true);
        })
        socket.on("stop-typing-from-server", () => {
            setTyping(false);
        })

    }, [socket, roomId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit("send-message", {message, roomId});
        setChat(prev => [...prev, {message:message, received: false}])
        setMessage("")
    }

    const handleInput = (e) => {
        e.preventDefault();
        setMessage(e.target.value);
        socket.emit("start-typing", {roomId});
        if(typingTimeout) clearTimeout(typingTimeout);
        setTypingTimeout(
            setTimeout(() => {
                socket.emit("stop-typing", {roomId})
            }, 1000)
        )
    }

    const handleRemoveRoom = async () => {
        socket.emit("room-removed", {roomId});
        navigate("/");
    }

    const handleSelectFile = () => {
        fileRef.current.click();
    }

    const handleFileSelected = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const data = reader.result;
            socket.emit("upload", {data, roomId});
            setChat(prev => [...prev, {message:reader.result, received: false, type:"image"}])
        }
    }

    return (
        <Card sx={{padding: 3, width: "60vw", height: '75vh',  margin: "0 auto", color:"white", backgroundColor:"#ffcc00", position: "relative"}}>
            <Box sx={{display:"flex", justifyContent:"space-between"}}>
                {roomId ? <h4 style={{textShadow: "1px 1px black"}}>Room: {roomId}</h4> : null}
                {roomId ?
                    <Tooltip title="Delete">
                        <IconButton variant="text" onClick={handleRemoveRoom} style={{color:"white"}}>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                    : null}
            </Box>
            <Divider/>
            <Container sx={{height: "55vh", overflowY: "auto", margin: "20px 0"}}>
                <Box style={{margin: "30px 0"}}>
                    {chat.map(data => (
                        data.type === "image"
                            ?
                            (data.received
                            ? <img key={data.message} src={data.message} alt="sent photo" width={250} sx={{display:"block", margin: "10px", marginLeft:"25px"}} />
                            : <img key={data.message} src={data.message} alt="sent photo" width={250} sx={{display:"block", margin: "10px"}} />)
                            : (
                                data.received
                                    ? <Typography sx={{ backgroundColor: "#0A2463", borderRadius: "4px", margin: "10px", marginLeft:"25px", padding:"10px 15px", width: "80%"}} key={data.message}>{data.message}</Typography>
                                    : <Typography sx={{ margin: "10px", padding:"10px 15px", backgroundColor: "#3E92CC", borderRadius: "4px", width: "80%"}} key={data.message}>{data.message}</Typography>
                            )

                    ))}
                </Box>

            </Container>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                autoComplete="off"

            >
                {typing ? <InputLabel sx={{color: "white"}} shrink htmlFor="message-input">
                    typing...
                </InputLabel> : null}
                <OutlinedInput
                    sx={{ width: "90%", bottom: "10px", left:"calc(50% - 45%)", backgroundColor:"white", padding:"5px 15px"}}
                    fullWidth
                    id="message-input"
                    type= "text"
                    placeholder="Write a message"
                    value={message}
                    onChange={handleInput}
                    endAdornment={
                        <InputAdornment position="end">

                            <input onChange={handleFileSelected} ref={fileRef} type="file" style={{display:"none"}}/>
                            <Tooltip title="Attach file">
                                <IconButton sx={{marginRight:"2px", padding:"10px"}} edge="end" onClick={handleSelectFile}>
                                    <AttachFileIcon/>
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Send">
                                <IconButton sx={{padding:"10px"}} type="submit" edge="end">
                                    <SendIcon/>
                                </IconButton>
                            </Tooltip>


                        </InputAdornment>
                    }
                />

            </Box>
        </Card>
    )
}