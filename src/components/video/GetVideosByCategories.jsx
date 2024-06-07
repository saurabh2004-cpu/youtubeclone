import React,{useState} from 'react'
import { useSelector } from 'react-redux';

function GetVideosByCategories() {

    const [menuVisible, setMenuVisible] = useState({}); // Track visibility of menus
    const categorizedVideos=useSelector(state=>state.videos.videosData)
    console.log("cate",categorizedVideos)

    const toggleMenu = (videoId) => {
        setMenuVisible((prevState) => ({
          ...prevState,
          [videoId]: !prevState[videoId],
        }));
      };

  //video published at
    const calculateTimeAgo = (createdAt) => {
      const currentDate = new Date();
      const createdDate = new Date(createdAt);
      const differenceInTime = currentDate - createdDate;
      const differenceInHours = Math.floor(differenceInTime / (1000 * 3600));

      if (differenceInHours < 24) {
        return `${differenceInHours} hours ago`;
      }

      const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
      return `${differenceInDays} days ago`;
    };


  return (
    <div className={`container mx-auto p-4 bg-black-100 grid gap-6 `}>
      {categorizedVideos?.map((video) => (
         <div key={video._id} className="relative cursor-pointer group" onMouseLeave={() => handleMouseLeave(video._id)}>
         <div className="relative overflow-hidden rounded-lg">
           <img
             src={video.thumbnail}
             alt={video.title}
             className="w-full h-60 object-cover"
             onClick={() => handleGetVideo(video._id)}
           />
           <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
             <p className="text-white">{Math.floor(video.duration / 60)}:{video.duration % 60 < 10 ? '0' : ''}{video.duration % 60} min</p>
           </div>
         </div>
         <div className="px-6 py-4" onClick={() => handleGetVideo(video._id)}>
           <div className="font-bold text-lg mb-2 text-left text-white">{video.title}</div>
           <div className='text-gray-400'>{video.views} views • {calculateTimeAgo(video.createdAt)}</div>
           <div className="flex items-center mt-4">
             <img
               src={video.owner?.avatar}
               alt={video.owner?.username}
               className="w-10 h-10 rounded-full mr-4"
             />
             <div className="text-sm">
               <p className="text-gray-300 leading-none">{video.owner?.username}</p>
             </div>
           </div>
         </div>
         <div className="absolute bottom-20 right-4">
           <div className="relative">
             <button
               className="hidden group-hover:block text-white"
               onClick={(e) => {
                 e.stopPropagation();
                 toggleMenu(video._id);
               }}
             >
               &#x22EE;
             </button>
             {menuVisible[video._id] && (
               <div className="absolute bottom-0 right-5 w-48 mt-2 py-2 bg-white border rounded shadow-xl">
                 <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left" onClick={() => handlePlayNext(video._id)}>Play next</button>
                 <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left" onClick={() => handleSaveToWatchLater(video._id)}>Save to Watch Later</button>
                 <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left">Save to Playlist</button>
               </div>
             )}
           </div>
         </div>
       </div>
     ))}
    </div>
  )
}

export default GetVideosByCategories
