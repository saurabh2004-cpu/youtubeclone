import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  GetChannelVideos,
  GetAllPlaylists,
  GetTweet,
  ChannelHome
  // Subscriptions
} from "../index.js";

const ChannelTabs = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showVideoTab, setShowVideoTab] = useState(true);
  const channel = useSelector(state => state.channel.channelData);

  useEffect(() => {
    setShowVideoTab(false);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full">
      <nav className="flex bg-black p-4 space-x-4 justify-center">
        <ul className="flex space-x-4 list-none p-0 m-0">
          <li
            className={`px-3 py-2 text-gray-300 hover:bg-gray-700 rounded cursor-pointer ${
              activeTab === 'home' ? 'bg-gray-700' : ''
            }`}
            onClick={() => handleTabChange('home')}
          >
            Home
          </li>
          <li
            className={`px-3 py-2 text-gray-300 hover:bg-gray-700 rounded cursor-pointer ${
              activeTab === 'videos' ? 'bg-gray-700' : ''
            }`}
            onClick={() => handleTabChange('videos')}
          >
            Videos
          </li>
          <li
            className={`px-3 py-2 text-gray-300 hover:bg-gray-700 rounded cursor-pointer ${
              activeTab === 'shorts' ? 'bg-gray-700' : ''
            }`}
            onClick={() => handleTabChange('shorts')}
          >
            Shorts
          </li>
          <li
            className={`px-3 py-2 text-gray-300 hover:bg-gray-700 rounded cursor-pointer ${
              activeTab === 'live' ? 'bg-gray-700' : ''
            }`}
            onClick={() => handleTabChange('live')}
          >
            Live
          </li>
          <li
            className={`px-3 py-2 text-gray-300 hover:bg-gray-700 rounded cursor-pointer ${
              activeTab === 'playlists' ? 'bg-gray-700' : ''
            }`}
            onClick={() => handleTabChange('playlists')}
          >
            Playlists
          </li>
          <li
            className={`px-3 py-2 text-gray-300 hover:bg-gray-700 rounded cursor-pointer ${
              activeTab === 'community' ? 'bg-gray-700' : ''
            }`}
            onClick={() => handleTabChange('community')}
          >
            Community
          </li>
        </ul>
      </nav>
      <div className="p-4 bg-black">
        {activeTab === 'home' && <ChannelHome />}
        {activeTab === 'videos' && <GetChannelVideos ShowDots={showVideoTab} />}
        {activeTab === 'shorts' && <Shorts />}
        {activeTab === 'live' && <Live />}
        {activeTab === 'playlists' && <GetAllPlaylists />}
        {activeTab === 'community' && <GetTweet />}
      </div>
    </div>
  );
};

export default ChannelTabs;
