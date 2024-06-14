const EditVideo = () => {
  const { videoId } = useParams();
  const location = useLocation();
  const { video } = location.state;
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  import { useNavigate } from "react-router-dom";

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: video?.title || '',
      description: video?.description || '',
      thumbnail: video?.thumbnail
    }
  });

  const navigate = useNavigate();
  const [isPublished, setIsPublished] = useState(false);
  const [owner, setOwner] = useState(null);
  const title = watch("title", "");

  useEffect(() => {
    const fetchVideo = async () => {
      nprogress.start(); 
      try {
        const response = await axiosInstance.get(`/video/get-video/${videoId}`);
        const videoData = response.data.data.video;
        setOwner(videoData.owner);
        setThumbnailPreview(videoData.thumbnail);
        setIsPublished(videoData.isPublished);
      } catch (error) {
        console.error('Error fetching video details:', error);
      } finally {
        nprogress.done(); 
      }
    };
    fetchVideo();
  }, [videoId]);

  const handleUpdateDetails = async (data) => {
    nprogress.start(); 
    try {
      const response = await axiosInstance.patch(`/video/update-video-details/${videoId}`, data);
      alert(response.data.message);
    } catch (error) {
      console.error('Error updating video details:', error);
    } finally {
      nprogress.done(); 
    }
  };

  const handleUpdateThumbnail = async () => {
    const formData = new FormData();
    formData.append('thumbnail', thumbnailFile);
    nprogress.start(); 
    try {
      const response = await axiosInstance.patch(`/video/update-video-thumbnail/${videoId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error updating video thumbnail:', error);
    } finally {
      nprogress.done(); 
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleDeleteVideo = async () => {
    nprogress.start(); 
    try {
      const response = await axiosInstance.post(`/video/delete-video/${videoId}`);
      alert(response.data.message);
      navigate('/manageVideo'); 
    } catch (error) {
      console.error('Error deleting video:', error);
    } finally {
      nprogress.done(); 
  };

  const handleTogglePublishStatus = async () => {
    nprogress.start(); 
    try {
      const response = await axiosInstance.post(`/video/toggle-status/${videoId}`);
      setIsPublished(response.data.data.isPublished);
      alert(response.data.message);
    } catch (error) {
      console.error('Error toggling publish status:', error);
    } finally {
      nprogress.done(); 
    }
  };

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header showCatagories={false}/>
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-xl">
            <img
              src={thumbnailPreview}
              alt={video.title}
              className="w-full h-64 object-cover rounded shadow-lg"
              onClick={() => document.getElementById('thumbnail-input').click()}
            />
            <button
              onClick={() => document.getElementById('thumbnail-input').click()}
              className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full"
            >
              <FaCamera/>
            </button>
            <input
              type="file"
              id="thumbnail-input"
              className="hidden"
              onChange={handleThumbnailChange}
              accept="image/*"
            />
          </div>
          <button
            onClick={handleUpdateThumbnail}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Update Thumbnail
          </button>

          <div className="mt-6 w-full max-w-xl bg-white p-6 rounded shadow-md">
            <h1 className="text-2xl font-bold mb-4"></h1>
            <form onSubmit={handleSubmit(handleUpdateDetails)}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  {...register("title", { required: true, maxLength: 100 })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {title.length > 100 && (
                  <p className="text-red-500 text-sm">Title must be 100 characters or less</p>
                )}

                {errors.title && <span className="text-red-500">Title is required</span>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  {...register("description", { required: true })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                ></textarea>
                {errors.description && <span className="text-red-500">Description is required</span>}
              </div>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Update Details
              </button>
            </form>
            <div className="mt-4 flex items-center">
              <img
                src={owner?.avatar}
                alt={owner?.username}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="font-bold">{owner?.username}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleDeleteVideo}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Delete Video
              </button>
              <button
                onClick={handleTogglePublishStatus}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {isPublished ? 'Unpublish Video' : 'Publish Video'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditVideo;
