/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../redux";
import { showToast } from "@/state/thunks/alertThunk";
import Image from "next/image";
import { useLoginUserMutation } from "@/state/api";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { setAuth } from "@/state/slices/authSlice";

// Define form validation schema using Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const onSubmit = async (data: any) => {
    try {
      const response = await loginUser(data).unwrap();
      if (response.token) {
        dispatch(showToast("Login successful", "success"));
        dispatch(
          setAuth({ isAuthenticated: !isAuthenticated, token: response.token })
        );
        router.push("/dashboard");
        return;
      }
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Login failed";
      dispatch(showToast(errorMessage, "error"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-5xl">
        {/* Left Side (Form) */}
        <div className="w-full md:w-1/2 py-8 px-6 md:py-16 md:px-12 bg-blue-50 text-blue-600">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-600 mb-8">Please enter your details.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-1.5"
              >
                Email
              </label>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    id="email"
                    type="email"
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50"
                    placeholder="Enter your email"
                  />
                )}
              />
              <div className="h-4 pt-1 !text-red-500 text-xs italic">
                {errors?.email && <p>{errors.email?.message?.toString()}</p>}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password
              </label>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <div className="relative">
                    <input
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"} // ✅ Toggle input type
                      className="shadow appearance-none border rounded w-full py-3 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50"
                      placeholder="Enter your password"
                    />
                    {/* Eye Icon Button */}
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition-all duration-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon size={20} />
                      ) : (
                        <EyeIcon size={20} />
                      )}
                    </button>
                  </div>
                )}
              />
              <div className="h-4 pt-1 !text-red-500 text-xs italic">
                {errors.password && (
                  <p>{errors.password?.message?.toString()}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="remember" className="flex items-center">
                <input type="checkbox" id="remember" className="mr-2" />
                <span className="text-sm text-gray-700">
                  Remember for 30 days
                </span>
              </label>
              <a href="#" className="text-sm text-blue-500 hover:text-blue-700">
                Forgot password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                className={`${
                  isLoading
                    ? "bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                } text-white text-base font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform w-full hover:scale-y-110 hover:scale-x-105y`}
                disabled={isSubmitting}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </div>

            <p className="text-center text-gray-700 text-sm">
              Don&apos;t have an account?
              <a
                href="#"
                className="font-bold text-blue-500 hover:text-blue-700"
              >
                {""} Sign Up
              </a>
            </p>
          </form>
        </div>

        {/* Right Side (Image) */}
        <div className="hidden md:block md:w-1/2">
          <Image
            src="https://s3-mrkuru-inventorycmspos.s3.us-east-1.amazonaws.com/login.webp"
            alt="Login Visual"
            width={500}
            height={250}
            className="object-cover w-full h-full"
            quality={80}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
