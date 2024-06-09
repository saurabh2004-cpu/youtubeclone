import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Header,ProfileTabs } from './index.js';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UpdateProfile from './UpdateProfile';
import { FaCamera } from 'react-icons/fa';



const ChannelProfile = () => {
  const user = useSelector((state) => state.auth.userData);
  const [channelProfile, setChannelProfile] = useState(null);
  const [isAvatarHover, setIsAvatarHover] = useState(false);
  const [isCoverImageHover, setIsCoverImageHover] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  const channel=useSelector(state=>state.channel.channelData)
  console.log("object",channel)

  useEffect(() => {
    setChannelProfile(channel)
  }, );

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const response = await axios.post('/api/v1/users/update-avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          setChannelProfile(prev => ({
            ...prev,
            avatar: response.data.data.avatar,
          }));
        }
      } catch (error) {
        console.error('Error updating avatar:', error);
      }
    }
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('coverImage', file);

      try {
        const response = await axios.post('/api/v1/users/update-cover-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          setChannelProfile(prev => ({
            ...prev,
            coverImage: response.data.data.coverImage,
          }));
        }
      } catch (error) {
        console.error('Error updating cover image:', error);
      }
    }
  };

  if (!user || !channelProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black ">
      <Header showCatagories={false}/>
      
      
      <div
        className="w-full h-48 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${channelProfile.coverImage})` }}
        onMouseEnter={() => setIsCoverImageHover(true)}
        onMouseLeave={() => setIsCoverImageHover(false)}
      >
        
        {isCoverImageHover && (
          <div className="absolute  bg-opacity-50 flex items-center ">
            <label className=" text-white py-2 px-4 rounded cursor-pointer">
            <FaCamera />
             
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverImageChange}
              />
            </label>
          </div>
        )}
        <div
          className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
          onMouseEnter={() => setIsAvatarHover(true)}
          onMouseLeave={() => setIsAvatarHover(false)}
        >
          <img
            src={channelProfile.avatar}
            alt={channelProfile.username}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white"
          />
          {isAvatarHover && (
            <div className="absolute">
              <label className=" text-black  py-2 px-4 rounded cursor-pointer">
              <FaCamera />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          )}
        </div>
      </div>
      <div className="container mx-auto mt-3 p-3 sm:p-5">
        <div className="bg-black text-white shadow-2xl rounded-lg p-3 sm:p-5 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-extrabold mb-2 text-white">{channelProfile.fullName}</h1>
            <p className="text-sm sm:text-md text-gray-300">@{channelProfile.username}</p>
            <p className="text-gray-600 mt-2 text-sm">Email: {channelProfile.email}</p>
            <p className="text-gray-200 mt-2 text-sm">Subscribers: {channelProfile.subscribersCount}</p>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Link
              to="/manageVideo"
              className="bg-blue-500 text-white font-semibold px-3 py-1 sm:px-4 sm:py-2 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition-transform transform hover:-translate-y-1"
            >
              Manage Videos
            </Link>
            <button
              onClick={() => setShowUpdateProfile(true)}
              className="bg-green-500 text-white font-semibold px-3 py-1 sm:px-4 sm:py-2 rounded-lg shadow-md hover:bg-green-600 hover:shadow-lg transition-transform transform hover:-translate-y-1"
            >
              Customize Channel
            </button>
            {showUpdateProfile && (
              <UpdateProfile
              channelProfile={channelProfile}
              onClose={() => setShowUpdateProfile(false)}
        />
      )}
          </div>
        </div>
      </div>
      <ProfileTabs  />

      <div className="container mx-auto mt-3 p-3 sm:p-5"> 
      {/* <ProfileTabs/> */}
      </div>
    </div>
  );
};

export default ChannelProfile;
