"use client";

import useAuth from "@/app/(hooks)/useAuth";

const AuthProvider = () => {
  useAuth(); // ✅ Runs authentication logic on client-side
  return null; // No UI needed
};

export default AuthProvider;
