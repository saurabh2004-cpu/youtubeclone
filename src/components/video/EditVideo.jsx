import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../index.js';
import { FaCamera,FaPlay } from 'react-icons/fa';

const EditVideo = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`/api/v1/video/get-video/${videoId}`);
        const videoData = response.data.data;
        console.log(response)
        setVideo(videoData);
        setTitle(videoData.title);
        setDescription(videoData.description);
        setIsPublished(videoData.isPublished);
        setOwner(videoData.owner);
        console.log(owner)
      } catch (error) {
        console.error('Error fetching video details:', error);
      }
    };
    fetchVideo();
  }, [videoId]);

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`/api/v1/video/update-video-details/${videoId}`, {
        title,
        description,
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error updating video details:', error);
    }
  };

  const handleUpdateThumbnail = async () => {
    const formData = new FormData();
    formData.append('thumbnail', thumbnail);

    try {
      const response = await axios.patch(`/api/v1/video/update-video-thumbnail/${videoId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error updating video thumbnail:', error);
    }
  };

  const handleDeleteVideo = async () => {
    try {
      const response = await axios.post(`/api/v1/video/delete-video/${videoId}`);
      alert(response.data.message);
      navigate('/manageVideo'); // Redirect to the manage videos page
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const handleTogglePublishStatus = async () => {
    try {
      const response = await axios.post(`/api/v1/video/toggle-status/${videoId}`);
      setIsPublished(response.data.data.isPublished);
      alert(response.data.message);
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  if (!video) {
    return <div>Loading...</div>;
  }

  return (<>
      <Header showCatagories={false}/>
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-xl">
          <img
            src={thumbnail ? URL.createObjectURL(thumbnail) : video.thumbnail}
            alt={video.title}
            className="w-full h-64 object-cover rounded shadow-lg"
            onClick={() => document.getElementById('thumbnail-input').click()}
          />
          <button
            onClick={() => document.getElementById('thumbnail-input').click()}
            className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full"
          >
           <FaCamera/>
          </button>
          <input
            type="file"
            id="thumbnail-input"
            className="hidden"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <button
          onClick={handleUpdateThumbnail}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Update Thumbnail
        </button>

        <div className="mt-6 w-full max-w-xl bg-white p-6 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-4"></h1>
          <form onSubmit={handleUpdateDetails}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Details
            </button>
          </form>
          <div className="mt-4 flex items-center">
            <img
              src={owner?.avatar}
              alt={owner?.username}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <p className="font-bold">{owner?.username}</p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handleDeleteVideo}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Delete Video
            </button>
            <button
              onClick={handleTogglePublishStatus}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isPublished ? 'Unpublish Video' : 'Publish Video'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default EditVideo;
