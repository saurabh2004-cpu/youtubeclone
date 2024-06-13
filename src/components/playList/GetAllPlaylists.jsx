import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiMoreVertical, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { ConfirmDeleteCard, CreatePlayList, UpdatePlaylist } from '../index.js';
import axiosInstance from '../../axiosInstance';

const EmptyPlaylistCard = ({ onClick }) => {
    return (
        <div className="relative bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer" onClick={onClick}>
            <div className="flex items-center justify-center h-48 rounded-lg bg-gray-600 text-white">
                <FiPlus className="text-4xl text-gray-400 mb-2" />
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-bold mb-2 min-h-[3rem] text-gray-600">Create a Playlist</h3>
                <p className="text-gray-400 mb-2">Click here to create a new playlist.</p>
                <a href="" className="text-blue-500">Create Playlist</a>
            </div>
        </div>
    );
};

function GetAllPlaylists() {
    const [playlists, setPlaylists] = useState([]);
    const [showOptions, setShowOptions] = useState({});
    const [showConfirmDelete, setShowConfirmDelete] = useState(null);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [showCreatePlayList, setShowCreatePlayList] = useState(false);
    const [editingPlaylist, setEditingPlaylist] = useState(null);
    
    const channel = useSelector(state => state.channel.channelData);
    const user = useSelector(state => state.auth.userData);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await axiosInstance.get(`/playlist/get-all-playlists/${channel._id}`);
                setPlaylists(response.data.data);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };

        fetchPlaylists();
    }, [channel._id, showCreatePlayList,editingPlaylist]);

    const handleToggleOptions = (playlistId) => {
        setShowOptions(prevState => ({
            ...prevState,
            [playlistId]: !prevState[playlistId]
        }));
    };

    const handleUpdateClick = (playlist) => {
        setEditingPlaylist(playlist);
    };

    const handleDeleteClick = (playlistId) => {
        setSelectedPlaylist(playlistId);
        setShowConfirmDelete(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axiosInstance.post(`/playlist/delete-playlist/${selectedPlaylist}`);
            setPlaylists(playlists.filter(playlist => playlist._id !== selectedPlaylist));
            setShowConfirmDelete(false);
        } catch (error) {
            console.error('Error deleting playlist:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingPlaylist(null);
    };

    return (
        <div className="p-6 bg-black text-white min-h-screen">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {!showCreatePlayList && <EmptyPlaylistCard onClick={() => setShowCreatePlayList(true)} />}
                    {showCreatePlayList && <CreatePlayList setShowCreatePlayList={setShowCreatePlayList} />}
                    
                    {playlists?.map((playlist) => (
                        <div key={playlist._id} className="relative bg-gray-800 hover:bg-gray-700 rounded-lg shadow-lg">
                            {editingPlaylist && editingPlaylist._id === playlist._id ? (
                                <UpdatePlaylist playlist={editingPlaylist} setShowEditPlayList={handleCancelEdit} />
                            ) : (
                                <>
                                    <img
                                        src={playlist.videos.length > 0 ? playlist.videos[0].thumbnail : 'default_thumbnail.jpg'}
                                        alt={playlist.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="mt-4 p-4">
                                        <h3 className="text-lg font-bold mb-2 min-h-[3rem]">{playlist.name}</h3>
                                        <p className="text-gray-400 mb-2">{playlist.videos.length} videos</p>
                                        <a href={`/get-playlist/${playlist._id}`} className="text-blue-500">
                                            View full playlist{playlist._id}
                                        </a>
                                    </div>
                                    <button
                                        className="absolute top-2 right-2 text-white"
                                        onClick={() => handleToggleOptions(playlist._id)}
                                    >
                                        <FiMoreVertical />
                                    </button>
                                    {showOptions[playlist._id] && user && user._id === playlist.owner._id && (
                                        <div className="absolute top-8 right-2 bg-black rounded-lg shadow-lg">
                                            <button className="block px-4 py-2 text-white hover:bg-gray-600 w-full" onClick={() => handleUpdateClick(playlist)}>
                                                Edit
                                            </button>
                                            <button className="block px-4 py-2 text-white hover:bg-gray-600" onClick={() => handleDeleteClick(playlist._id)}>
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}

                    {!playlists && <h1>Channel Has Not Created Any Playlist Yet !!</h1>}
                </div>
            </div>

            {showConfirmDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <ConfirmDeleteCard
                        onCancel={() => setShowConfirmDelete(false)}
                        onDelete={handleConfirmDelete}
                    />
                </div>
            )}
        </div>
    );
}

export default GetAllPlaylists;
