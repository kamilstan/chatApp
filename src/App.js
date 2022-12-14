import React, {createContext, useEffect, useState} from "react";
import {Route, Routes, Navigate} from "react-router-dom";

import {HomePage} from "./pages/HomePage/HomePage";
import {RoomPage} from "./pages/RoomPage/RoomPage";
import {io} from "socket.io-client";
import Cookies from "js-cookies";
import {useDispatch, useSelector} from "react-redux";
import {setSocket} from "./redux-toolkit/features/room/room-slice";


export const App = () => {

    // const dispatch = useDispatch();

    const [socket, setSocket] = useState(null);
    const [userId, setUserId] = useState(null);


    useEffect(() => {
        setSocket(io("http://localhost:8080"));
        const cookieUserId = Cookies.getItem("userId");
        if(cookieUserId) setUserId(cookieUserId);
    }, []);

    // useEffect(() => {
    //     dispatch(setSocket(io("http://localhost:8080")));
    //     const cookieUserId = Cookies.getItem("userId");
    //     if(cookieUserId) setUserId(cookieUserId);
    // }, []);

    // const { socket } = useSelector((store) => store.room);

  return (

      <Routes>
          <Route
              path="/"
              element={<Navigate to ="/home"/>}
          />

          <Route
              path="home"
              element={<HomePage socket={socket} userId={userId} setUserId={setUserId}/>}
          />
          <Route
              path="room/:roomId"
              element={<RoomPage socket={socket} userId={userId} setUserId={setUserId}/>}
          />
      </Routes>

  )
}
export const SocketContext = createContext(null);

