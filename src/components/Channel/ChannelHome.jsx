import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
// import axiosInstance from '../../axiosInstance.js';
import axiosInstance from "../../axiosInstance.js"

function ChannelHome() {

    const [videos,setVideos]=useState()
    const channel=useSelector(state=>state.channel.channelData)

    useEffect(()=>{
        const fetchVideos=async()=>{
            const response = await axiosInstance.get(`/api/v1/video/get-channel-all-videos/${channel._id}`);
            setVideos(response.data.data.docs)
        }

        fetchVideos()
    })
  return (
    <div>
      <div className="mt-6 ">
                <h2 className="text-2xl font-semibold  text-white">For You</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {videos?.map((video) => (
                        <div key={video.id} className=" rounded-lg shadow-md p-4">
                            <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover rounded-md mb-2" />
                            <h3 className="text-lg font-semibold text-white">{video.title}</h3>
                            <p className="text-white">{video.views} views • {video.uploaded} ago</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="">
                <h2 className="text-2xl font-semibold mb-4 text-white">Videos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {videos?.map((video) => (
                        <div key={video.id} className=" rounded-lg shadow-md p-4">
                            <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover rounded-md mb-2" />
                            <h3 className="text-lg font-semibold text-white">{video.title}</h3>
                            <p className="text-white">{video.views} views • {video.uploaded} ago</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    
  )
}

export default ChannelHome
