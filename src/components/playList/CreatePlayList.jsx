import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Input } from '../index';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance.js';

function CreatePlayList({ setShowCreatePlayList }) {
    const { register, handleSubmit, reset } = useForm();
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleCreatePlayList = async (data) => {
        try {
            const formData = {
                name: data.name,
                description: data.description,
            };

            const response = await  axiosInstance.post('/api/v1/playlist/create-playlist', formData);
            console.log('res, play', response.data.data);
            reset();
            setShowCreatePlayList(false); // Hide the form after submission
            
        } catch (error) {
            console.error('Error creating playlist:', error);
            setError(error.response?.data?.message || 'An error occurred while creating the playlist.');
        }
    };

    return (
        <div className="flex items-center justify-center ">
            <div className="relative bg-gray-800 p-4 rounded-lg shadow-lg w-full h-100">
                <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">Create Playlist</h2>
                {error && <p className="text-red-600 mb-6 ">{error}</p>}
                <form onSubmit={handleSubmit(handleCreatePlayList)} className="space-y-6">
                    <Input
                        label="Playlist Name"
                        placeholder="Enter playlist name"
                        type="text"
                        {...register('name', {
                            required: true,
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Input
                        label="Description"
                        placeholder="Enter playlist description"
                        {...register('description', {
                            required: true,
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all duration-200"
                        >
                            Create Playlist
                        </button>
                        <button
                            type="button"
                            className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-all duration-200"
                            onClick={() => setShowCreatePlayList(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePlayList;
