import React, { useEffect, useState } from 'react';
import { GetChannelVideos, GetAllPlaylists, GetTweet, Subscriptions } from "./index.js";
import { useSelector } from 'react-redux';

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showVideoTab, setShowVideoTab] = useState(true);
  const user = useSelector(state => state.auth.userData);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    setShowVideoTab(false);
  }, []);

  return (
    <div className="w-full">
      <nav className="flex flex-wrap bg-black p-4 justify-center">
        <ul className="flex flex-wrap space-x-2 sm:space-x-4 list-none p-0 m-0 justify-center sm:flex-nowrap">
          <li
            className={`px-2 sm:px-3 py-2 text-white cursor-pointer ${
              activeTab === 'home' ? 'border-b-2 border-white' : ''
            }`}
            onClick={() => handleTabChange('home')}
          >
            Home
          </li>
          <li
            className={`px-2 sm:px-3 py-2 text-white cursor-pointer ${
              activeTab === 'videos' ? 'border-b-2 border-white' : ''
            }`}
            onClick={() => handleTabChange('videos')}
          >
            Videos
          </li>
          <li
            className={`px-2 sm:px-3 py-2 text-white cursor-pointer ${
              activeTab === 'shorts' ? 'border-b-2 border-white' : ''
            }`}
            onClick={() => handleTabChange('shorts')}
          >
            Shorts
          </li>
          {/* <li
            className={`px-2 sm:px-3 py-2 text-white cursor-pointer ${
              activeTab === 'live' ? 'border-b-2 border-white' : ''
            }`}
            onClick={() => handleTabChange('live')}
          >
            Live
          </li> */}
          <li
            className={`px-2 sm:px-3 py-2 text-white cursor-pointer ${
              activeTab === 'playlists' ? 'border-b-2 border-white' : ''
            }`}
            onClick={() => handleTabChange('playlists')}
          >
            Playlists
          </li>
          <li
            className={`px-2 sm:px-3 py-2 text-white cursor-pointer ${
              activeTab === 'community' ? 'border-b-2 border-white' : ''
            }`}
            onClick={() => handleTabChange('community')}
          >
            Community
          </li>
        </ul>
      </nav>
      <div className="p-4">
        {activeTab === 'home' && <Subscriptions />}
        {activeTab === 'videos' && <GetChannelVideos ShowDots={showVideoTab} channelId={user._id} />}
        {activeTab === 'shorts' && <Shorts />}
        {/* {activeTab === 'live' && <Live />} */}
        {activeTab === 'playlists' && <GetAllPlaylists channelId={user._id} />}
        {activeTab === 'community' && <GetTweet channelId={user._id} />}
      </div>
    </div>
  );
};

export default ProfileTabs;
