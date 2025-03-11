"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { EyeIcon, EyeOffIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid"; // Import UUID v4
import useRouterReady from "@/app/(hooks)/useRouterReady";
import { useAppDispatch } from "../redux";
import { showToast } from "@/state/thunks/alertThunk";
import { useSignUpUserMutation } from "@/state/api";

type SignupFormData = {
  userId: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImage?: File;
};

// Define form validation schema using Zod
const signupSchema = z
  .object({
    userName: z
      .string()
      .min(3, "User Name must be at least 3 characters")
      .max(12, "User Name must be at most 12 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    profileImage: z
      .custom<File>((file) => file instanceof File, {
        message: "Profile image is required",
      })
      .refine((file) => file && file.type.startsWith("image/"), {
        message: "Only image files are allowed",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const [signUpUser] = useSignUpUserMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const { router } = useRouterReady();

  const onSubmit = async (signupFormData: SignupFormData) => {
    try {
      // Generate UUID v4 for userId
      const userId = uuidv4();
      const submitFormData = { ...signupFormData, userId };
      setImagePreview(null);

      // Prepare form data for submission
      console.log("Signup form data:", submitFormData);
      const response = await signUpUser(submitFormData).unwrap();

      if (response) {
        reset();
        dispatch(showToast("Signup successful", "success"));
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }
    } catch (error) {
      console.error("Signup error:", error);
      dispatch(showToast("Signup failed. Please try again.", "error"));
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("profileImage", null as unknown as File);
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
                name="userName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    id="userName"
                    type="text"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your username"
                  />
                )}
              />
              {errors?.userName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.userName.message?.toString()}
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
                Profile Image
              </label>
              <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={96}
                        height={96}
                        priority
                        quality={40}
                        className="object-cover rounded-md mx-auto"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-3 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <Controller
                        name="profileImage"
                        control={control}
                        render={({ field }) => (
                          <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => {
                              console.log("produtImage", e.target.files);
                              field.onChange(e.target.files?.[0]);
                              handleImageChange(e);
                            }}
                          />
                        )}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              </div>
              {errors.profileImage && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.profileImage.message}
                </p>
              )}
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
          quality={80}
        />
      </div>
    </div>
  );
};

export default SignupPage;
