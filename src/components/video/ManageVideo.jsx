import React,{useState,useEffect} from 'react';
import {Header,GetChannelVideos } from "../index";

const ManageVideo = () => {
  const[showVideoTab,setShowVideoTab]=useState(false)
  
  useEffect(()=>{
    setShowVideoTab(true) 
   })
  return (
    <>
   <Header showCatagories={false}/>
    <GetChannelVideos ShowDots={showVideoTab}/>

    </>
  );
};

export default ManageVideo;
