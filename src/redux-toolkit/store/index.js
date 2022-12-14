import { configureStore } from '@reduxjs/toolkit';
import { roomSlice } from '../features/room/room-slice.js';

export const store = configureStore({
    reducer: {
        room: roomSlice.reducer,
    },
});
