import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Header, AddComment, GetVideoComments, SidebarVideos } from "../index.js";
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import axiosInstance from '../../axiosInstance.js';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css'; 
import { setChannel } from '../../store/channelSlice.js';


function GetVideo() {
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);
    const [subscribers, setSubscribers] = useState(0);
    const [error, setError] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [views, setViews] = useState(0);
    const navigate = useNavigate();
    const viewCounted = useRef(false);
    const [commentsChanged, setCommentsChanged] = useState(false);
    const user = useSelector(state => state.auth.userData);
    const dispatch=useDispatch()
    
    const videos = useSelector(state => state.videos.videosData);
    const channelData = useSelector(state => state.channel.channelData);
    

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                nprogress.start()
                const response = await axiosInstance.get(`/video/get-video/${videoId}`);
                if (response.status === 200) {
                    const videoData = response.data.data.video;
                    setVideo(videoData);
                    setViews(videoData.views);


                    // const channelSubscribers=await axiosInstance.get(`/get-channel-subscribers/${videoData.owner._id}`)
                    // if(channelSubscribers.status===200){
                    //     console.log("subscribers",channelSubscribers)
                    // }

                    const channelProfileResponse = await axiosInstance.get(`/users/get-channel-profile/${videoData.owner._id}`);
                    if (channelProfileResponse.status === 200) {
                        const channelData = channelProfileResponse.data.data;

                        dispatch(setChannel(channelData))
                        console.log("getvideo channel",channelProfileResponse)

                        setSubscribers(channelData.subscribersCount);
                        setIsSubscribed(channelData.isSubscribed);
                    }
                }
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            } finally {
                nprogress.done(); 
              }
              
        };

        const createWatchHistory = async () => {
            if (user) {
                try {
                    await axiosInstance.post(`/users/create-watch-history/${videoId}`);
                } catch (error) {
                    console.error('Error creating watch history:', error);
                }
            }
        };

        const createView = async () => {
            if (user) {
                try {
                    const response = await axiosInstance.post(`/video/increment-video-views/${videoId}`);
                    if (response.data.success) {
                        setViews(response.data.data.views);
                    }
                } catch (error) {
                    console.error('Error incrementing view count:', error);
                }
            }
        };

        if (!viewCounted.current) {
            createView();
            createWatchHistory();
            viewCounted.current = true;
        }

        fetchVideo();
    }, [videoId, commentsChanged]);

    const handleCommentAdded = () => {
        setCommentsChanged(prev => !prev); // Toggle commentsChanged to trigger useEffect
    };

    const handleSubscribe = async (channelId) => {
        if (user) {
            try {
                const response = await axiosInstance.post(`/subscription/toggle-subscription/${channelId}`);
                if (response.data.success) {
                    setIsSubscribed(!isSubscribed);
                    setSubscribers(prev => (isSubscribed ? prev - 1 : prev + 1));
                }
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        } else {
            navigate('/register');
        }
    };

    const handleLikeVideo = async (videoId) => {
        if (user) {
            try {
                const response = await axiosInstance.post(`/like/toggle-video-like/${videoId}`);
                if (response.data.success) {
                    setIsLiked(!isLiked);
                    setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));
                }
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        }
    };

    const handleGetChannel = (channelId) => {
        navigate(`/get-channel/${channelId}`);
    };

    if (error) {
        return <div className="text-red-600">{error}</div>;
    }

    if (!video) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header showCatagories={false} />
            <div className="flex bg-black px-4 py-8">
                {/* Left Section: Video Player and Details */}
                <div className="flex-grow max-w-3xl h-screen w-full bg-black rounded-xl p-6 shadow-md overflow-y-auto hide-scrollbar">
                    <div className="relative">
                        <video controls className="w-full h-auto rounded-md mb-4 mx-auto">
                            <source src={video.videoFile} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-2xl text-left font-bold text-white">{video.title}</h2>
                        <p className="text-gray-500">{views} views</p>
                    </div>
                    <div className="flex items-center mb-4">
                        <div className='flex cursor-pointer' onClick={() => handleGetChannel(video.owner._id)}>
                            <img
                                src={video.owner.avatar}
                                alt={video.owner.username}
                                className="w-12 h-12 rounded-full"
                            />
                            <div className="ml-4">
                                <h3 className="text-xl font-bold text-white">{video.owner.username}</h3>
                                <p className="text-white">{subscribers} subscribers</p>
                            </div>
                        </div>
                        <button
                            className={`px-4 py-2 rounded-full ${isSubscribed ? 'bg-white text-gray-800' : 'bg-red-600 text-white'}`}
                            onClick={() => handleSubscribe(video.owner._id)}
                        >
                            {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                        </button>
                        <div className="ml-auto text-white">
                            <button
                                className="bg-gray-700 text-white px-4 py-2 rounded-full m-2"
                                onClick={() => handleLikeVideo(video._id)}
                            >
                                {isLiked ? <AiFillLike /> : <AiOutlineLike />} {likeCount}
                            </button>
                            
                            <button className="bg-gray-700 text-white px-4 py-2 rounded-full m-2">Share</button>
                            <button className="bg-gray-700 text-white px-4 py-2 rounded-full m-2">Download</button>
                        </div>
                    </div>
                    <div className="mt-4 text-left">
                        <p className="text-gray-300">
                            {showFullDescription ? video.description : `${video.description.slice(0, 200)} `}
                            {video.description.length > 200 && (
                                <span className="text-blue-500 cursor-pointer" onClick={() => setShowFullDescription(!showFullDescription)}>
                                    {showFullDescription ? 'Show less' : 'Show more'}
                                </span>
                            )}
                        </p>
                    </div>
                    <AddComment videoId={video._id} onCommentAdded={handleCommentAdded} />
                    <div>
                        <GetVideoComments videoId={video._id} />
                    </div>
                </div>

                {/* Right Section: Sidebar Videos */}
                <div className="w-1/2 ml-4 flex-shrink-0 sticky top-20">
                    <SidebarVideos videos={videos} getVideos={true} />
                </div>
            </div>
        </>
    );
}

export default GetVideo;
