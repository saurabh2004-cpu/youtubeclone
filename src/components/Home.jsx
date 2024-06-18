import React from 'react';
import { Header, AllUsersVideos, Sidebar } from './index';
import useBlockBackNavigation from './customHooks/useBlockBackNavigation';

function Home() {
    useBlockBackNavigation(); 

    return (
        <>
            <Header />
            <AllUsersVideos />
            <Sidebar />
        </>
    );
}

export default Home;
