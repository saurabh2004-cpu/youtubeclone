import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../index.js';
import GetTweet from './GetTweet.jsx';
import { useNavigate } from 'react-router-dom';

function PostTweet() {
    const { register, handleSubmit, reset } = useForm();
    const navigate=useNavigate()

    const handleTweetPost = async (data) => {
        try {
            const response = await axios.post('/api/v1/tweet/post-tweet', { content: data.tweet });
            console.log("res", response);
            
            if (response.status === 200) {
                alert("Tweet posted successfully!");
                // navigate(`/get-tweets/${response.data.data.owner}`);
                reset();
            }
        } catch (error) {
            console.error("Error posting tweet:", error);
            alert(error.response?.data?.message || "An error occurred while posting the tweet.");
        }
    }

    return (
    <>
        <div>
            <form onSubmit={handleSubmit(handleTweetPost)}>
                <div className="space-y-5">
                    <Input
                        label="Tweet"
                        placeholder="Write Something Here ..."
                        type="text"
                        {...register("tweet", {
                            required: true,
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all duration-200">
                        Post
                    </button>
                </div>
            </form>
        </div>
        
    </>
    )
}

export default PostTweet;
