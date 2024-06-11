import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Header } from '../index';
import axios from 'axios';

function UploadVideo() {
    const { register, handleSubmit,watch } = useForm();
    const [selectedTab, setSelectedTab] = useState('video');
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const title = watch("title", "");


    const handleVideoSelect = (event) => {
        setVideoFile(event.target.files[0]);
        console.log(videoFile)
    };

    const handleThumbnailSelect = (event) => {
        setThumbnailFile(event.target.files[0]);
    };

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    const handleVideoUpload = async (data) => {
        console.log(data)

        const formData = new FormData();
        formData.append("videoFile", videoFile);
        formData.append("thumbnail", thumbnailFile);
        formData.append("title", data.title);
        formData.append("description", data.description);

        console.log(formData)

       const response= await axios.post('/api/v1/video//upload-video',formData)
       if(response){
        alert("video uploaded")
       }
    };

    return (
        <>
            <Header showCatagories={false} />
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="w-full max-w-2xl mx-auto bg-white rounded-xl p-10 shadow-md">
                    <div className="flex justify-between mb-8">
                        <button
                            className={`px-4 py-2 rounded-t-lg ${selectedTab === 'video' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => handleTabChange('video')}
                        >
                            Select Video
                        </button>
                        <button
                            className={`px-4 py-2 rounded-t-lg ${selectedTab === 'thumbnail' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => handleTabChange('thumbnail')}
                        >
                            Choose Thumbnail
                        </button>
                        <button
                            className={`px-4 py-2 rounded-t-lg ${selectedTab === 'details' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => handleTabChange('details')}
                        >
                            Video Details
                        </button>
                    </div>
                    <div className="p-4 border border-t-0 border-gray-200 rounded-b-lg">
                        {selectedTab === 'video' && (
                            <div className="text-center">
                                <div className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-6 h-64">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleVideoSelect}
                                        className="hidden"
                                        id="video-upload"
                                    />
                                    <label htmlFor="video-upload" className="cursor-pointer">
                                        <div className="text-center">
                                            <div className="mb-4">
                                                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16V8a2 2 0 012-2h10l4 4v6a2 2 0 01-2 2H6a2 2 0 01-2-2z"></path>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-.586-1.414L16 8.586A2 2 0 0014.586 8H14z"></path>
                                                </svg>
                                            </div>
                                            <div className="text-gray-500">
                                                {videoFile ? videoFile.name : "Drag and drop video files to upload"}
                                            </div>
                                            <div className="text-blue-500 mt-2">
                                                SELECT FILES
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}
                        {selectedTab === 'thumbnail' && (
                            <div className="text-center">
                                <div className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-6 h-64">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailSelect}
                                        className="hidden"
                                        id="thumbnail-upload"
                                    />
                                    <label htmlFor="thumbnail-upload" className="cursor-pointer">
                                        <div className="text-center">
                                            <div className="mb-4">
                                                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16V8a2 2 0 012-2h10l4 4v6a2 2 0 01-2 2H6a2 2 0 01-2-2z"></path>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-.586-1.414L16 8.586A2 2 0 0014.586 8H14z"></path>
                                                </svg>
                                            </div>
                                            <div className="text-gray-500">
                                                {thumbnailFile ? thumbnailFile.name : "Drag and drop thumbnail image to upload"}
                                            </div>
                                            <div className="text-blue-500 mt-2">
                                                SELECT FILES
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}
                       {selectedTab === 'details' && (
                        <form onSubmit={handleSubmit(handleVideoUpload)}>
                            <div className="space-y-5">
                                <Input
                                    label="Title"
                                    placeholder="Enter your title"
                                    {...register("title", { required: true, maxLength: 100})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {title.length > 100 && (
                                    <p className="text-red-500 text-sm">Title must be 100 characters or less</p>
                                )}
                                <Input
                                    label="Description"
                                    placeholder="Enter your description"
                                    {...register("description", { required: true })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="w-full">
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        id="category"
                                        {...register("category")}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="All">All</option>
                                        <option value="Music">Music</option>
                                        <option value="Gaming">Gaming</option>
                                        <option value="News">News</option>
                                        <option value="Sports">Sports</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all duration-200">
                                    Upload Video
                                </button>
                                {uploadProgress > 0 && (
                                    <div className="relative pt-1">
                                        <div className="flex mb-2 items-center justify-between">
                                            <div>
                                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                                    Uploading {uploadProgress}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                            <div style={{ width: `${uploadProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </form>
)}

                    </div>
                </div>
            </div>
        </>
    );
}

export default UploadVideo;
