import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiMoreVertical } from 'react-icons/fi';
import { Header, ConfirmDeleteCard,SidebarVideos } from '../index.js';
import axiosInstance from '../../axiosInstance.js';

function GetPlayList() {
    const [playlist, setPlaylist] = useState(null);
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState(null);
    const [showOptions, setShowOptions] = useState({});
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [videoToRemove, setVideoToRemove] = useState(null);
    const [message, setMessage] = useState(null);
    const { playlistId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await  axiosInstance.get(`/api/v1/playlist/get-playlist/${playlistId}`);
                setPlaylist(response.data.data);
                setVideos(response.data.data.videos);
                console.log(videos)
            } catch (error) {
                console.error('Error fetching playlist:', error);
                setError('Error fetching playlist.');
            }
        };

        fetchPlaylist();
    }, [playlistId]);

    // const handleCardClick = (videoId) => {
    //     navigate(`/getVideo/${videoId}`);
    // };

    // const handleToggleOptions = (videoId) => {
    //     setShowOptions(prevState => ({
    //         ...prevState,
    //         [videoId]: !prevState[videoId]
    //     }));
    // };

   
    const handleConfirmDelete = async () => {
        try {
            await  axiosInstance.post(`/api/v1/playlist/remove-video/${playlistId}/videos/${videoToRemove._id}`);
            setPlaylist(prevPlaylist => ({
                ...prevPlaylist,
                videos: prevPlaylist.videos.filter(video => video._id !== videoToRemove._id)
            }));
            setMessage('Video removed');
            setShowConfirmDelete(false);
        } catch (error) {
            console.error('Error removing video:', error);
            setMessage('Error removing video');
        }
    };

    const handlePlayAll = (videoId) => {
        navigate(`/getVideo/${videoId}`);
    };

    const handleShuffle = () => {
        const shuffledVideos = [...playlist.videos].sort(() => Math.random() - 0.5);
        setPlaylist(prevPlaylist => ({
            ...prevPlaylist,
            videos: shuffledVideos
        }));
    };

    if (error) {
        return <div className="text-red-600">{error}</div>;
    }

    if (!playlist) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header showCatagories={false} />
            <div className="flex flex-col lg:flex-row p-6 space-y-6 lg:space-y-0 lg:space-x-6 bg-gray-900 text-white h-90 overflow-hidden">
                {/* Left-side Playlist Details */}
                <div className="bg-gradient-to-r from-purple-800 via-blue-600 to-indigo-500 p-4 rounded-lg w-full h-full lg:w-1/3 lg:sticky lg:top-0">
                    <img src={playlist.videos[0].thumbnail} alt={playlist.name} className="w-full h-60 rounded-lg object-cover" />
                    <h2 className="text-2xl font-bold mt-4 text-left">{playlist.name}</h2>
                    <p className="text-gray-300 mt-2">{playlist.owner.username}</p>
                    <p className="text-gray-300 mt-2">{playlist.videos.length} videos</p>
                    <p className="mt-4 text-gray-200">{playlist.description}</p>
                    <div className="flex space-x-4 mt-6">
                        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200" onClick={() => handlePlayAll(playlist.videos[0]._id)}>
                            Play All
                        </button>
                        <button className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-all duration-200" onClick={handleShuffle}>
                            Shuffle
                        </button>
                    </div>
                    {message && <div className="mt-4 text-green-500">{message}</div>}
                </div>

                {/* Right-side Videos List */}
                <div className="flex space-y-4 overflow-y-auto">
                </div>

                {/* {showConfirmDelete && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <ConfirmDeleteCard
                        onCancel={() => setShowConfirmDelete(false)}
                        onDelete={handleConfirmDelete}
                        />
                        </div>
                    )} */}
                    <SidebarVideos videos={videos} getPlayList={true}/>
            </div>
        </>
    );
}

export default GetPlayList;
