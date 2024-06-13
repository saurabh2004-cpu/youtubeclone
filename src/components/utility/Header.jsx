import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Sidebar, VideoCatagories } from '../index.js';
import { login } from '../../store/authSlice.js';
import { useNavigate } from 'react-router-dom';
import { setChannel } from '../../store/channelSlice.js';
import axiosInstance from '../../axiosInstance.js';

function Header({ showCatagories = true }) {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown menu
  const navigate = useNavigate();
  

  const user = useSelector((state) => state.auth.userData);
  console.log("current user",user)
  

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axiosInstance.get('/users/get-current-user');
        // console.log("currentUser",response)
        
        if (response.status === 200) {
          setUserData(response.data.data)
          dispatch(login(response.data.data));

          

        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
  
    fetchCurrentUser();
  }, [dispatch]);
  
  useEffect(() => {
    if (userData) {
      dispatch(login(userData));
    }
  }, [userData, dispatch]);

  const categories = ['All', 'Music', 'Gaming', 'News', 'Sports'];

  const toggleDropdown = () => {
    if (!userData) {
      navigate('/register');
    }
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="bg-black text-white flex flex-col">
      <header className="flex items-center justify-between p-4 bg-black">
        <div className="flex items-center space-x-4">
          <button className="text-xl" onClick={() => setSidebarOpen(true)}>
            &#9776;
          </button>
          <Link to="/">
            <img
              src="https://tse4.mm.bing.net/th?id=OIP.2l0qHHXljXY-hdtZ5eQvewHaES&pid=Api&P=0&h=220"
              alt="YouTube Logo"
              className="h-8"
            />
          </Link>
        </div>
        <div className="flex items-center flex-grow mx-4">
          <div className="relative flex items-center w-full">
            <input
              type="text"
              placeholder="Search"
              className="flex-grow px-4 py-2 rounded-full bg-white text-black focus:outline-none"
            />
            <button className="absolute right-0 px-4 py-2 rounded-r-full bg-gray-700 hover:bg-gray-600">
              &#128269;
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 10l4.55 2.3M15 14.47V11.3a6 6 0 100 7.4V17a2 2 0 11-2-2 1.91 1.91 0 00-1 2.83A4 4 0 1114 9v-.07a4 4 0 11-1 .6V13"
              />
            </svg>
          </button>
          
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
            >
              ➕
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-10 w-40 bg-white rounded-md shadow-lg py-2 z-10">
                <Link
                  to="/upload-video"
                  className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  Upload Video
                </Link>
                <Link
                  to="/create-shorts"
                  className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  Shorts
                </Link>
                <Link
                  to="/go-live"
                  className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  Live
                </Link>
              </div>
            )}
          </div>
          {!userData && (
            <Link to="/register" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
              Signup
            </Link>
          )}
          {userData &&(
            <Link to="/channel-profile">
            {user &&  (
              <img src={user.avatar} alt="Profile" className="h-8 w-8 rounded-full" />
            )}
          </Link>
          )}
        </div>
      </header>
      {showCatagories && <VideoCatagories categories={categories} />}
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
    </div>
  );
}

export default Header;
