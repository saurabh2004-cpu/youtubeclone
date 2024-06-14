import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice.js';
import Input from './utility/Input.jsx';
import { FaCamera, FaEye, FaEyeSlash } from 'react-icons/fa';
import axiosInstance from '../axiosInstance.js';

function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const { register, handleSubmit } = useForm();
    const [activeTab, setActiveTab] = useState(0);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegistration = async (data) => {
        setError("");
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('fullName', data.fullName);
            formData.append('email', data.email);
            formData.append('username', data.username);
            formData.append('password', data.password);

            if (data.avatar && data.avatar.length > 0) {
                formData.append('avatar', data.avatar[0]);
            }
            if (data.coverImage && data.coverImage.length > 0) {
                formData.append('coverImage', data.coverImage[0]);
            }

            const response = await axiosInstance.post('/users/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            dispatch(login(response.data.data));

            if (response.status === 200) {
                setLoading(false);
                navigate("/login");
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setLoading(false);
        }
    };

    const handleNext = () => {
        setActiveTab((prevTab) => prevTab + 1);
    };

    const handleBack = () => {
        setActiveTab((prevTab) => prevTab - 1);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImagePreview(URL.createObjectURL(file));
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 to-red-600">
            <div className="mx-auto w-full max-w-lg space-y-5 bg-gray-800 text-white rounded-xl p-10 border border-gray-200 shadow-md">
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create an account</h2>
                <p className="mt-2 text-center text-base text-gray-600">
                    Already have an account?&nbsp;
                    <p>Wait while uploading avatar and coverImage</p>
                    <Link
                        to="/login"
                        className="font-medium text-blue-600 transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

                {loading ? (
                    <div className="text-white text-center">Loading...</div>
                ) : (
                    <form onSubmit={handleSubmit(handleRegistration)}>
                        <div>
                            {activeTab === 0 && (
                                <>
                                    <Input
                                        label="Full Name"
                                        placeholder="Enter your full name"
                                        {...register("fullName", { required: true })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Input
                                        label="Username"
                                        placeholder="Enter your username"
                                        {...register("username", { required: true })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </>
                            )}
                            {activeTab === 1 && (
                                <>
                                    <Input
                                        label="Email"
                                        placeholder="Enter your email"
                                        type="email"
                                        {...register("email", {
                                            required: true,
                                            pattern: {
                                                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                                message: "Email address must be a valid address",
                                            },
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Input
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        {...register("password", { required: true })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute mt-2 mr-2"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </>
                            )}
                            {activeTab === 2 && (
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="flex flex-col items-center">
                                        <h2 className="m-2 text-bold">Avatar</h2>
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Avatar Preview"
                                                className="w-32 h-32 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer">
                                                <FaCamera className="text-3xl" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            {...register("avatar")}
                                            onChange={handleAvatarChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            )}
                            {activeTab === 3 && (
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="flex flex-col items-center">
                                        <h2 className="m-2 text-bold">Cover Image</h2>
                                        {coverImagePreview ? (
                                            <img
                                                src={coverImagePreview}
                                                alt="Cover Image Preview"
                                                className="w-full h-32 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full p-20 h-32 bg-gray-200 flex items-center justify-center cursor-pointer">
                                                <FaCamera className="text-3xl" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            {...register("coverImage")}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            onChange={handleCoverImageChange}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between mt-4">
                            {activeTab > 0 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all duration-200"
                                >
                                    Back
                                </button>
                            )}
                            {activeTab < 3 && (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200 ml-auto"
                                >
                                    Next
                                </button>
                            )}
                            {activeTab === 3 && (
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200 ml-auto"
                                >
                                    Create Account
                                </button>
                            )}

                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Register;
