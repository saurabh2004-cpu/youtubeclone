import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice.js';
import { Input, Header } from './index.js';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [error, setError] = useState("");
    const { register, handleSubmit } = useForm();
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

            const response = await axios.post('/api/v1/users/login', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                const userData = response.data.data;
                dispatch(login(userData));
                navigate("/");
            }

        } catch (error) {
            setError(error.response?.data?.message || error.message);
        }
    };

    return (
        <>
            {/* <Header></Header> */}

            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 to-red-600">
                <div className="mx-auto w-full max-w-lg bg-gray-800 rounded-xl p-10 border border-gray-200 shadow-md text-white ">
                    <h2 className="text-center text-3xl font-bold text-white mb-8">Log in to your account</h2>
                    {error && <p className="enter correct details">{error}</p>}
                    <form onSubmit={handleSubmit(handleLogin)}>
                        <div className="space-y-5">
                            <Input
                                label="Username"
                                placeholder="Enter your username"
                                type="userName"
                                {...register("userName", {
                                    required: true,
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Input
                                label="Email"
                                placeholder="Enter your email"
                                type="email"
                                {...register("email", {
                                    required: true,
                                    pattern: {
                                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                        message: "Email address must be a valid address"
                                    }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Input
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                {...register("password", { required: true })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all duration-200">
                                Log In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
