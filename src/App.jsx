import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Register,
  Home,
  ChannelProfile,
  UploadVideo,
  GetVideo,
  ManageVideo,
  EditVideo,
  GetTweet,
  UpdatePlaylist,
  GetChannel,
  LikedVideo,
  WatchHistory,
  WatchLater,
  CreatePlayList,
  GetPlayList,
  GetAllPlaylists,
} from './components/index.js';
import Login from './components/Login.jsx';
import { useSelector } from 'react-redux';

const user=useSelector(state=>state.auth.userData)

function App() {
  return (
    <Routes>
      {!user && <Route path="/register" element={<Register />} />}
     {!user && <Route path="/login" element={<Login />} />}
      <Route path="/" element={<Home />} />
      <Route path="/channel-profile" element={<ChannelProfile />} />
      <Route path="/upload-video" element={<UploadVideo />} />
      <Route path="/getVideo/:videoId" element={<GetVideo />} />
      <Route path="/manageVideo" element={<ManageVideo />} />
      <Route path="/editVideo/:videoId" element={<EditVideo />} />
      <Route path="/get-tweets/:channelId" element={<GetTweet />} />
      <Route path="/create-playlist" element={<CreatePlayList />} />
      <Route path="/get-playlist/:playlistId" element={<GetPlayList />} />
      <Route path="/get-all-playlists/:channelId" element={<GetAllPlaylists />} />
      <Route path="/update-playlist/:channelId" element={<UpdatePlaylist />} />
      <Route path="/get-channel/:channelId" element={<GetChannel />} />
      <Route path="/liked-videos" element={<LikedVideo />} />
      <Route path="/watch-history" element={<WatchHistory />} />
      <Route path="/watch-later" element={<WatchLater />} />
    </Routes>
  );
}

export default App;
