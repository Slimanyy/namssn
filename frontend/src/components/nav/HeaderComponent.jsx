import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { ProfileImg } from "../../assets";
import { useDispatch } from "react-redux";
import { setNavOpen } from "../../redux/slices/navSlice";
import { IoChevronBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const HeaderComponent = ({ title, url, back }) => {
	const dispatch = useDispatch();
	const [search, setSearch] = useState("");
	const handleSearchChange = (e) => {
		e.preventDefault();
		if (e.target.value.trim() !== "") {
			setSearch(e.target.value);
		} else if (e.target.value.trim() === "" && search.trim() !== "") {
			setSearch(e.target.value);
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		window.location.href = `/search?key=${search}&filter=${selectedOption}`
		// console.log(e.target.value);
		// setSearch(e.target.value);
	};

	// navigate back to previous page
	const navigate = useNavigate();
	const handleBack = () => {
		navigate(-1);
	};

	// get user from redux
	const { userInfo } = useSelector((state) => state.auth);

	// get avatar from redux
	const Avatar = userInfo?.profilePicture || ProfileImg;

	// handle nav open with redux
	const handleNavOpen = () => {
		dispatch(setNavOpen());
	};

	const [selectedOption, setSelectedOption] = useState('all');
    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
    };

	return (
		<div className="flex flex-row md:justify-between items-center gap-2 p-5 md:py-2 border-b-2 border-gray-300 ">
			{back && (
				<div
					onClick={handleBack}
					className="text-2xl p-2 pr-5 cursor-pointer"
				>
					<IoChevronBackSharp />
				</div>
			)}
			<img
				src={Avatar}
				alt="avatar"
				className="lg:hidden profile-image-small"
				onClick={handleNavOpen}
			/>
			{/* <h1 className="text-xl text-center w-full md:text-3xl">{title}</h1> */}
			<div className="">
				<span className="px-4  font-bold font-crimson sm:text-xl text-blue-900 text-sm">{title.toUpperCase()}</span>
				{/* <div className="flex gap-2 mr-4">
					<span className="font-serif text-blue-900 text-[0.95em]">Filter: </span>
					<select value={selectedOption} onChange={handleSelectChange} name="dropdown" className="text-gray-300 block w-[55%] mt-1 p-2 border border-black rounded-md  focus:ring focus:ring-blue-200 focus:outline-none">
						<option value="all" className="text-black font-crimson text-lg">All</option>
						<option value="resources" className="text-black font-crimson text-lg">Resources</option>
						<option value="users" className="text-black font-crimson text-lg">Users</option>
						<option value="posts" className="text-black font-crimson text-lg">Post</option>
					</select>
				</div> */}
			</div>
			{url && (
				<form
					action=""
					onSubmit={handleSubmit}
					className="hidden md:flex  relative"
				>
					<input
						type="text"
						placeholder="Search"
						name="search"
						value={search}
						className="rounded-xl rounded-r-none border-gray-300 border-2 p-1 w-56 md:w-72 pl-3 pr-10"
						onChange={handleSearchChange}
					/>
					<a className="absolute right-0 flex self-center justify-center text-white bg-black p-2 rounded-none h-full hover:text-lg" href={`http://localhost:3000/search?key=${search}`}>
						<FaMagnifyingGlass  />
					</a>


					{/* <button className="border bg-gray-400 rounded-md">
						{" "}
						<a href={`http://localhost:3000/search?key=${search}`}>
							Go
						</a>
					</button> */}
				</form>
			)}
		</div>
	);
};

export default HeaderComponent;
