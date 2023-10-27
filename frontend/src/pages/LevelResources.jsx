import { useParams } from "react-router-dom";
import { ResourceCard } from "../components";
import { formatDateToTime } from "../utils";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaMagnifyingGlass } from "react-icons/fa6";

const base_url = "http://localhost:5000/api/v1/users/resources/";

const LevelResources = () => {
    const {level} = useParams()
    let modifiedString = level.replace(/ /g, " ");
    const [data, setData] = useState(null)
    const [tempData, setTempData] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/v1/users/${modifiedString}/resources/`);
                if (res) {
                    console.log(res);
                    setData(res.data); // set the fetched data to the state
                    setTempData(res.data)
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchData(); // call the fetchData function
    }, []);

    const [selectedOption, setSelectedOption] = useState('title');
    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
        };
    useEffect(() => {
    }, [selectedOption]);

    const [value, setValue] = useState("")

    const handleSearch = (e) => {
        setValue(e.target.value)
    }

    useEffect(() => {
            // console.log(value)
            if (value === '' && tempData) {
                setData(tempData)
            } else if (selectedOption && value !== '') {
                if (data && data.length !== 0) {
                    const myfileList = data.map(obj => Object.keys(obj)[0]);
                    console.log(myfileList)
                    const newData = [];
                    myfileList.map((file, index) => {
                        console.log(data[index][file][selectedOption])
                        if (data[index][file][selectedOption].toLowerCase().includes(value.toLowerCase())) {
                           newData.push({[file]: data[index][file]})
                           console.log(newData)
                            // Object.keys(tempData).forEach((key) => {
                            //     for (let j=0; j<tempData[key].length; j++) {
                            //         if (isSubDictPresent(tempData[key][j], {[file]: tempData2[index][file]})) {
                            //             console.log(file)
                            //             if (Object.keys(newData).includes(key)) {
                            //                 newData[[key]].push({[file]: tempData2[index][file]})
                            //             } else {
                            //                 newData[[key]] = [{[file]: tempData2[index][file]}]
                            //             }
                            //             console.log(newData)
                            //         }
                            //     }
                            // })
                            setData(newData)
                        };
                    });
                }
            }
            // console.log(data)
    
        }, [value]);
    
    if (data) {
        const fileList = data.map(obj => Object.keys(obj)[0])

        return (
            <div>
                <div className="mb-4 flex justify-between">
                    <span className="px-4 pb-4  font-bold font-crimson sm:text-xl text-blue-900 text-sm">RESOURCES</span>
                    <div className="flex gap-2 mr-4">
                        <span className="font-serif text-blue-900 text-[0.95em]">Filter: </span>
                        <select value={selectedOption} onChange={handleSelectChange} name="dropdown" className="text-gray-300 block w-[55%] mt-1 p-2 border border-black rounded-md  focus:ring focus:ring-blue-200 focus:outline-none">
                            <option value="title" className="text-black font-crimson text-lg">Title</option>
                            <option value="uploaderName" className="text-black font-crimson text-lg">Owner</option>
                        </select>
                    </div>
                </div>
                <div className="sticky bg-white shadow-lg border-2 z-10 pl-4 pr-4 top-[2%] left-[33%] border-gray-300 rounded-xl w-[50%]">
                    <div className="absolute  h-[100%] flex ">
                    <FaMagnifyingGlass  className="mt-1"/>
                    </div>
                    <input
                        type='input' placeholder="Search here"
                        className="bg-opacity-[100%] ml-2 pl-3 outline-none w-[95%]"
                        onChange={handleSearch}
                    />
                </div>
                {fileList.map((file, index) => ( 
                    <ResourceCard key={index} fileUrl={base_url + file} description={data[index][file]['description']}
                    uploaderUsername = {data[index][file]['uploaderUsername']}
                    title = {data[index][file]['title']}
                    date = {formatDateToTime(new Date(data[index][file]['date']))}
                    semester = {data[index][file]['semester']}
                    course = {data[index][file]['course']}
                    />
                ))}
            </div>
        )
    }
}

export default LevelResources;