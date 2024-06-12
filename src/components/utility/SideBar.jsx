import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineHome, AiOutlineHistory, AiOutlineVideoCamera, AiOutlineHeart, AiOutlineSetting } from 'react-icons/ai';
import { MdOutlineSubscriptions, MdOutlineVideoLibrary, MdOutlineWatchLater } from 'react-icons/md';
import { FaRegUserCircle } from 'react-icons/fa';
import {Subscriptions} from "../index.js"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../axiosInstance.js';

function Sidebar({ isOpen, closeSidebar }) {
    const navigate=useNavigate()
    const currentUser=useSelector(state=>state.auth.userData)

    const handleLogoutClick = async() => {
        const response=await axiosInstance.post('/users/logout')
        alert('sucessfully logged Out')
        navigate('/')
    };

   

    return (
        <div className={`fixed inset-0 flex z-50 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="w-64 bg-black text-white h-screen overflow-y-auto hide-scrollbar px-4 py-8 space-y-4">
                <div className="flex justify-end">
                    <button onClick={closeSidebar} className="text-xl text-gray-400">&times;</button>
                </div>
                <div className="space-y-4">
                    <Link to="/" className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-lg" onClick={closeSidebar}>
                        <AiOutlineHome size={24} />
                        <span>Home</span>
                    </Link>
                    <Link to="/shorts" className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-lg" onClick={closeSidebar}>
                        <AiOutlineVideoCamera size={24} />
                        <span>Shorts</span>
                    </Link>
                    <Link to={currentUser && "/channel-profile" || "/register" }className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-lg" onClick={closeSidebar}>
                        <MdOutlineSubscriptions size={24} />
                        <span>Subscriptions</span>
                    </Link>
                </div>
                <hr className="border-gray-700" />
                <div className="space-y-4">
                    <span className="block text-gray-400">You</span>
                    <Link to={currentUser && "/channel-profile" || "/register" } className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-lg" onClick={closeSidebar}>
                        <FaRegUserCircle size={24} />
                        <span>Your channel</span>
                    </Link>
                    <Link to={currentUser && "/watch-history" || "/register" } className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-lg" onClick={closeSidebar}>
                        <AiOutlineHistory size={24} />
                        <span>History</span>
                    </Link>
                    <Link to={currentUser && "/playlists" || "/register" } className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-lg" onClick={closeSidebar}>
                        <MdOutlineVideoLibrary size={24} />
                        <span>Playlists</span>
                    </Link>
                    {currentUser && <Link to="/manageVideo" className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-lg" onClick={closeSidebar}>
                        <AiOutlineVideoCamera size={24} />
                        <span>Your videos</span>
                    </Link>}
                    <Link to={currentUser && "/watch-later" || "/register" } className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-lg" onClick={closeSidebar}>
                        <MdOutlineWatchLater size={24} />
                        <span>Watch later</span>
                    </Link>
                    {currentUser && <Link to="/liked-videos" className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-lg" onClick={closeSidebar}>
                        <AiOutlineHeart size={24} />
                        <span>Liked videos</span>
                    </Link>}
                </div>
                <hr className="border-gray-700" />
                <div className="mt-4">
                    <Subscriptions verticalSubscription={true} />
                </div>
                {currentUser && <div className="space-y-4">
                   <button onClick={handleLogoutClick}
                   className="bg-black-500 text-white font-semibold px-3 py-1 sm:px-4 sm:py-2 rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg transition-transform transform hover:-translate-y-1"
                   > LogOut</button>
                </div>}
    
            </div>
            <div className="flex-1 bg-black bg-opacity-50" onClick={closeSidebar}></div>
        </div>
    );
}

export default Sidebar;
