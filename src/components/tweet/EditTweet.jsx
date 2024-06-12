import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosInstance from '../../axiosInstance';

function EditTweet({ tweet, onUpdate, onCancel }) {
    const { register, handleSubmit, reset, setValue } = useForm();

    React.useEffect(() => {
        if (tweet) {
            setValue("tweet", tweet.content);
        }
    }, [tweet, setValue]);

    const handleUpdateTweet = async (data) => {
        try {
            const response = await axiosInstance.post(`/tweet/update-tweet/${tweet._id}`, { content: data.tweet });
            if (response.status === 200) {
                onUpdate(tweet._id, data.tweet);
                alert("Tweet updated successfully");
                reset();
            }
        } catch (err) {
            console.error("Error updating tweet:", err);
        }
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg mt-4">
            <form onSubmit={handleSubmit(handleUpdateTweet)}>
                <div className="space-y-5">
                    <input
                        label="Tweet"
                        placeholder="Write Something Here ..."
                        type="text"
                        {...register("tweet", { required: true })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                    <div className="flex space-x-4">
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200">
                            Save
                        </button>
                        <button type="button" className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-all duration-200" onClick={onCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditTweet;
