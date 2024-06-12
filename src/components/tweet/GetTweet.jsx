import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { FiMoreVertical } from 'react-icons/fi';
import { ConfirmDeleteCard, EditTweet } from '../index.js'; 
import { useSelector } from 'react-redux';
import {PostTweet} from '../index.js'
import axiosInstance from '../../axiosInstance.js';

function GetTweet() {
    const [tweets, setTweets] = useState([]);
    const [likedTweets, setLikedTweets] = useState({});
    const [showOptions, setShowOptions] = useState({});
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [tweetToDelete, setTweetToDelete] = useState(null);
    const [tweetToEdit, setTweetToEdit] = useState(null);
    const [error, setError] = useState(null);
    const[showPostTweet,setShowPostTweet]=useState(false)

    const channel=useSelector(state=>state.channel.channelData)
    const channelId=channel._id

    const currentUser=useSelector(state=>state.auth.userData)
    const userId=currentUser._id

   

    useEffect(() => {

        if(channelId===userId){
            setShowPostTweet(true)
        }
        fetchTweets();
    }, [channelId]);

    const fetchTweets = async () => {
        try {
            const response = await axiosInstance.get(`/tweet/get-tweets/${channel._id}`);
            setTweets(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while fetching tweets.');
        }
    };

    const handleToggleOptions = (tweetId) => {
        setShowOptions(prevState => ({
            ...prevState,
            [tweetId]: !prevState[tweetId]
        }));
    };

    const handleLikeTweet = async (tweetId) => {
        try {
            const response = await axiosInstance.post(`/tweet/toggle-tweet-like/${tweetId}`);
            if (response.data.success) {
                setLikedTweets((prev) => ({
                    ...prev,
                    [tweetId]: !prev[tweetId],
                }));
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while liking the tweet.');
        }
    };
    
    const handleDeleteTweet = async () => {
        try {
            const response = await axiosInstance.post(`/tweet/delete-tweet/${tweetToDelete._id}`);
            if (response.status === 200) {
                setTweets(tweets.filter(tweet => tweet._id !== tweetToDelete._id));
                setShowConfirmDelete(false);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while deleting the tweet.');
        }
    };
    
    const handleConfirmDelete = (tweet) => {
        setTweetToDelete(tweet);
        setShowConfirmDelete(true);
    };
    
    const handleEditTweet = (tweet) => {
        setTweetToEdit(tweet);
        console.log("inget tweet",tweet)
    };
    
    const handleUpdateTweet = (tweetId, newContent) => {
        setTweets(tweets.map(tweet => tweet._id === tweetId ? { ...tweet, content: newContent } : tweet));
        setTweetToEdit(null);
    };
    
    const handleCancelEdit = () => {
        setTweetToEdit(null);
    };
    
    if (error) {
        return <div className="text-red-600">{error}</div>;
    }
    
    return (
        <>
        <div className="flex flex-col items-center space-y-4">
           {showPostTweet &&  <PostTweet/>}
            {tweets.map((tweet) => (
                <div key={tweet._id} className="bg-gray-800 text-white p-6 rounded-lg shadow-md w-full max-w-lg relative">
                    <div className="absolute top-2 right-2">
                        <button className="text-gray-600 " onClick={() => handleToggleOptions(tweet._id)}>
                            <FiMoreVertical />
                        </button>
                        {showOptions[tweet._id] && (
                            <div className="absolute top-8 right-0 bg-gray-700 rounded-lg shadow-lg">
                                <button className="block px-4 py-2 text-white hover:bg-gray-600 w-full" onClick={() => handleEditTweet(tweet)}>
                                    Edit
                                </button>
                                <button className="block px-4 py-2 text-white hover:bg-gray-600 w-full" onClick={() => handleConfirmDelete(tweet)}>
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                    <p className="text-xl text-left mb-10">{tweet.content}</p>
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                            <img
                                src={tweet.owner.avatar}
                                alt={tweet.owner.username}
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="ml-2">{tweet.owner.username}</span>
                        </div>
                        <button
                            className="flex items-center space-x-2"
                            onClick={() => handleLikeTweet(tweet._id)}
                        >
                            {likedTweets[tweet._id] ? <AiFillLike /> : <AiOutlineLike />}
                            <span>{likedTweets[tweet._id] ? 'Unlike' : 'Like'}</span>
                        </button>
                    </div>
                    {tweetToEdit && tweetToEdit._id === tweet._id && (
                        <EditTweet
                            tweet={tweetToEdit}
                            onUpdate={handleUpdateTweet}
                            onCancel={handleCancelEdit}
                        />
                    )}
                </div>
            ))}
            {showConfirmDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <ConfirmDeleteCard
                        onCancel={() => setShowConfirmDelete(false)}
                        onDelete={handleDeleteTweet}
                    />
                </div>
            )}

        </div>
        </>
    );
}

export default GetTweet;
