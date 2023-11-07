import { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from 'yup';
import Loader from "../Loader";

const FileForm = (props) => {
    const textStyle = "font-bold font-roboto text-lg"
    const errorStyle = "text-red-500 text-sm";
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    
    useEffect(() => {
    }, [inputValue]);
    const [selectedOption1, setSelectedOption1] = useState("100 Level");
    const [selectedOption2, setSelectedOption2] = useState("option1");
    const handleSelectChange1 = (e) => {
        setSelectedOption1(e.target.value);
        };
    useEffect(() => {
    }, [selectedOption1]);

    const validationSchema = Yup.object().shape({
        file: Yup.mixed()
        .test('fileSize', 'File is too large', (value) => value && value.size <= 500000000)
        .test('fileType', 'Videos are not allowed', (value) => value && value.type && value.type.indexOf('video') === -1)
    });

    const formik = useFormik({
        initialValues: {
            file: null,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            const date = new Date();
            const formData = new FormData();
            formData.append('file', values.file);
            formData.append('userId', props.userId);
            formData.append('uploaderName', props.name);
            formData.append('description', inputValue);
            formData.append('date', date);
            formData.append('semester', selectedOption1);
            formData.append('course', selectedOption2)
            try {
                await toast.promise(axios.post('https://namssn-futminna.onrender.com/api/files/upload', formData), {
                    pending: 'Uploading file...',
                    success: 'File uploaded successfully',
                });
                setIsLoading(false);
                window.location.reload()
              } catch (err) {
                console.log(err);
                toast.error("File not uploaded, an error occurred");
                setIsLoading(false);
              }
        },
    });

    if(props.show) {
        return (
            <div className="w-[70%] flex flex-col bg-white gap-4 border rounded-[5%] px-[2.5%] py-[2.5%]">
                <form onSubmit={formik.handleSubmit}>
                    <div>
                        <span className={textStyle}> Level</span>
                        <select value={selectedOption1} onChange={handleSelectChange1} name="dropdown1" className="text-gray-300 block w-[80%] mt-1 p-2 border border-black rounded-md  focus:ring focus:ring-blue-200 focus:outline-none">
                            <option value="100 Level" className="text-black font-roboto text-lg">Year 1 </option>
                            <option value="200 Level" className="text-black font-roboto text-lg">Year 2 </option>
                            <option value="300 Level" className="text-black font-roboto text-lg">Year 3 </option>
                            <option value="400 Level" className="text-black font-roboto text-lg">Year 4 </option>
                            <option value="500 Level" className="text-black font-roboto text-lg">Year 5 </option>
                        </select>
                    </div>
                    <div className="flex flex-col mt-2 h-[7em]">
                        <span className={textStyle}> File Description </span>
                        <div className="h-[100%] w-[80%] mt-1 p-2 border border-black rounded-md  focus:ring focus:ring-blue-200">
                            <textarea
                            className="w-full resize-y h-full whitespace-wrap outline-none"
                            placeholder="Input file description (optional)"
                            type="text" value={inputValue} maxLength={100} onChange={(e) => setInputValue(e.target.value)} />
                         </div>
                    </div> 
                    <div className="mt-2 flex flex-col">
                        <span className={textStyle}> File </span>
                        <input
                            type="file" name="file" onChange={(event) => formik.setFieldValue("file", event.currentTarget.files[0])} onBlur={formik.handleBlur}
                        />
                        {formik.touched.file && formik.errors.file ? (
                            <div className={errorStyle}>{formik.errors.file}</div>
                        ) : null}
                    </div> 
                    <div className="flex justify-between mt-4">
                        <button className="py-2 px-4 hover:bg-red-900 bg-red-600 border rounded-lg text-white" onClick={props.onClose}>Cancel</button>
                        <button type="submit" className="py-2 px-4 bg-green-600 hover:bg-green-900 border rounded-lg text-white">Upload</button>
                    </div>
                </form>
                <ToastContainer/>
                {isLoading && <Loader />}
            </div>
        )
    }
}

export default FileForm;
