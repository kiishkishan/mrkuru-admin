/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../redux";
import { showToast } from "@/state/thunks/alertThunk";
import Image from "next/image";
import { useLoginUserMutation } from "@/state/api";
import { useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { setAuth } from "@/state/slices/authSlice";
import useRouterReady from "@/app/(hooks)/useRouterReady";

// Define form validation schema using Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const dispatch = useAppDispatch();

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { router } = useRouterReady();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated");
      router.push("/dashboard");
    }
  }, [router, isAuthenticated, dispatch]);

  const onSubmit = async (data: any) => {
    try {
      const response = await loginUser(data).unwrap();
      if (response.token) {
        console.log(response?.user.name, "login response");
        dispatch(showToast("Login successful", "success"));
        dispatch(
          setAuth({
            isAuthenticated: !isAuthenticated,
            token: response.token,
            userName: response?.user.name,
            userImage: response?.user.profileImage,
          })
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
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side (Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome back
          </h2>
          <p className="text-gray-600 mb-8">Please enter your details.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
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
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                )}
              />
              {errors?.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message?.toString()}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
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
                      type={showPassword ? "text" : "password"}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon size={18} />
                      ) : (
                        <EyeIcon size={18} />
                      )}
                    </button>
                  </div>
                )}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message?.toString()}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label htmlFor="remember" className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Remember for 30 days
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className={`${
                  isLoading
                    ? "bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                } w-full px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                disabled={isSubmitting}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <a
                href="signup"
                onClick={() => router.push("/signup")}
                className="font-bold text-blue-600 hover:text-blue-700"
              >
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side (Image) */}
      <div className="hidden md:block md:w-1/2 h-screen">
        <Image
          src="https://s3-mrkuru-inventorycmspos.s3.us-east-1.amazonaws.com/login.webp"
          alt="Login Visual"
          width={500}
          height={250}
          className="object-cover w-full h-full"
          priority
          quality={80}
          loading="eager"
        />
      </div>
    </div>
  );
};

export default LoginPage;
