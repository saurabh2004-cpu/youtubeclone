import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../axiosInstance.js';

const SidebarVideos = ({videos}) => {
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState({});
  const currentUser=useSelector(state=>state.auth.userData)

  const isVideoOwnerIsCurrentUser=videos[0].owner===currentUser?._id?true:false
  // console.log(isVideoOwnerIsCurrentUser)

  const navigate = useNavigate();



  // console.log("videos",videos)

  const handleGetVideo = (videoId) => {
    navigate(`/getVideo/${videoId}`);
  };

  const toggleMenu = (videoId) => {
    setMenuVisible(prevState => ({
      ...prevState,
      [videoId]: !prevState[videoId],
    }));
  };

  const handleSaveToWatchLater = async (videoId) => {
    if(currentUser){
      const response = await axiosInstance.post(`/users/add-to-watch-later/${videoId}`);
    console.log(response);
    }
    navigate('/register')
  };

  const handlePlayNext = async (videoId) => {
    if(!currentUser){
      navigate('/register')
    }
  };

  const calculateTimeAgo = (createdAt) => {
    const currentDate = new Date();
    const createdDate = new Date(createdAt);
    const differenceInTime = currentDate - createdDate;
    const differenceInHours = Math.floor(differenceInTime / (1000 * 3600));

    if (differenceInHours < 24) {
      return `${differenceInHours} hours ago`;
    }

    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return `${differenceInDays} days ago`;
  };

  const handleMouseLeave = (videoId) => {
    setMenuVisible(prevState => ({
      ...prevState,
      [videoId]: false,
    }));
  };


  const handleRemoveClick = (video) => {
    setVideoToRemove(video);
    setShowConfirmDelete(true);
};



  if (loading) {
    return <div>Loading...</div>;
  }

  if (!videos) {
    setLoading(true)
    return <div>No videos found</div>;
  }

  return (
    <div className="right-40 top-20 w-83 h-screen bg-gray-900 text-white p-4 overflow-y-auto hide-scrollbar">
      <div className="flex flex-col space-y-4 w-full">
        {videos.map(video => (
          <div key={video._id} className="relative cursor-pointer group" onMouseLeave={() => handleMouseLeave(video._id)}>
            <div className="flex items-start bg-black p-4 rounded-lg hover:bg-gray-800 transition duration-200 w-full" onClick={() => handleGetVideo(video._id)}>
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-32 h-20 rounded-lg object-cover"
              />
              <div className="ml-4 w-full">
                <div className="text-sm mb-2 text-left text-white w-full">
                  {video.title}
                </div>
                <div className="text-gray-400 text-xs">
                  {video.views} views • {calculateTimeAgo(video.createdAt)}
                </div>
                <div className="text-sm mt-2 flex position-fixed">
                  <p className="text-gray-300 leading-none">
                    {video.owner?.username}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-2 right-4">
              <div className="relative">
                <button
                  className="hidden group-hover:block text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu(video._id);
                  }}
                >
                  &#x22EE;
                </button>
                {!isVideoOwnerIsCurrentUser &&  menuVisible[video._id] && (
                  <div className="absolute bottom-0 right-5 w-48 mt-2 py-2 bg-white border rounded shadow-xl">
                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left" onClick={() => handlePlayNext(video._id)}>Play next</button>
                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left" onClick={() => handleSaveToWatchLater(video._id)}>Save to Watch Later</button>
                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">Save to Playlist</button>
                  </div>
                )}
                {isVideoOwnerIsCurrentUser &&  menuVisible[video._id] && (
                  <div className="absolute bottom-0 right-5 w-48 mt-2 py-2 bg-white border rounded shadow-xl">
                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left" onClick={() => handleRemoveClick(video._id)}>Remove</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarVideos;
