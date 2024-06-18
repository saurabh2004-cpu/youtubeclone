import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './store/store.js';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from "./components/Login.jsx"
import {
  Register,
  Home, 
  ChannelProfile,
  UploadVideo,
  GetVideo,
  ManageVideo,
  EditVideo,
  // PostTweet,
  GetTweet,
  UpdatePlaylist,
  GetChannel,
  LikedVideo,
  WatchHistory,
  WatchLater

} from './components/index.js';

import CreatePlayList from './components/playList/CreatePlayList.jsx';  //temp    
import GetPlayList from './components/playList/GetPlayList.jsx';        //temp  
import GetAllPlaylists from './components/playList/GetAllPlaylists.jsx';






const router = createBrowserRouter([
  {
    
    children: [
      {
        path: "/register",
        element: <Register />
      },{
        path:"/login",
        element:<Login/>
      },
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/channel-profile",
        element:<ChannelProfile/>
      },
     
      {
        path:"/upload-video",
        element:<UploadVideo/>
      },
      {
        path:"/getVideo/:videoId",
        element:<GetVideo />
      },
      {
        path:"/manageVideo",
        element:<ManageVideo />
      },
      {
        path:"/editVideo/:videoId",
        element:<EditVideo />
      }
      ,
      {
        path:"/get-tweets/:channelId",   //temp
        element:<GetTweet />
      }
      ,
      {
        path:"/create-playlist",   //temp
        element:<CreatePlayList />
      }
      ,
      {
        path:"/get-playlist/:playlistId",   
        element:<GetPlayList />
      }
      ,
      {
        path:"/get-all-playlists/:channelId",  
        element:<GetAllPlaylists/>
      }
      ,
      {
        path:"/update-playlist/:channelId",   
        element:<UpdatePlaylist/>
      }
      ,
      {
        path:"/get-channel/:channelId",   
        element:<GetChannel/>
      }
      ,
      {
        path:"/liked-videos",   
        element:<LikedVideo/>
      }
      ,
      {
        path:"/watch-history",   
        element:<WatchHistory/>
      }
      
      ,
      {
        path:"/watch-later",   
        element:<WatchLater/>
      }
      
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
