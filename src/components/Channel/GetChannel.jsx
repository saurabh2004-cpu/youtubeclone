import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setChannel } from '../../store/channelSlice.js';
import axiosInstance from "../../axiosInstance.js";
import { ChannelTabs, Header } from '../index.js';

function GetChannel() {
    const { channelId } = useParams();
    const [channelDetails, setChannelDetails] = useState(null);
    const [channelStats, setChannelStats] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                // Fetch Channel Stats
                const statsResponse = await axiosInstance.get(`/dashbord/get-channel-stats/${channelId}`);
                if (statsResponse.status === 200) {
                    setChannelStats(statsResponse.data.data);
                }

                // Fetch Channel Profile
                const profileResponse = await axiosInstance.get(`/users/get-channel-profile/${channelId}`);
                if (profileResponse.status === 200) {
                    setChannelDetails(profileResponse.data.data);
                    dispatch(setChannel(profileResponse.data.data));
                }
            } catch (error) {
                console.error("Error fetching channel data:", error);
            }
        };

        fetchChannelData();
    }, [channelId, dispatch]);

    const channel = useSelector(state => state.channel.channelData);
    console.log("getchan", channel);

    if (!channelDetails || !channelStats) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {/* <Header showCategories={false} /> */}
            <div className="container mx-auto p-4 bg-black">
                <div className="bg-black rounded-lg shadow-lg p-6 mb-4 text-white">
                    <div className="flex items-center space-x-4">
                        <img
                            src={channelDetails.avatar}
                            alt={channelDetails.username}
                            className="h-24 w-24 rounded-full"
                        />
                        <div>
                            <h1 className="text-3xl font-bold">{channelDetails.fullName}</h1>
                            <h2 className="text-xl text-gray-300">@{channelDetails.username}</h2>
                            <div className="text-gray-400 mt-2 flex space-x-2">
                                <span>{channelStats.totalSubscribers} subscribers</span>
                                <span>•</span>
                                <span>{channelStats.totalVideos} videos</span>
                            </div>
                            <p className="mt-2 text-gray-400">{channelDetails.description}</p>
                            <div className="mt-4 flex space-x-2">
                                <button className="bg-white text-black font-semibold py-2 px-4 rounded-full">Subscribe</button>
                                <button className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-full">Join</button>
                            </div>
                        </div>
                    </div>
                </div>
                <ChannelTabs />
            </div>
        </>
    );
}

export default GetChannel;
