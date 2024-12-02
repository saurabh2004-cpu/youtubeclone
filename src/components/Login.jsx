import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice.js';
import { Input, Header } from './index.js';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../axiosInstance.js";

function Login() {
    const [error, setError] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (data) => {
        setError("");
        try {
            const formData = {
                userName: data.userName,
                email: data.email,
                password: data.password
            };

            console.log(formData);

            const response = await axiosInstance.post('/users/login', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("login", response);
            dispatch(login(response.data.data));
            
            if (response.status === 200) {
                const userData = response.data.data;
                localStorage.setItem('accessToken', response.data.data.accessToken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
                navigate("/");
            }

        } catch (error) {
            setError(error.response?.data?.message || error.message);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8000/api/v1/users/auth/google'; // Adjust based on your backend URL
      };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 to-red-600">
            <div className="mx-auto w-full max-w-lg bg-gray-800 rounded-xl p-10 border border-gray-200 shadow-md text-white">
                <h2 className="text-center text-3xl font-bold text-white mb-8">Log in to your account</h2>
                {error && <p className="text-red-600">{error}</p>}
                <form onSubmit={handleSubmit(handleLogin)}>
                    <div className="space-y-5">
                        <Input
                            placeholder="Enter your username"
                            type="text"
                            {...register("userName", {
                                required: "Username is required",
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.userName && <p className="text-red-600">{errors.userName.message}</p>}
                        
                        <Input
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: "Email address must be a valid address"
                                }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
                        
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: "Password is required"
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && <p className="text-red-600">{errors.password.message}</p>}
                        
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all duration-200">
                            Log In
                        </button>
                        <button onClick={handleGoogleLogin} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all duration-200"> Login with Google </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
