import React,{useState} from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../index.js';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function AddComment({ videoId,onCommentAdded }) {
    const { register, handleSubmit, reset } = useForm();
    const [commentText, setCommentText] = useState('');
    const user=useSelector(state=>state.auth.userData)
    const navigate=useNavigate()

    const handleComment = async (data) => {
       if(user){
            try {
                const response = await axios.post(`/api/v1/comment/add-comment/${videoId}`, data);
                setCommentText(response.data.data.comment)
                if (response.status !== 200) {
                    throw new Error('Failed to add comment');
                }

                if (onCommentAdded) {
                    onCommentAdded(); // Notify the parent component that a new comment has been added
                }
                reset();      
            } catch (error) {
                console.error('Error adding comment:', error);
                setError(error.response?.data?.message || 'An error occurred while adding the comment.');
            }
       }else{
        navigate('/register')
       }
    };

    return (
        <div className="mt-4">
            <form onSubmit={handleSubmit(handleComment)} className="flex items-center ">
                <Input
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
