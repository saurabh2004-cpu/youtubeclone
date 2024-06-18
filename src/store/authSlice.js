import { createSlice } from "@reduxjs/toolkit";

// Helper functions to manage local storage
const loadStateFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('authState');
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
        localStorage.setItem('authState', serializedState);
    } catch (e) {
        console.warn("Could not save state to localStorage", e);
    }
};

const initialState = loadStateFromLocalStorage() || {
    status: false,
    userData: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload;
            saveStateToLocalStorage(state);
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            localStorage.removeItem('authState'); // Clear local storage on logout
        }
    }
})

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
