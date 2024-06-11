import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import GetVideosByCategories from './GetVideosByCategories';
import { setVideos } from '../../store/videosSlice';
import { useRef } from 'react';

const AllUsersVideos = ({ isSidebarOpen }) => {
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const render=useRef()
  const currentUser=useSelector(state=>state.auth.userData)

  const apiUrl = import.meta.env.VITE_API_URL;
 
  
  useEffect(() => {


    const fetchAllVideos = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/video/all-users-videos`);
        const shuffledVideos = response.data.data.filter(video => video.isPublished === true).sort(() => 0.5 - Math.random());
        dispatch(setVideos(shuffledVideos));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setLoading(false);
      }
    };
    fetchAllVideos();

    
  }, [dispatch,]);

  const allVideos = useSelector(state => state.videos.videosData);

  

  //getvideo
  const handleGetVideo = (videoId) => {
    navigate(`${apiUrl}/getVideo/${videoId}`);
  };

  //togglemenu
  const toggleMenu = (videoId) => {
    setMenuVisible(prevState => ({
      ...prevState,
      [videoId]: !prevState[videoId],
    }));
  };

  //save to watchlater 
  const handleSaveToWatchLater = async (videoId) => {
    if(!currentUser){
      navigate('/register')
    }

    const response = await axios.post(`${apiUrl}/api/v1/users/add-to-watch-later/${videoId}`);
    console.log(response);
  };

  //playnext -not working yet
  const handlePlayNext = async (videoId) => {
    if(!currentUser){
      navigate('/register')
    }

    const response = await axios.post(`${apiUrl}/api/v1/users/add-to-play-next/${videoId}`);
    console.log("playnext video", response);
  };

  //video published at
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

  //close menu 
  const handleMouseLeave = (videoId) => {
    setMenuVisible(prevState => ({
      ...prevState,
      [videoId]: false,
    }));
  };

  if (loading) {
    return <div className='text-white'>Loading...</div>;
  }

  // if (!allVideos.length) {
  //   return <div>No videos found</div>;
  // }

  return (
    <div className={`container mx-auto p-4 grid gap-6 ${isSidebarOpen ? 'grid-cols-3' : 'grid-cols-4'}`}>
      {allVideos?.map(video => (
        <div key={video._id} className="relative cursor-pointer group" onMouseLeave={() => handleMouseLeave(video._id)}>
          {video.isPublished && (
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-60 object-cover"
                onClick={() => handleGetVideo(video._id)}
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                <p className="text-white">{Math.floor(video.duration / 60)}:{video.duration % 60 < 10 ? '0' : ''}{video.duration % 60} min</p>
              </div>
            </div>
          )}
          <div className="px-2 py-4" onClick={() => handleGetVideo(video._id)}>
            {video.isPublished && (
              <>
              <div className="font-bold text-lg mb-2 text-left text-white" style={{ maxWidth: '100%' }}>{video.title}</div>
              <div className="text-gray-400" style={{ position: 'absolute', bottom: '84px', width: 'calc(100% - 48px)' }}>
                {video.views} views • {calculateTimeAgo(video.createdAt)}
              </div>
              
              <div className="flex items-center mt-14" >
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
            <div className="absolute bottom-20 right-4">
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
                  <div className="absolute bottom-0 right-5 w-48 mt-2 py-2 bg-white border rounded shadow-xl">
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
