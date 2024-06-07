import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    channelData: null,
};

const channelSlice = createSlice({
    name: "channel",
    initialState,
    reducers: {
        setChannel: (state, action) => {
            state.channelData = action.payload;
        },
        clearChannel: (state) => {
            state.channelData = null;
        },
    },
});

export const { setChannel, clearChannel } = channelSlice.actions;
export default channelSlice.reducer;
