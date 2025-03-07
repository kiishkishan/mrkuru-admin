/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid"; // Import UUID v4
import useRouterReady from "@/app/(hooks)/useRouterReady";

// Define form validation schema using Zod
const signupSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    profileImage: z.instanceof(File).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const { router } = useRouterReady();

  const onSubmit = async (data: any) => {
    try {
      // Generate UUID v4 for userId
      const userId = uuidv4();

      // Prepare form data for submission
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (data.profileImage) {
        formData.append("profileImage", data.profileImage);
      }

      // Submit data to the API
      const response = await fetch("/api/signup", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      const result = await response.json();
      console.log("Signup successful:", result);

      // Redirect or show success message
      alert("Signup successful!");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed. Please try again.");
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side (Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            Create an Account
          </h2>
          <p className="text-gray-600 mb-8">
            Join us an admin to our Mr.Kuru platform.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <Controller
                name="username"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    id="username"
                    type="text"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your username"
                  />
                )}
              />
              {errors?.username && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.username.message?.toString()}
                </p>
              )}
            </div>

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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <Controller
                name="confirmPassword"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <div className="relative">
                    <input
                      {...field}
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon size={18} />
                      ) : (
                        <EyeIcon size={18} />
                      )}
                    </button>
                  </div>
                )}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message?.toString()}
                </p>
              )}
            </div>

            {/* Profile Image Upload */}
            <div>
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium text-gray-700"
              >
                Profile Image (Optional)
              </label>
              <Controller
                name="profileImage"
                control={control}
                render={({ field }) => (
                  <div>
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        field.onChange(e.target.files?.[0]);
                        handleImageChange(e);
                      }}
                    />
                    <label
                      htmlFor="profileImage"
                      className="mt-1 flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
                    >
                      {previewImage ? (
                        <Image
                          src={previewImage}
                          alt="Profile Preview"
                          width={80}
                          height={80}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm text-gray-500">
                          Upload Profile Image
                        </span>
                      )}
                    </label>
                  </div>
                )}
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-base font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform w-full hover:scale-y-110 hover:scale-x-105y"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </button>
            </div>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="login"
                onClick={() => router.push("/login")}
                className="font-bold text-blue-500 hover:text-blue-700"
              >
                Sign In
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side (Image) */}
      <div className="hidden md:block md:w-1/2 h-screen">
        <Image
          src="https://s3-mrkuru-inventorycmspos.s3.us-east-1.amazonaws.com/signup.webp"
          alt="Signup"
          width={500}
          height={250}
          className="object-cover w-full h-full"
          priority
        />
      </div>
    </div>
  );
};

export default SignupPage;
