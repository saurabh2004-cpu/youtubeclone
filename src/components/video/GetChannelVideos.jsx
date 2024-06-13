import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical } from 'react-icons/fi'; 
import { ConfirmDeleteCard, AddToPlaylist } from '../index.js'; 
import { useSelector } from 'react-redux';
import axiosInstance from '../../axiosInstance.js';

function GetChannelVideos({ ShowDots }) {
    const [videos, setVideos] = useState([]);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [menuVisible, setMenuVisible] = useState({});
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
    const navigate = useNavigate();

    const channel = useSelector(state => state.channel.channelData);
    
    
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await  axiosInstance.get(`/video/get-channel-all-videos/${channel._id}`);
                setVideos(response.data.data.docs);
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };
        fetchVideos();
    }, [channel._id]);

    const handleThumbnailClick = (videoId) => {
        setSelectedVideoId(videoId);
        navigate(`/getVideo/${videoId}`);
    };

    const handleEditVideo = (video) => {
        if (video) {
            navigate(`/editVideo/${video._id}`, { state: { video } });
        }
    };
    const toggleMenu = (videoId) => {
        setMenuVisible(prevState => ({
            ...prevState,
            [videoId]: !prevState[videoId],
        }));
    };

    const handleMouseLeave = (videoId) => {
        setMenuVisible(prevState => ({
            ...prevState,
            [videoId]: false,
        }));
    };

    const handleDeleteClick = (videoId) => {
        setSelectedVideoId(videoId);
        setShowConfirmDelete(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await  axiosInstance.post(`/video/delete-video/${selectedVideoId}`);
            setVideos(videos.filter(video => video._id !== selectedVideoId));
            setShowConfirmDelete(false);
        } catch (error) {
            console.error('Error deleting video:', error);
        }
    };

    const handleAddToPlaylist = (video) => {
        setSelectedVideo(video);
        setShowAddToPlaylist(true);
    };

    const calculateDaysAgo = (createdAt) => {
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const currentDate = new Date();
        const createdDate = new Date(createdAt);
        const diffDays = Math.round(Math.abs((currentDate - createdDate) / oneDay));
        return `${diffDays} days ago`;
    };

    return (
        <>
            <div className="container mx-auto p-4 bg-black-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {videos.map((video) => (
                    <div
                        key={video._id}
                        className="overflow-hidden cursor-pointer rounded-lg shadow-lg relative"
                        onMouseLeave={() => handleMouseLeave(video._id)}
                    >
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-60 object-cover cursor-pointer text-white"
                            onClick={() => handleThumbnailClick(video._id)}
                        />
                        <div className="px-6 py-4">
                            <div className="font-bold text-l mb-8 text-left text-white">{video.title}</div>
                            <div className='text-gray-400 ' style={{ position: 'absolute', bottom: '10px' }}>{video.views} Views . {calculateDaysAgo(video.createdAt)}</div>
                        </div>
                        <div className="absolute top-2 right-2">
                            {ShowDots &&
                                <button
                                    className="text-gray-600"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleMenu(video._id);
                                    }}
                                >
                                    <FiMoreVertical />
                                </button>
                            }
                            {menuVisible[video._id] && (
                                <div className="absolute top-8 right-0 bg-white rounded-lg shadow-lg text-black">
                                    <button
                                        className="block px-4 py-2 text-black hover:bg-gray-600 hover:text-white w-full"
                                        onClick={() => handleEditVideo(video)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="block px-4 py-2 text-black hover:bg-gray-600 hover:text-white w-full"
                                        onClick={() => handleDeleteClick(video._id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="block px-4 py-2 text-black hover:bg-gray-600 hover:text-white w-full"
                                        onClick={() => handleAddToPlaylist(video)}
                                    >
                                        Add to Playlist
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {showConfirmDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <ConfirmDeleteCard
                        onCancel={() => setShowConfirmDelete(false)}
                        onDelete={handleConfirmDelete}
                    />
                </div>
            )}
            {showAddToPlaylist && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <AddToPlaylist
                        video={selectedVideo}
                        onClose={() => setShowAddToPlaylist(false)}
                    />
                </div>
            )}
        </>
    );
}

export default GetChannelVideos;
