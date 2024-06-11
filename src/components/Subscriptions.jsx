import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import axiosInstance from '../../axiosInstance.js';

function Subscriptions({ verticalSubscription = false }) {
    const [subscribedChannels, setSubscribedChannels] = useState([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const currentUser=useSelector(state=>state.auth.userData)

    useEffect(() => {
        const fetchSubscriptions = async () => {
            if(currentUser){
                try {
                    const response = await  axiosInstance.get(`/api/v1/subscription/get-subscribed-channels`);
                    setSubscribedChannels(response.data.data);
                } catch (error) {
                    console.error('Error fetching subscriptions:', error);
                }
            }
        };

        fetchSubscriptions();
    }, []);

    const scrollRight = () => {
        const container = document.getElementById('subscriptions-container');
        container.scrollLeft += 200;
        setScrollPosition(container.scrollLeft);
    };

    const scrollLeft = () => {
        const container = document.getElementById('subscriptions-container');
        container.scrollLeft -= 200;
        setScrollPosition(container.scrollLeft);
    };

    return (
        <div className="p-6 bg-black text-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Subscriptions</h2>
            </div>
               {currentUser&& <Link to="/all-subscriptions" className="text-blue-500">View all</Link>}
            <div className={verticalSubscription ? "flex flex-col space-y-4" : "relative"}>
                <div
                    id="subscriptions-container"
                    className={`${
                        verticalSubscription ? "space-y-4" : "flex overflow-x-auto space-x-4 p-2"
                    }`}
                >
                    {subscribedChannels.length > 0 ? (
                        subscribedChannels.map(channel => (
                            <div key={channel._id} className="flex flex-col items-center">
                                <img
                                    src={channel.avatar}
                                    alt={channel.name}
                                    className={`${verticalSubscription ? "w-12 h-12" : "w-24 h-24"} rounded-full mb-2`}
                                />
                                <p className="text-center">{channel.username}</p>
                                <button className="bg-gray-700 text-white py-1 px-4 rounded mt-2">Subscribed</button>
                            </div>
                        ))
                    ) : (
                        <p>No subscriptions found.</p>
                    )}
                </div>
                {!verticalSubscription && scrollPosition > 0 && (
                    <button onClick={scrollLeft} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full">
                        <BsChevronLeft size={24} />
                    </button>
                )}
                {!verticalSubscription && (
                    <button onClick={scrollRight} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full">
                        <BsChevronRight size={24} />
                    </button>
                )}
            </div>
        </div>
    );
}

export default Subscriptions;
