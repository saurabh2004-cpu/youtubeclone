import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

function AddToPlaylist({ video, onClose }) {
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await axiosInstance.get(`/api/v1/playlist/get-all-playlists/${video.owner}`);
                setPlaylists(response.data.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };

        fetchPlaylists();
    }, [video.owner]);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleAddToPlaylist = async () => {
        try {
            const response = await axiosInstance.post(`/api/v1/playlist/add-video-to-playlist/${selectedPlaylist}/video/${video._id}`);
            if (response.status === 200) {
                alert("Video added to the playlist");
                handleClose();
                // navigate(-1);
            }
        } catch (error) {
            console.error('Error adding video to playlist:', error);
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for the animation to complete
    };

    return (
        <div className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-gray-800 p-6 rounded-t-3xl shadow-lg w-full max-w-md transition-transform duration-500 transform ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
                <h2 className="text-2xl font-bold text-white mb-4 text-center">Select Playlist</h2>
                {isLoading ? (
                    <div className="text-gray-400 text-center">Loading...</div>
                ) : (
                    <div className="mb-4">
                        <select
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                            value={selectedPlaylist}
                            onChange={(e) => setSelectedPlaylist(e.target.value)}
                        >
                            <option value="">Choose a playlist</option>
                            {playlists.map((playlist) => (
                                <option key={playlist._id} value={playlist._id}>{playlist.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                <button
                    className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
                    onClick={handleAddToPlaylist}
                >
                    Add to Playlist
                </button>
                <button
                    className="w-full py-2 px-4 mt-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-200"
                    onClick={handleClose}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default AddToPlaylist;
