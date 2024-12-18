import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import GetVideosByCategories from './GetVideosByCategories';
import { setVideos } from '../../store/videosSlice';
import { useRef } from 'react';
import axiosInstance from '../../axiosInstance';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css'; 
import { Loader } from '../index.js';

const AllUsersVideos = ({ isSidebarOpen }) => {
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.userData);

  useEffect(() => {
    const fetchAllVideos = async () => {
      nprogress.start(); 
      try {
        const response = await axiosInstance.get(`/video/all-users-videos`);
        console.log("response",response.data)
        const shuffledVideos = response.data.data.filter(video => video.isPublished === true).sort(() => 0.5 - Math.random());
        dispatch(setVideos(shuffledVideos));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setLoading(false);
      } finally {
        nprogress.done(); 
      }
    };
    fetchAllVideos();
  }, [dispatch]);

  const allVideos = useSelector(state => state.videos.videosData);

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
    if (!currentUser) {
      navigate('/register');
      return;
    }

    try {
      const response = await axiosInstance.post(`/users/add-to-watch-later/${videoId}`);
      console.log(response);
    } catch (error) {
      console.error('Error saving to watch later:', error);
    }
  };

  const handlePlayNext = async (videoId) => {
    if (!currentUser) {
      navigate('/register');
      return;
    }

    try {
      const response = await axiosInstance.post(`/users/add-to-play-next/${videoId}`);
      console.log("Play next video:", response);
    } catch (error) {
      console.error('Error adding to play next:', error);
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

  if (loading) {
    return (
      <div className='flex justify-center'>
        <Loader style={{ width: '50px', height: '50px' }} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 grid gap-6 sm:grid-cols-1 md:grid-cols-1 md:gap-2 lg:grid-cols-3 xl:grid-cols-4">
      {allVideos?.map(video => (
        <div key={video._id} className="relative cursor-pointer group mb-6" onMouseLeave={() => handleMouseLeave(video._id)}>
          {video.isPublished && (
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-60 object-cover md:h-50 md:gap-0"
                onClick={() => handleGetVideo(video._id)}
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                <p className="text-white">{Math.floor(video.duration / 60)}:{video.duration % 60 < 10 ? '0' : ''}{video.duration % 60} min</p>
              </div>
            </div>
          )}
          <div className="px-2 py-4 min-h-[150px] flex flex-col justify-between" onClick={() => handleGetVideo(video._id)}>
            {video.isPublished && (
              <>
                <div className="font-bold text-lg mb-2 text-left text-white truncate" style={{ maxWidth: '100%' }}>
                  {video.title}
                </div>
                <div className="text-gray-400 text-sm">
                  {video.views} views • {calculateTimeAgo(video.createdAt)}
                </div>
                <div className="flex items-center mt-2">
                  <img
                    src={video.owner?.avatar}
                    alt={video.owner?.username}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div className="text-sm">
                    <p className="text-gray-300 leading-none">{video.owner?.username}</p>
                  </div>
                </div>
              </>
            )}
          </div>
          {video.isPublished && (
            <div className="absolute bottom-2 right-2">
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
                {menuVisible[video._id] && (
                  <div className="absolute bottom-0 right-0 w-36 mt-2 py-2 bg-white border rounded shadow-xl">
                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left" onClick={() => handlePlayNext(video._id)}>Play next</button>
                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left" onClick={() => handleSaveToWatchLater(video._id)}>Save to Watch Later</button>
                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">Save to Playlist</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AllUsersVideos;
