const BlogCard = ({ title, editBlog, deleteBlog }) => {
	return (
		<div className="flex flex-row justify-between px-2 shadow-md m-4 items-center">
			<div className="mr-4 h-2 w-2 rounded-full bg-primary"></div>

      <div className="font-medium pr-5 mr-auto">{title}</div>

      <div className="flex flex-row gap-3">
        <button onClick={editBlog} className="p-2 border rounded-md text-md font-medium">Edit Post</button>
        <button onClick={deleteBlog} className="p-2 border rounded-md text-md font-medium text-white bg-red-500">Delete Post</button>
      </div>
		</div>
	);
};

export default BlogCard;
