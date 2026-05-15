/* eslint-disable no-unused-vars */
import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router";
import * as yup from "yup";

export default function Register() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");

  //*======> Sign up
  const signupSchema = yup.object({
    name: yup
      .string()
      .min(3, "name must be at least 3 characters")
      .max(100, "name must be below 100 characters")
      .required("name is required"),

    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),

    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const signupFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: signupSchema,

    onSubmit: async (values) => {
      setSignupError("");
      try {
        const { confirmPassword, ...signupData } = values;
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/signup`,
          signupData,
        );
        localStorage.setItem("user", JSON.stringify(response.data));
        window.dispatchEvent(new Event("storage"));
        navigate("/");
      } catch (err) {
        setSignupError(err.response?.data?.message || "Signup failed");
      }
    },
  });

  //&======> Login
  const loginSchema = yup.object({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),

    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  const loginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: loginSchema,

    onSubmit: async (values) => {
      setLoginError("");
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/login`,
          values,
        );
        localStorage.setItem("user", JSON.stringify(response.data));
        window.dispatchEvent(new Event("storage"));
        navigate("/");
      } catch (err) {
        setLoginError(err.response?.data?.message || "Invalid Credentials");
      }
    },
  });

  return (
    <div className="bg-base-200 min-h-screen py-16 px-4">
      <div className="container max-w-5xl">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="card bg-base-100 border border-base-200 shadow-lg">
            <div className="card-body p-8">
              <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
              <form onSubmit={loginFormik.handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="login-email" className="font-medium">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    className="input input-bordered w-full"
                    value={loginFormik.values.email}
                    name="email"
                    onChange={loginFormik.handleChange}
                    onBlur={loginFormik.handleBlur}
                  />
                  {loginFormik.errors.email && loginFormik.touched.email && (
                    <p className="text-sm text-error">*{loginFormik.errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="login-password" className="font-medium">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    className="input input-bordered w-full"
                    value={loginFormik.values.password}
                    name="password"
                    onChange={loginFormik.handleChange}
                    onBlur={loginFormik.handleBlur}
                  />
                  {loginFormik.errors.password && loginFormik.touched.password && (
                    <p className="text-sm text-error">*{loginFormik.errors.password}</p>
                  )}
                </div>

                <button type="submit" className="btn btn-primary w-full mt-2">
                  Login
                </button>
                {loginError && (
                  <p className="text-sm text-error text-center">{loginError}</p>
                )}
              </form>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-200 shadow-lg">
            <div className="card-body p-8">
              <h2 className="text-3xl font-bold text-center mb-6">Signup</h2>
              <form onSubmit={signupFormik.handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="signup-name" className="font-medium">
                    Name
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your name"
                    className="input input-bordered w-full"
                    value={signupFormik.values.name}
                    name="name"
                    onChange={signupFormik.handleChange}
                    onBlur={signupFormik.handleBlur}
                  />
                  {signupFormik.errors.name && signupFormik.touched.name && (
                    <p className="text-sm text-error">*{signupFormik.errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="signup-email" className="font-medium">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    className="input input-bordered w-full"
                    value={signupFormik.values.email}
                    name="email"
                    onChange={signupFormik.handleChange}
                    onBlur={signupFormik.handleBlur}
                  />
                  {signupFormik.errors.email && signupFormik.touched.email && (
                    <p className="text-sm text-error">*{signupFormik.errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="signup-password" className="font-medium">
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    className="input input-bordered w-full"
                    value={signupFormik.values.password}
                    name="password"
                    onChange={signupFormik.handleChange}
                    onBlur={signupFormik.handleBlur}
                  />
                  {signupFormik.errors.password && signupFormik.touched.password && (
                    <p className="text-sm text-error">*{signupFormik.errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="font-medium">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm a password"
                    className="input input-bordered w-full"
                    value={signupFormik.values.confirmPassword}
                    name="confirmPassword"
                    onChange={signupFormik.handleChange}
                    onBlur={signupFormik.handleBlur}
                  />
                  {signupFormik.errors.confirmPassword && signupFormik.touched.confirmPassword && (
                    <p className="text-sm text-error">*{signupFormik.errors.confirmPassword}</p>
                  )}
                </div>

                <button type="submit" className="btn btn-primary w-full mt-2">
                  Signup
                </button>
                {signupError && (
                  <p className="text-sm text-error text-center">{signupError}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
