import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../index.js';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance.js';
import { useMutation, useQueryClient } from '@tanstack/react-query'



function AddComment({ videoId }) {
    const { register, handleSubmit, reset } = useForm();
    const user = useSelector(state => state.auth.userData)
    const navigate = useNavigate()
    const queryClient = useQueryClient()


    const handleComment = async (data) => {
        if (user) {
            const response = await axiosInstance.post(`/comment/add-comment/${videoId}`, data);
            reset();

            mutate(data)

            return response.data.data.comment
        } else {
            navigate('/register')
        }
    };


    const { mutate, isError, isPending, variables } = useMutation({
        mutationFn: handleComment,

        onSuccess: async () => {
            console.log("pending state on sucess", isPending)
            alert("comment posted")
        },
        onError: (error) => {
            console.error('Error:', error);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['comment'] }),
        mutationKey: ['addComment'],
    })

    // console.log("variables", variables)

    if (isError) return <p>{isError}</p>

    return (
        <div className="mt-4">
            <form onSubmit={handleSubmit(handleComment)} className="flex items-center ">
                <input
                    type="text"
                    className="flex-1 p-2 rounded-l-md bg-gray-600 text-black"
                    placeholder="Add a comment..."
                    {...register('comment', {
                        required: true,
                    })}
                />

                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all duration-200 ">
                    Send
                </button>

            </form>

        </div>
    );
}

export default AddComment;
