import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from '../index.js';
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical } from 'react-icons/fi';
import axiosInstance from '../../axiosInstance.js';

const WatchHistory = () => {
  const [history, setHistory] = useState([]);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [showOptions, setShowOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchHistory = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/users/watch-history');
        setHistory(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching watch history:', error);
        setLoading(false);
      }
    };

    fetchWatchHistory();
  }, []);

  const handleCardClick = (videoId) => {
    navigate(`/getVideo/${videoId}`);
  };

  const handleRemoveVideoClick = async (videoId) => {
    await axiosInstance.post(`/api/v1/users/remove-from-history/${videoId}`);
    setHistory(history.filter(video => video._id !== videoId));
    alert("Video removed");
  };

  const calculateDaysAgo = (createdAt) => {
    const currentDate = new Date();
    const createdDate = new Date(createdAt);
    const differenceInTime = currentDate - createdDate;
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return `${differenceInDays} days ago`;
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!history.length) {
    return <div className="text-white">No watch history found</div>;
  }

  return (
    <>
      <Header showCatagories={false} />
      <div className="container mx-auto p-4 bg-gray-900 text-white flex">
        {/* Left side - Thumbnail of the first video */}
        <div className="w-1/3 p-4 flex flex-col items-center sticky top-0">
          {history.length > 0 && (
            <div className="w-full bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg flex flex-col items-center justify-center mb-4 md:mb-0">
              <img
                src={history[0].thumbnail}
                alt="Watch history"
                className="w-full h-50 object-cover rounded-lg mb-4"
              />
              <h2 className="text-2xl font-bold">Watch history</h2>
              <p className="text-gray-400 mb-4">saurabh bodakhe</p>
              <p className="text-gray-400 mb-4">{history.length} videos</p>
            </div>
          )}
        </div>

        {/* Right side - List of watch history videos */}
        <div className="w-1/2 p-4 overflow-y-auto h-screen hide-scrollbar">
          {history.map((video, index) => (
            <div
              key={index}
              className="relative flex items-center mb-4"
              onMouseEnter={() => setHoveredVideo(index)}
              onMouseLeave={() => {
                setHoveredVideo(null);
                setShowOptions(null);
              }}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-40 h-24 object-cover rounded-lg mr-4"
              />
              <div>
                <h3 className="text-lg font-bold">{video.title}</h3>
                <p className="text-gray-400">{video.channelName} • {video.views} views • {calculateDaysAgo(video.createdAt)}</p>
              </div>
              {hoveredVideo === index && (
                <div className="absolute right-0 top-0">
                  <button
                    className="text-white"
                    onClick={() => setShowOptions(index)}
                  >
                    <FiMoreVertical />
                  </button>
                  {showOptions === index && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-10">
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                        onClick={() => handleRemoveVideoClick(video._id)}
                      >
                        Remove from history
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default WatchHistory;
