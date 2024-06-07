import { createSlice } from "@reduxjs/toolkit";

const initialState={
    videosData: null
}

const videosSlice=createSlice({
    name:'videos',
    initialState,
    reducers:{
        setVideos:(state,action)=>{
            state.videosData=action.payload
        },
        clearVideos:(state)=>{
            state.videosData = null;
        }
    }

})

export const {setVideos,clearVideos}=videosSlice.actions

export default videosSlice.reducer