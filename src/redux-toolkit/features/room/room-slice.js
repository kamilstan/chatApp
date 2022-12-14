import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    socket: null,
    roomName: "",
};

export const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
        setRoomName: (state, action) => {
            state.roomName = action.payload;
        },

    },
});
export const {
    setSocket,
    setRoomName,
} = roomSlice.actions;