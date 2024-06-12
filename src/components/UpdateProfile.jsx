import React from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { login } from '../store/authSlice';
import Input from './utility/Input';
import axiosInstance from "../axiosInstance.js"

const UpdateProfile = ({ channelProfile, onClose }) => {
  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: channelProfile.fullName,
      username: channelProfile.username,
    },
  });

  const onSubmit = async (data) => {
    const formData = {
      fullName: data.fullName,
      username: data.username
    };
    try {
      const response = await axiosInstance.patch('/users/update-account-details', formData);

      if (response.status === 200) {
        dispatch(login(response.data.data));
        onClose(); // Close the modal
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-75">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 bg-gradient-to-r from-purple-500 to-pink-500">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center ">Update Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Full Name"
            name="fullName"
            {...register("fullName", { required: true })}
            errors={errors}
          />
          <Input
            label="Username"
            name="username"
            {...register("username", { required: true })}
            errors={errors}
          />
          <div className="flex justify-end mt-6">
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded-lg mr-3 transition duration-300 ease-in-out hover:bg-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
