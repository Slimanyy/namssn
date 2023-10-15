import { FaMagnifyingGlass } from "react-icons/fa6";
import { Avatar } from "../assets";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setNavOpen } from "../redux/slices/navSlice";

const HeaderComponent = ({ title }) => {
	const dispatch = useDispatch();
	const [search, setSearch] = useState("");
	const handleSearchChange = (e) => {
		e.preventDefault();
		setSearch(e.target.value);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(search);
		setSearch("");
	}

	// handle nav open with redux
	const handleNavOpen = () => {
		dispatch(setNavOpen());
	};

	return (
		<div className="flex flex-row-reverse md:justify-between items-center p-5 md:py-2 border-b-2 border-gray-300 " >
			<img src={Avatar} alt="avatar" className="md:hidden" onClick={handleNavOpen}/>

			<h1 className="text-xl text-center w-full md:text-3xl">{title}</h1>
			<form action="" onSubmit={handleSubmit} className="hidden md:flex  relative">
				<input
					type="text"
					placeholder="Search"
					name="search"
					value={search}
					className="rounded-2xl border-gray-300 border-2 p-1 w-56 md:w-72 pl-10"
					onChange={handleSearchChange}
				/>
				<FaMagnifyingGlass className="absolute left-2 flex self-center justify-center" />
			</form>
		</div>
	);
};

export default HeaderComponent;
