import React, {useState} from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {useNavigate} from "react-router-dom";
import "./HomeContent.css";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import {v4 as uuid} from "uuid";

export const HomeContent = (props) => {

    const [roomName, setRoomName] = useState("");

    const navigate = useNavigate();
    const {userId, socket} = props;

    const handleInput = (e) => {
        e.preventDefault();
        setRoomName(e.target.value);
    }

    const addRoom = () => {
        const roomId = uuid();
        navigate(`/room/${roomId}`);
        socket.emit('new-room-created', {roomId, userId, roomName});
    }

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '90vh',  backgroundColor: '#d8315b'  }} >
            <Paper elevation={15} sx={{ display: "flex", alignSelf: 'flex-start', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', marginTop: '20px', marginLeft: '30px', borderRadius:"50%", width: '30vw', height: '30vw', padding: '15px', backgroundColor: '#D8315B', opacity: '.8'}}>
                <h2 style={{color: '#FFFAFF', textAlign: 'center', margin: '0 auto'}}>Start chatting with us!</h2>
                {userId ?
                    <Box
                        component="form"
                        onSubmit={addRoom}
                        noValidate
                        autoComplete="off"
                    >
                        <OutlinedInput
                            sx={{backgroundColor:"white", margin:"0px"}}
                            id="message-input"
                            type= "text"
                            placeholder="Room name.."
                            value={roomName}
                            onChange={handleInput}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Tooltip title="Add new room">
                                        <IconButton type="submit" edge="end">
                                            <AddIcon/>
                                        </IconButton>
                                    </Tooltip>

                                </InputAdornment>
                            }
                        />
                    </Box> : <p style={{color: '#FFFAFF', textAlign: 'center', margin: '0 auto'}}>Log in to create your own room!</p>}
            </Paper>
            <img src="/chat-img.svg" alt="chat" style={{ width: '50%', height: '80%', alignSelf: 'flex-end', marginBottom: '20px'}}/>
            </Box>

        </>

    )
}