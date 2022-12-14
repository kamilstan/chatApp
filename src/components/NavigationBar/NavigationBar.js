import React, {useEffect, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {Link, useNavigate} from "react-router-dom";
import { v4 as uuid } from 'uuid';
import Cookies from "js-cookies";
import InputAdornment from "@mui/material/InputAdornment";
import AddIcon from '@mui/icons-material/Add';
import OutlinedInput from "@mui/material/OutlinedInput";

export const NavigationBar = (props) => {

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [roomName, setRoomName] = useState("");

    const navigate = useNavigate();
    const socket = props.socket;
    // const { socket } = useSelector((store) => store.room);
    console.log("socket", socket)
    const userId = props.userId;

    const addRoom = () => {
        const roomId = uuid();
        navigate(`/room/${roomId}`);
        socket.emit('new-room-created', {roomId, userId, roomName});
    }

    useEffect(() => {
        (async () => {
            const res = await fetch(`http://localhost:8080/rooms`);
            const data = await res.json();
            setRooms(prev =>[...data.rooms])
        })();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("new-room-created", ({room}) => {
            setRooms(prev =>[...prev, room])
        })
        socket.on("room-removed", ({roomId}) => {
            console.log(roomId);
            setRooms(rooms.filter(room => room.roomId !== roomId));
        })

    }, [socket]);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleInput = (e) => {
        e.preventDefault();
        setRoomName(e.target.value);
    }


    const handleLogin = () => {
        const newUserId = uuid();
        props.setUserId(newUserId);
        Cookies.setItem("userId", newUserId);
        navigate('/');
    }
    const handleLogout = () => {
        props.setUserId(null);
        Cookies.removeItem("userId");
        navigate('/');

    }

    return (
        <AppBar position="static" sx={{backgroundColor:"#1E1B18", height: "10vh"}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <Link style={{color:"white", textDecoration: "none"}} to="/">
                            MyChatApp
                        </Link>
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >

                            <MenuItem onClick={handleCloseNavMenu}>
                                <Link
                                    style={{color:"black", textTransform: "uppercase", textDecoration: "none"}}
                                    to="/home">
                                    <Typography sx={{textAlign:"center"}} >Home</Typography>
                                </Link>
                            </MenuItem>
                            {rooms.map(room => {
                               return  (<MenuItem key={room.roomId} onClick={handleCloseNavMenu}>
                                    <Link
                                        style={{color:"black", textTransform: "uppercase", textDecoration: "none"}}
                                        to={`/room/${room.roomId}`}>
                                        <Typography sx={{textAlign:"center"}} >{room.name}</Typography>
                                    </Link>
                                </MenuItem>)
                            })}
                            {props.userId &&
                            <MenuItem >
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
                                </Box>

                             </MenuItem>}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="div"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <Link style={{color:"white", textDecoration: "none"}} to="/">
                            MyChatApp
                        </Link>
                    </Typography>

                    {/*Big screen*/}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

                        <MenuItem onClick={handleCloseNavMenu}>
                            <Link
                                style={{color: "white", textDecoration: "none", marginRight: "10px", textTransform: "uppercase"}}
                                to="/home">
                                <Typography sx={{textAlign:"center"}} >Home</Typography>
                            </Link>
                        </MenuItem>
                        {rooms.map(room => {

                            return  (
                                <MenuItem key={room.roomId} onClick={handleCloseNavMenu}>
                                <Link
                                    style={{color: "white", textDecoration: "none", marginRight: "10px", textTransform: "uppercase"}}
                                    to={`/room/${room.roomId}`}>
                                    <Typography sx={{textAlign:"center"}} >{room.name}</Typography>
                                </Link>
                            </MenuItem>)
                        })}
                        {props.userId &&
                        <MenuItem onClick={handleCloseNavMenu}>
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
                            </Box>

                        </MenuItem>
                        }
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar/>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {props.userId ===null &&
                            <MenuItem style={{padding: "0px", paddingTop: "0", paddingBottom: "0", margin: "0",}}  onClick={handleCloseUserMenu}>
                                <Button onClick={handleLogin} style={{width:"100%", height:"100%", color:"black", padding:"5px 25px"}} >Login</Button>
                            </MenuItem>}
                            {props.userId &&
                            <MenuItem onClick={handleCloseUserMenu}>
                                        <Button style={{color:"black", padding:"0px"}} >Profile</Button>
                            </MenuItem>

                            }
                            {props.userId &&
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Button onClick={handleLogout} style={{color:"black", padding:"0px"}} >Logout</Button>
                            </MenuItem>
                            }

                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
