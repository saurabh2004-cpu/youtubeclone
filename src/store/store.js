import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice';
import channelSlice from './channelSlice';
import videosSlice from './videosSlice';

const store = configureStore({
    reducer: {
        auth : authSlice,
        channel:channelSlice,
        videos:videosSlice
    }
});




export default store;