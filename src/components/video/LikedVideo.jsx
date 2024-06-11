import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../index.js';
import { FiMoreVertical } from 'react-icons/fi'; 
import axiosInstance from '../../axiosInstance.js';

function LikedVideo() {
  const [likedVideos, setLikedVideos] = useState([]);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [showOptions, setShowOptions] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/like/get-liked-video');
        setLikedVideos(response.data.data);
        console.log(":resssssss",response)
      } catch (error) {
        console.error('Error fetching liked videos:', error);
      }
    };

    fetchLikedVideos();
  }, []);

  const handlePlayClick = (videoId) => {
    navigate(`/getVideo/${videoId}`);
  };

  const handleShuffleClick = () => {
    const shuffledVideos = likedVideos
      .map((video) => ({ video, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ video }) => video);
    setLikedVideos(shuffledVideos);
  };

  const handleRemoveVideoClick = async (videoId) => {
    await axiosInstance.post(`/api/v1/like/remove-from-liked-video/${videoId}`);
    setLikedVideos(likedVideos.filter(video => video._id !== videoId));
    alert("Video removed");
  };

  const calculateDaysAgo = (createdAt) => {
    const currentDate = new Date();
    const createdDate = new Date(createdAt);
    const differenceInTime = currentDate - createdDate;
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return `${differenceInDays} days ago`;
  };

  return (
    <> <Header showCatagories={false}/>
      <div className="container mx-auto p-4 bg-gray-900 text-white flex">
        {/* Left side - Thumbnail of the first video */}
        <div className="w-1/3 p-4 flex flex-col items-center sticky top-0">
          {likedVideos.length > 0 && (
            <div className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-blue-800 p-4 rounded-lg flex flex-col items-center justify-center mb-4">
              <img
                src={likedVideos[0].thumbnail}
                alt="Liked videos"
                className="w-full h-50 object-cover rounded-lg mb-4"
              />
              <h2 className="text-2xl font-bold">Liked videos</h2>
              <p className="text-gray-400 mb-4">{likedVideos.length} videos</p>
              <div className="flex space-x-4">
                <button className="bg-white text-black py-2 px-4 rounded-lg" onClick={() => handlePlayClick(likedVideos[0]._id)}>Play all</button>
                <button className="bg-gray-700 text-white py-2 px-4 rounded-lg" onClick={handleShuffleClick}>Shuffle</button>
              </div>
            </div>
          )}
        </div>

        {/* Right side - List of liked videos */}
        <div className="w-1/2 p-4 overflow-y-auto h-screen hide-scrollbar">
          {likedVideos.map((video, index) => (
            <div key={index} className="relative flex items-center mb-4"
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
                <p className="text-gray-400">{video.channelName} • {video.views} views •  {calculateDaysAgo(video.createdAt)}</p>
              </div>
              {hoveredVideo === index && (
                <div className="absolute right-0 top-0">
                  <button
                    className="text-white"
                    onClick={() => setShowOptions(index)}
                  >
                   <FiMoreVertical/>
                  </button>
                  {showOptions === index && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-10">
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                        onClick={() => handleRemoveVideoClick(video._id)}
                      >
                        Remove from liked videos
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
}

export default LikedVideo;
