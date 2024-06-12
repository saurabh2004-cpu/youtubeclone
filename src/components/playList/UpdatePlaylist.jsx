import React from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Input } from '../index.js';
import axiosInstance from '../../axiosInstance';

function UpdatePlaylist({ playlist, setShowEditPlayList }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: playlist.name,
            description: playlist.description,
        }
    });

    const handleSave = async (data) => {
        const formData = {
            title: data.name,
            description: data.description,
        };
        try {
            const response = await axiosInstance.post(`/playlist/update-playlist/${playlist._id}`, formData);
            if (response.status === 200) {
                setShowEditPlayList(false);
            }
        } catch (error) {
            console.error('Error updating playlist:', error);
        }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="relative bg-gray-800 p-4 rounded-lg shadow-lg h-100 w-full">
                <h2 className="text-center text-3xl font-bold text-white mb-8">Update Playlist</h2>
                <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
                    <Input
                        label="Playlist Name"
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-black"
                        placeholder="Enter playlist name"
                        {...register("name", { required: true })}
                        errors={errors}
                    />
                    <textarea
                        label="Description"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="Enter playlist description"
                        {...register("description", { required: true })}
                        errors={errors}
                    />
                    <div className="flex space-x-4">
                        <button type="submit" className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all duration-200">
                            Save
                        </button>
                        <button type="button" className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-all duration-200" onClick={() => setShowEditPlayList(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdatePlaylist;
