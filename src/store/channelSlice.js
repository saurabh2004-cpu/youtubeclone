import { createSlice } from "@reduxjs/toolkit";

const loadStateFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('channelState');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (e) {
        console.warn("Could not load state from localStorage", e);
        return undefined;
    }
};

const saveStateToLocalStorage = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('channelState', serializedState);
    } catch (e) {
        console.warn("Could not save state to localStorage", e);
    }
};

const initialState = loadStateFromLocalStorage() || {
    channelData: null,
};

const channelSlice = createSlice({
    name: "channel",
    initialState,
    reducers: {
        setChannel: (state, action) => {
            state.channelData = action.payload;
            saveStateToLocalStorage(state);
        },
        clearChannel: (state) => {
            state.channelData = null;
            localStorage.removeItem('channelState');
        },
    },
});

export const { setChannel, clearChannel } = channelSlice.actions;
export default channelSlice.reducer;
