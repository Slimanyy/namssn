/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';

import { useLoginMutation, setCredentials } from '../../redux';
import FormErrors from './FormErrors';
import InputField from "../InputField";

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [ login, { isLoading }]= useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/home');
    }
  }, [navigate, userInfo]);

	// Schema and configuration for form validation
	const initialvalues = {
		email: "",
		password: "",
	};
	const validationSchema = Yup.object({
		email: Yup.string()
			.required("This field is required")
			.min(5, "Must be 5 characters or more")
			.max(30, "Too long"),

		password: Yup.string()
			.required("This field is required")
			.min(8, "Must be 8 characters or more"),
	});
	const formik = useFormik({
		initialValues: initialvalues,
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			try {
        const res = await login(values).unwrap();
        dispatch(setCredentials({...res}));
        navigate('/home');
      } catch (err) {
        console.log(err?.data?.message || err?.error)
      }
		},
	});

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};
  return (
    <form
    onSubmit={formik.handleSubmit}
    className="flex flex-col m-5 mt-16"
  >
    <label htmlFor="email">Email</label>
    <InputField
      type="text"
      name="email"
      id="email"
      onChange={formik.handleChange}
      onBlur={formik.handleBlur("email")}
      value={formik.values.email}
    />

    {formik.touched.email &&
    formik.errors.email ? (
      <FormErrors error={formik.errors.email} />
    ) : null}

    <label className="mt-2" htmlFor="password">
      Password
    </label>
    <div className="relative flex">
      <InputField
        type={showPassword ? "text" : "password"}
        name="password"
        id="password"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur("password")}
        value={formik.values.password}
      />
      {showPassword ? (
        <FaRegEyeSlash
          className="absolute right-2 flex self-center justify-center"
          onClick={handleShowPassword}
        />
      ) : (
        <FaRegEye
          className="absolute right-2 flex self-center justify-center"
          onClick={handleShowPassword}
        />
      )}

      {/* Focused state not working for some reason */}
    </div>

    {formik.touched.password && formik.errors.password ? (
      <FormErrors error={formik.errors.password} />
    ) : null}

    <div className="text-gray-500 text-right text-md">
      Forgot Password?
    </div>
    <button
      type="submit"
      className="bg-black p-2 w-full text-white rounded-lg hover:bg-slate-700 my-5"
    >
      Log In
    </button>

    <div className="text-right">
      Don&rsquo;t have an account?{" "}
      <Link to="/signup" className="text-primary">
        Sign Up
      </Link>
    </div>
  </form>
  )
}

export default SignInForm