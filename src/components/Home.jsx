import React from 'react';
import { Header, AllUsersVideos, Sidebar } from './index';
import { useSelector } from 'react-redux';
import { Container } from '../components/index.js';

function Home() {
    // const user = useSelector((state) => state.auth.userData);
    // console.log("user", user);

    return (
        <>
        <Header />
        <AllUsersVideos />
        <Sidebar/>
        
        </>
     
    );
}

export default Home;
