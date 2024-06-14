import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setVideos } from '../store/videosSlice';
import axiosInstance from "../axiosInstance.js"
import nprogress from 'nprogress';
import 'nprogress/nprogress.css'; 

const VideoCatagories = ({ categories }) => {
  const [categoryVideos, setCategoryVideo] = useState([]);
  const dispatch = useDispatch();

  const handleCatagoryClick = async (category) => {
    if (category === 'All') {
      nprogress.start()
      const response = await axiosInstance.get('/video/all-users-videos');
      const shuffledVideos = response.data.data.sort(() => 0.5 - Math.random());
      dispatch(setVideos(shuffledVideos));
      nprogress.done()
    } else {
      nprogress.start()
      const response = await axiosInstance.get(`/video/get-videos-by-catagory/${category.toLowerCase()}`);
      setCategoryVideo(response.data.data);
      dispatch(setVideos(response.data.data));
      nprogress.done()
    }
  };

  return (
    <nav className="flex space-x-4 px-4 py-2 black">
      {categories.map((category, index) => (
        <button
          key={index}
          className="px-3 py-1 rounded bg-black hover:bg-gray-500"
          onClick={() => handleCatagoryClick(category)}
        >
          {category}
        </button>
      ))}
    </nav>
  );
};

export default VideoCatagories;
