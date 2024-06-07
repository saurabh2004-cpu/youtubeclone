import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Input,AddComment } from '../index.js';
import { useSelector } from 'react-redux';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';

function GetVideoComments({ videoId }) {
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);
    const [menuState, setMenuState] = useState({ isOpen: false, commentId: null });
    const [updatingCommentId, setUpdatingCommentId] = useState(null);
    const [isCommentLiked,setIsCommentLiked]=useState(false)
    const [likeCount,setLikeCount]=useState(0)
    const { register, handleSubmit, setValue, reset } = useForm();

    // const user = useSelector((state) => state.auth.userData);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/v1/comment/get-video-comments/${videoId}`);
                if (response.status === 200) {
                    const sortedComments = response.data.data.docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setComments(sortedComments);
                } else {
                    setError('Failed to fetch comments');
                }
            } catch (err) {
                console.log(err)
            }
        };

        fetchComments();
    }, [videoId,onload]);

    const toggleMenu = (commentId) => {
        setMenuState((prev) => ({
            isOpen: prev.commentId !== commentId || !prev.isOpen,
            commentId: commentId,
        }));
    };

    const handleDelete = async (commentId) => {
        try {
            await axios.post(`/api/v1/comment/delete-comment/${commentId}`);
            setComments(comments.filter(comment => comment._id !== commentId));
            setMenuState({ isOpen: false, commentId: null });
            alert("Comment deleted");
        } catch (err) {
            setError('Failed to delete comment');
        }
    };

    const handleUpdate = (commentId) => {
        setUpdatingCommentId(commentId);
        const commentToUpdate = comments.find(comment => comment._id === commentId);
        setValue('comment', commentToUpdate.comment);
    };

    const handleUpdateSubmit = async (data) => {
        try {
            await axios.post(`/api/v1/comment/update-comment/${updatingCommentId}`, { comment: data.comment });
            setComments(comments.map(comment => 
                comment._id === updatingCommentId ? { ...comment, comment: data.comment } : comment
            ));
            setUpdatingCommentId(null);
            reset();
        } catch (err) {
            setError('Failed to update comment');
        }
    };

    

    const handleLikeComment = async (commentId) => {
        try {
            const response = await axios.post(`/api/v1/like/toggle-comment-like/${commentId}`);
            if (response.data.success) {
                setIsCommentLiked(!isCommentLiked)
                setLikeCount(prev => isCommentLiked ? prev - 1 : prev + 1);
            }
        } catch (err) {
            setError('Failed to like/unlike comment');
        }
    };

    if (error) {
        return <div className="text-red-600">{error}</div>;
    }

    return (
        <div>
            {comments.length > 0 ? (
                <ul>
                    {comments.map((comment) => (
                        <li key={comment._id} className="flex p-2 border-b border-gray-700 relative">
                            <img
                                src={comment.owner.avatar}
                                alt={comment.owner.username}
                                className="w-8 h-8 rounded-full"
                            />
                                
                            <div className="ml-2 flex-1">
                                <div className="flex items-center mb-1">
                                    <h4 className="text-white font-bold">{comment.owner.username}</h4>
                                   
                                    <span className="text-gray-500 text-sm ml-2">{new Date(comment.createdAt).toLocaleString()}</span>
                                    <div className=''>
                                        <button
                                            className="bg-gray-700 text-white px-2 py-1 rounded-full ml-2"
                                            onClick={() => handleLikeComment(comment._id)}
                                        >
                                            {isCommentLiked ? <AiFillLike /> : <AiOutlineLike />}
                                        </button>
                                     </div>

                                    <div className="ml-auto relative flex">
                                        <div
                                            className="cursor-pointer text-white"
                                            onClick={() => toggleMenu(comment._id)}
                                        >
                                            &#x22EE;
                                        </div>
                                        {menuState.isOpen && menuState.commentId === comment._id && (
                                            <div className="absolute right-0 mt-2 w-32 bg-gray-800 rounded shadow-md">
                                                <button
                                                    onClick={() => handleUpdate(comment._id)}
                                                    className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left"
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(comment._id)}
                                                    className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='flex'>
                                    <p className="text-gray-300">{comment.comment}</p>

                                    

                                    </div>
                                {updatingCommentId === comment._id && (
                                    <form onSubmit={handleSubmit(handleUpdateSubmit)} className="w-full mt-2">
                                        <Input
                                            label="Update Comment"
                                            type="text"
                                            className="w-full p-2 rounded-md bg-gray-600 text-black"
                                            placeholder="Update your comment..."
                                            {...register('comment', {
                                                required: true,
                                            })}
                                        />
                                        <div className="flex space-x-2 mt-2">
                                            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all duration-200">
                                                Save
                                            </button>
                                            <button type="button" className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-all duration-200" onClick={() => setUpdatingCommentId(null)}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-300">No comments yet.</p>
            )}
        </div>
    );
}

export default GetVideoComments;
